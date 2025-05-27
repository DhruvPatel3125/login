const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route to create a Razorpay order
router.post('/create-order', paymentController.createOrder);

// Route to verify payment signature (TODO: Implement verification logic in controller)
router.post('/verify-payment', paymentController.verifyPayment);

module.exports = router; 