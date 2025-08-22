const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/paymentModel');

const getRazorpayKeys = () => ({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// GET /api/payments/config
// Surface whether keys are configured so the UI can toggle Pay Now visibility/enabled state
exports.getConfig = asyncHandler(async (req, res) => {
  const { key_id, key_secret } = getRazorpayKeys();
  res.json({ enabled: Boolean(key_id && key_secret), keyId: key_id || null });
});

// POST /api/payments/create-order
exports.createOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body || {};
  if (!amount || Number(amount) <= 0) {
    res.status(400);
    throw new Error('Amount is required (in paise)');
  }

  const { key_id, key_secret } = getRazorpayKeys();
  if (!key_id || !key_secret) {
    res.status(400);
    throw new Error('Razorpay keys are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
  }

  try {
    const instance = new Razorpay({ key_id, key_secret });
    const order = await instance.orders.create({
      amount: Math.round(Number(amount)),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    });

    // Persist created order
    await Payment.create({
      user: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: 'created',
      meta: { notes: order.notes || null },
    });

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: key_id,
    });
  } catch (err) {
    res.status(502);
    throw new Error(err?.message || 'Failed to create payment order');
  }
});

// POST /api/payments/verify
exports.verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error('Invalid payment verification payload');
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    res.status(400);
    throw new Error('Payment verification secret not configured');
  }
  const sign = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const isValid = sign === razorpay_signature;
  if (!isValid) {
    res.status(400);
    throw new Error('Payment verification failed');
  }

  await Payment.findOneAndUpdate(
    { orderId: razorpay_order_id },
    { paymentId: razorpay_payment_id, status: 'paid' },
    { new: true }
  );

  res.json({ success: true });
});


