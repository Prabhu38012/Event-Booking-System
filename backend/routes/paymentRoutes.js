const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  generateUPIQR,
  createStripeIntent,
  confirmStripePayment,
  createFreeBooking
} = require('../controllers/paymentController');

// Razorpay routes
router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
router.post('/razorpay/generate-qr', protect, generateUPIQR);

// Stripe routes
router.post('/stripe/create-intent', protect, createStripeIntent);
router.post('/stripe/confirm', protect, confirmStripePayment);

// Free booking
router.post('/free-booking', protect, createFreeBooking);

module.exports = router;
