import express from 'express';
import {
  createPaymentIntent,
  confirmStripePayment,
  handleStripeWebhook,
  createRazorpayOrder,
  verifyRazorpayPayment,
  generateUPIQR,
  createFreeBooking,
  getPaymentConfig
} from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Payment config
router.get('/config', getPaymentConfig);

// Free booking
router.post('/free-booking', protect, createFreeBooking);

// Stripe routes
router.post('/stripe/create-intent', protect, createPaymentIntent);
router.post('/stripe/confirm', protect, confirmStripePayment);
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Razorpay routes
router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.post('/razorpay/generate-qr', protect, generateUPIQR);

export default router;
