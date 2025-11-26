import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  numberOfTickets: {
    type: Number,
    required: true,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  payment: {
    paymentId: String,
    orderId: String,
    method: {
      type: String,
      enum: ['razorpay', 'stripe', 'free', 'mock', 'card', 'upi', 'netbanking', 'wallet', 'emi', 'cardless_emi', 'paylater'],
      default: 'razorpay'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date
  },
  bookingCode: {
    type: String,
    unique: true
  },
  attendeeInfo: {
    name: String,
    email: String,
    phone: String
  },
  lockExpiry: Date // For temporary seat locking
}, { timestamps: true });

// Generate unique booking code
bookingSchema.pre('save', function(next) {
  if (!this.bookingCode) {
    this.bookingCode = `BK${Date.now()}${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);
