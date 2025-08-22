const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getConfig } = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Create order requires authentication so we can associate user later if needed
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/config', getConfig);

// Admin: list payments
router.get('/', protect, admin, async (_req, res) => {
  const Payment = require('../models/paymentModel');
  const items = await Payment.find({}).sort({ createdAt: -1 }).populate('user', 'name email');
  res.json(items);
});

module.exports = router;


