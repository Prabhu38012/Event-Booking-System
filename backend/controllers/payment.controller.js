import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Event from '../models/Event.model.js';
import Booking from '../models/Booking.model.js';
import { sendBookingConfirmation } from '../utils/email.js';
import { sendBookingSMS } from '../utils/sms.js';

// Lazy initialization for Razorpay
let razorpay = null;
const getRazorpay = () => {
  if (!razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    try {
      razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });
      console.log('✅ Razorpay initialized successfully');
    } catch (error) {
      console.error('❌ Razorpay initialization failed:', error.message);
    }
  }
  return razorpay;
};

// Initialize Stripe
let stripe = null;
if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('YOUR_')) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  console.log('✅ Stripe initialized');
}

// ==================== RAZORPAY PAYMENTS ====================

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay/create-order
// @access  Private
export const createRazorpayOrder = async (req, res) => {
  try {
    console.log('=== Razorpay Order Request ===');
    console.log('Body:', req.body);
    console.log('User:', req.user?._id);
    
    const { eventId, numberOfTickets } = req.body;

    // Validation
    if (!eventId || !numberOfTickets) {
      console.log('Validation failed: Missing eventId or numberOfTickets');
      return res.status(400).json({ message: 'Event ID and number of tickets are required' });
    }

    if (numberOfTickets < 1) {
      console.log('Validation failed: Invalid numberOfTickets');
      return res.status(400).json({ message: 'Number of tickets must be at least 1' });
    }

    // Get Razorpay instance (lazy initialization)
    const razorpayInstance = getRazorpay();
    if (!razorpayInstance) {
      console.log('Razorpay not initialized');
      return res.status(400).json({
        message: 'Razorpay payment gateway is not configured. Please contact support.',
        error: 'Payment gateway not available'
      });
    }

    const event = await Event.findById(eventId);
    console.log('Event found:', event?._id, event?.title);
    
    if (!event) {
      console.log('Event not found');
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event has valid pricing
    console.log('Event pricing:', event.pricing);
    
    if (!event.pricing || typeof event.pricing.amount !== 'number') {
      console.log('Invalid pricing structure');
      return res.status(400).json({ 
        message: 'Event pricing not configured properly',
        pricing: event.pricing 
      });
    }

    if (event.pricing.type === 'free') {
      console.log('Free event');
      return res.status(400).json({ message: 'This is a free event, use free booking endpoint' });
    }

    // Calculate amount in paise (must be integer and > 0)
    const amountInRupees = event.pricing.amount * numberOfTickets;
    const amountInPaise = Math.round(amountInRupees * 100);

    console.log('Amount calculation:', {
      pricePerTicket: event.pricing.amount,
      numberOfTickets,
      amountInRupees,
      amountInPaise
    });

    if (amountInPaise <= 0) {
      console.log('Invalid amount calculated');
      return res.status(400).json({ 
        message: 'Invalid amount calculated. Event price might be 0',
        details: { amountInRupees, amountInPaise }
      });
    }

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${event._id.toString().slice(-6)}`,
      notes: {
        eventId: event._id.toString(),
        eventTitle: event.title,
        userId: req.user._id.toString(),
        numberOfTickets: numberOfTickets.toString()
      }
    };

    console.log('Creating Razorpay order with options:', options);
    const order = await razorpayInstance.orders.create(options);
    console.log('Order created successfully:', order.id);
    
    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: 'INR'
    });
  } catch (error) {
    console.error('=== Razorpay Order Error ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(400).json({ 
      message: error.message || 'Failed to create order',
      error: error.error?.description || error.message
    });
  }
};

// @desc    Verify Razorpay payment and create booking
// @route   POST /api/payments/razorpay/verify
// @access  Private
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      eventId,
      numberOfTickets,
      attendeeInfo
    } = req.body;

    const razorpayInstance = getRazorpay();
    if (!razorpayInstance) {
      return res.status(400).json({ message: 'Razorpay not configured' });
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Get payment details from Razorpay
    const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      numberOfTickets,
      totalAmount: payment.amount / 100, // Convert from paise
      status: 'confirmed',
      payment: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        method: payment.method, // card, upi, netbanking, wallet
        status: 'completed',
        paidAt: new Date()
      },
      attendeeInfo
    });

    // Update event capacity
    event.capacity.booked += numberOfTickets;
    await event.save();

    // Send confirmation email
    try {
      await sendBookingConfirmation({
        email: attendeeInfo.email || req.user.email,
        name: attendeeInfo.name || req.user.name,
        eventTitle: event.title,
        bookingCode: booking.bookingCode,
        numberOfTickets,
        totalAmount: booking.totalAmount
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    // Send confirmation SMS
    try {
      await sendBookingSMS({
        phone: attendeeInfo.phone || req.user.phone,
        name: attendeeInfo.name || req.user.name,
        eventTitle: event.title,
        bookingCode: booking.bookingCode
      });
    } catch (smsError) {
      console.error('SMS sending failed:', smsError);
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`event:${eventId}`).emit('seats:updated', { 
        eventId, 
        availableSeats: event.capacity.available 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      booking
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate UPI QR code
// @route   POST /api/payments/razorpay/generate-qr
// @access  Private
export const generateUPIQR = async (req, res) => {
  try {
    console.log('=== QR Code Request ===');
    console.log('Body:', req.body);
    console.log('User:', req.user?._id);
    
    const { eventId, numberOfTickets } = req.body;

    // Validation
    if (!eventId || !numberOfTickets) {
      console.log('Validation failed: Missing eventId or numberOfTickets');
      return res.status(400).json({ message: 'Event ID and number of tickets are required' });
    }

    if (numberOfTickets < 1) {
      console.log('Validation failed: Invalid numberOfTickets');
      return res.status(400).json({ message: 'Number of tickets must be at least 1' });
    }

    // Get Razorpay instance (lazy initialization)
    const razorpayInstance = getRazorpay();
    if (!razorpayInstance) {
      console.log('Razorpay not initialized');
      return res.status(400).json({ 
        message: 'Razorpay payment gateway is not configured',
        error: 'Payment gateway not available'
      });
    }

    const event = await Event.findById(eventId);
    console.log('Event found:', event?._id, event?.title);
    
    if (!event) {
      console.log('Event not found');
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event has valid pricing
    console.log('Event pricing:', event.pricing);
    
    if (!event.pricing || typeof event.pricing.amount !== 'number') {
      console.log('Invalid pricing structure');
      return res.status(400).json({ 
        message: 'Event pricing not configured properly',
        pricing: event.pricing 
      });
    }

    if (event.pricing.type === 'free') {
      console.log('Free event');
      return res.status(400).json({ message: 'This is a free event' });
    }

    // Calculate amount in paise
    const amountInRupees = event.pricing.amount * numberOfTickets;
    const amountInPaise = Math.round(amountInRupees * 100);

    if (amountInPaise <= 0) {
      console.log('Invalid amount calculated');
      return res.status(400).json({ 
        message: 'Invalid amount calculated. Event price might be 0',
        details: { amountInRupees, amountInPaise }
      });
    }

    console.log('Generating QR Code:', {
      eventId: event._id,
      amountInRupees,
      amountInPaise,
      numberOfTickets
    });

    // Try to create QR code, fallback if API not enabled
    try {
      const qrCodeData = {
        type: 'upi_qr',
        name: event.title.substring(0, 50),
        usage: 'single_use',
        fixed_amount: true,
        payment_amount: amountInPaise,
        description: `Booking for ${event.title}`.substring(0, 100),
        customer_id: req.user._id.toString(),
        close_by: Math.floor(Date.now() / 1000) + 900
      };

      console.log('Calling Razorpay QR API with:', qrCodeData);
      const qrCode = await razorpayInstance.qrCode.create(qrCodeData);
      console.log('QR Code created successfully');

      res.json({
        success: true,
        qrCode: qrCode.image_url,
        qrCodeId: qrCode.id
      });
    } catch (qrError) {
      console.error('Razorpay QR Code API error:', qrError);
      
      // Fallback: Generate a generic UPI payment link QR
      const upiString = `upi://pay?pa=merchant@paytm&pn=${encodeURIComponent(event.title)}&am=${amountInRupees.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Booking for ' + event.title)}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}`;
      
      console.log('Using fallback QR code');
      
      res.json({
        success: true,
        qrCode: qrCodeUrl,
        qrCodeId: 'fallback_' + Date.now(),
        mockMode: true,
        message: 'QR Code API not available. Using fallback QR code.'
      });
    }
  } catch (error) {
    console.error('=== QR Generation Error ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    
    res.status(400).json({ 
      message: error.message,
      error: error.error?.description || error.message
    });
  }
};

// ==================== STRIPE PAYMENTS ====================

// @desc    Create Stripe payment intent
// @route   POST /api/payments/stripe/create-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    const { eventId, numberOfTickets } = req.body;

    if (!stripe) {
      return res.status(200).json({
        success: true,
        mockMode: true,
        clientSecret: 'mock_' + Date.now(),
        message: 'Stripe not configured. Using mock mode.'
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const amount = event.pricing.amount * numberOfTickets;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to smallest currency unit
      currency: 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        eventId: event._id.toString(),
        userId: req.user.id,
        numberOfTickets: numberOfTickets.toString()
      }
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      mockMode: false
    });
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm Stripe payment and create booking
// @route   POST /api/payments/stripe/confirm
// @access  Private
export const confirmStripePayment = async (req, res) => {
  try {
    const { paymentIntentId, eventId, numberOfTickets, attendeeInfo } = req.body;

    if (!stripe) {
      // Mock mode - create booking directly
      return createMockBooking(req, res, eventId, numberOfTickets, attendeeInfo);
    }

    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      numberOfTickets,
      totalAmount: paymentIntent.amount / 100,
      status: 'confirmed',
      payment: {
        paymentId: paymentIntentId,
        method: 'stripe',
        status: 'completed',
        paidAt: new Date()
      },
      attendeeInfo
    });

    // Update event capacity
    event.capacity.booked += numberOfTickets;
    await event.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`event:${eventId}`).emit('seats:updated', { 
        eventId, 
        availableSeats: event.capacity.available 
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Stripe confirm error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Handle Stripe webhook
// @route   POST /api/payments/stripe/webhook
// @access  Public
export const handleStripeWebhook = async (req, res) => {
  if (!stripe) {
    return res.status(400).json({ message: 'Stripe not configured' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('Payment succeeded:', event.data.object.id);
      break;
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};

// ==================== FREE EVENT BOOKING ====================

// @desc    Book free event
// @route   POST /api/payments/free-booking
// @access  Private
export const createFreeBooking = async (req, res) => {
  try {
    const { eventId, numberOfTickets, attendeeInfo } = req.body;

    // Validation
    if (!eventId || !numberOfTickets || !attendeeInfo) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (numberOfTickets < 1) {
      return res.status(400).json({ message: 'Number of tickets must be at least 1' });
    }

    // Validate attendee info
    if (!attendeeInfo.name || !attendeeInfo.email || !attendeeInfo.phone) {
      return res.status(400).json({ message: 'Complete attendee information required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.pricing.type !== 'free') {
      return res.status(400).json({ message: 'This is not a free event. Payment required.' });
    }

    // Check seat availability
    if (event.capacity.booked + numberOfTickets > event.capacity.total) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const booking = await Booking.create({
      event: eventId,
      user: req.user._id,
      numberOfTickets,
      totalAmount: 0,
      paymentStatus: 'completed',
      paymentMethod: 'free',
      attendeeInfo,
      bookingDate: new Date(),
      status: 'confirmed'
    });

    // Update event capacity
    event.capacity.booked += numberOfTickets;
    await event.save();

    await booking.populate('event');

    res.json({
      success: true,
      message: 'Free booking confirmed successfully',
      booking
    });
  } catch (error) {
    console.error('Free booking error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Helper function for mock booking
const createMockBooking = async (req, res, eventId, numberOfTickets, attendeeInfo) => {
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      numberOfTickets,
      totalAmount: event.pricing.amount * numberOfTickets,
      status: 'confirmed',
      payment: {
        paymentId: 'mock_' + Date.now(),
        method: 'mock',
        status: 'completed',
        paidAt: new Date()
      },
      attendeeInfo
    });

    event.capacity.booked += numberOfTickets;
    await event.save();

    res.status(200).json({
      success: true,
      booking,
      mockMode: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment configuration
// @route   GET /api/payments/config
// @access  Public
export const getPaymentConfig = async (req, res) => {
  res.status(200).json({
    success: true,
    razorpay: {
      enabled: !!razorpay,
      keyId: process.env.RAZORPAY_KEY_ID || null
    },
    stripe: {
      enabled: !!stripe,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null
    }
  });
};
