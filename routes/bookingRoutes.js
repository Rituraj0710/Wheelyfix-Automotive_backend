const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');
const Booking = require('../models/bookingModel');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);

// Admin: list all bookings and update status
router.get('/', protect, admin, async (req, res) => {
  const list = await Booking.find({}).sort({ createdAt: -1 }).populate('user', 'name email');
  res.json(list);
});

router.put('/:id/status', protect, admin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const allowed = ['upcoming', 'completed', 'cancelled'];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }
  const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  res.json(booking);
});

module.exports = router;


