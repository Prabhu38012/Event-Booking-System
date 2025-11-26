import Booking from '../models/Booking.model.js';
import Event from '../models/Event.model.js';
import { emitSeatUpdate, emitBookingCreated } from '../socket/socket.js';

// @desc    Lock seats temporarily
// @route   POST /api/bookings/lock-seats
// @access  Private
export const lockSeats = async (req, res) => {
  try {
    const { eventId, numberOfTickets } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.capacity.available < numberOfTickets) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Create temporary booking with lock
    const lockExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      numberOfTickets,
      totalAmount: event.pricing.amount * numberOfTickets,
      status: 'pending',
      lockExpiry
    });

    // Update event capacity
    event.capacity.booked += numberOfTickets;
    await event.save();

    // Emit real-time update
    const io = req.app.get('io');
    emitSeatUpdate(io, eventId, event.capacity.available);

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unlock seats
// @route   POST /api/bookings/unlock-seats
// @access  Private
export const unlockSeats = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Booking cannot be unlocked' });
    }

    const event = await Event.findById(booking.event);
    event.capacity.booked -= booking.numberOfTickets;
    await event.save();

    await booking.deleteOne();

    // Emit real-time update
    const io = req.app.get('io');
    emitSeatUpdate(io, event._id, event.capacity.available);

    res.status(200).json({ success: true, message: 'Seats unlocked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { eventId, numberOfTickets, paymentId, attendeeInfo } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.capacity.available < numberOfTickets) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      numberOfTickets,
      totalAmount: event.pricing.amount * numberOfTickets,
      status: 'confirmed',
      payment: {
        paymentId,
        method: event.pricing.type === 'free' ? 'free' : 'stripe',
        status: 'completed',
        paidAt: new Date()
      },
      attendeeInfo
    });

    // Update event capacity
    event.capacity.booked += numberOfTickets;
    await event.save();

    // Emit real-time updates
    const io = req.app.get('io');
    emitSeatUpdate(io, eventId, event.capacity.available);
    emitBookingCreated(io, eventId, booking);

    // TODO: Send confirmation email/SMS

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event', 'title date venue images')
      .sort('-createdAt');

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check ownership
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check ownership
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Release seats
    const event = await Event.findById(booking.event);
    event.capacity.booked -= booking.numberOfTickets;
    await event.save();

    // Emit real-time update
    const io = req.app.get('io');
    emitSeatUpdate(io, event._id, event.capacity.available);

    // TODO: Process refund if applicable

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
