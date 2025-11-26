import express from 'express';
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvents
} from '../controllers/event.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(protect, authorize('organizer', 'admin'), createEvent);

router.get('/search', searchEvents);

router.route('/:id')
  .get(getEvent)
  .put(protect, authorize('organizer', 'admin'), updateEvent)
  .delete(protect, authorize('organizer', 'admin'), deleteEvent);

export default router;
