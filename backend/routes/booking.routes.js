import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  lockSeats,
  unlockSeats
} from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createBooking);
router.post('/lock-seats', lockSeats);
router.post('/unlock-seats', unlockSeats);
router.get('/user', getUserBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

export default router;
