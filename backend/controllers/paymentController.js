const Razorpay = require('razorpay');
const crypto = require('crypto');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { eventId, numberOfTickets } = req.body;

    // Check if Razorpay is configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(200).json({
        mockMode: true,
        message: 'Razorpay not configured'
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const amount = event.pricing.amount * numberOfTickets * 100; // Convert to paise

    const options = {
      amount,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        eventId: event._id.toString(),
        userId: req.user._id.toString(),
        numberOfTickets
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Verify Razorpay Payment
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
      numberOfTickets,
      attendeeInfo
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Create booking
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const booking = await Booking.create({
      event: eventId,
      user: req.user._id,
      numberOfTickets,
      totalAmount: event.pricing.amount * numberOfTickets,
      paymentStatus: 'completed',
      paymentMethod: 'razorpay',
      paymentDetails: {
        transactionId: razorpay_payment_id,
        orderId: razorpay_order_id
      },
      attendeeInfo,
      bookingDate: new Date(),
      status: 'confirmed'
    });

    await booking.populate('event');

    res.json({
      success: true,
      message: 'Payment verified successfully',
      booking
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Generate UPI QR Code
exports.generateUPIQR = async (req, res) => {
  try {
    const { eventId, numberOfTickets } = req.body;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(400).json({ message: 'Razorpay not configured' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const amount = event.pricing.amount * numberOfTickets * 100; // Convert to paise

    const qrCode = await razorpay.qrCode.create({
      type: 'upi_qr',
      name: event.title,
      usage: 'single_use',
      fixed_amount: true,
      payment_amount: amount,
      description: `Payment for ${event.title}`,
      customer_id: req.user._id.toString(),
      close_by: Math.floor(Date.now() / 1000) + 900 // 15 minutes
    });

    res.json({
      success: true,
      qrCode: qrCode.image_url,
      qrCodeId: qrCode.id
    });
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Stripe Payment Intent
exports.createStripeIntent = async (req, res) => {
  try {
    const { eventId, numberOfTickets } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Mock mode if Stripe not configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.json({
        mockMode: true,
        clientSecret: 'mock',
        message: 'Stripe not configured'
      });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const amount = event.pricing.amount * numberOfTickets * 100; // Convert to paise

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'inr',
      metadata: {
        eventId: event._id.toString(),
        userId: req.user._id.toString(),
        numberOfTickets
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Stripe intent error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Confirm Stripe Payment
exports.confirmStripePayment = async (req, res) => {
  try {
    const { paymentIntentId, eventId, numberOfTickets, attendeeInfo } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const booking = await Booking.create({
      event: eventId,
      user: req.user._id,
      numberOfTickets,
      totalAmount: event.pricing.amount * numberOfTickets,
      paymentStatus: 'completed',
      paymentMethod: 'stripe',
      paymentDetails: {
        transactionId: paymentIntentId
      },
      attendeeInfo,
      bookingDate: new Date(),
      status: 'confirmed'
    });

    await booking.populate('event');

    res.json({
      success: true,
      message: 'Payment confirmed',
      booking
    });
  } catch (error) {
    console.error('Stripe confirmation error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Free Booking
exports.createFreeBooking = async (req, res) => {
  try {
    const { eventId, numberOfTickets, attendeeInfo } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.pricing.type !== 'free') {
      return res.status(400).json({ message: 'This is not a free event' });
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

    await booking.populate('event');

    res.json({
      success: true,
      message: 'Free booking confirmed',
      booking
    });
  } catch (error) {
    console.error('Free booking error:', error);
    res.status(400).json({ message: error.message });
  }
};
