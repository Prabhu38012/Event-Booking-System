import express from 'express';
import {
  createReview,
  getEventReviews,
  updateReview,
  deleteReview
} from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/event/:eventId', getEventReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
