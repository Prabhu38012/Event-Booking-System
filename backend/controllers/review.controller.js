import Review from '../models/Review.model.js';
import Event from '../models/Event.model.js';
import Booking from '../models/Booking.model.js';

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { event, rating, comment } = req.body;

    // Check if user has attended the event
    const booking = await Booking.findOne({
      user: req.user.id,
      event,
      status: 'confirmed'
    });

    if (!booking) {
      return res.status(400).json({ 
        message: 'You can only review events you have attended' 
      });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      user: req.user.id,
      event
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this event' });
    }

    const review = await Review.create({
      user: req.user.id,
      event,
      rating,
      comment
    });

    // Update event average rating
    await updateEventRating(event);

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get event reviews
// @route   GET /api/reviews/event/:eventId
// @access  Public
export const getEventReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ event: req.params.eventId })
      .populate('user', 'name avatar')
      .sort('-createdAt');

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Update event average rating
    await updateEventRating(review.event);

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check ownership
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const eventId = review.event;
    await review.deleteOne();

    // Update event average rating
    await updateEventRating(eventId);

    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to update event rating
const updateEventRating = async (eventId) => {
  const reviews = await Review.find({ event: eventId });
  
  if (reviews.length === 0) {
    await Event.findByIdAndUpdate(eventId, {
      averageRating: 0,
      totalReviews: 0
    });
    return;
  }

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  await Event.findByIdAndUpdate(eventId, {
    averageRating: averageRating.toFixed(1),
    totalReviews: reviews.length
  });
};
