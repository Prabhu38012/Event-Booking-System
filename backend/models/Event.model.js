import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    enum: ['music', 'sports', 'conference', 'workshop', 'theater', 'other'],
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  venue: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  date: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  pricing: {
    type: {
      type: String,
      enum: ['free', 'paid'],
      default: 'paid'
    },
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  capacity: {
    total: {
      type: Number,
      required: true,
      min: 1
    },
    booked: {
      type: Number,
      default: 0
    },
    available: {
      type: Number
    }
  },
  images: [{
    url: String,
    public_id: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'published'
  },
  tags: [String],
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Calculate available seats before saving
eventSchema.pre('save', function(next) {
  this.capacity.available = this.capacity.total - this.capacity.booked;
  next();
});

// Index for search optimization
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });
eventSchema.index({ 'venue.city': 1, 'date.start': 1 });

export default mongoose.model('Event', eventSchema);
