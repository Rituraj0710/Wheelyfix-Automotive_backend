const asyncHandler = require('express-async-handler');
const Booking = require('../models/bookingModel');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    email,
    vehicleType,
    vehicleModel,
    serviceType,
    date,
    timeSlot,
    address,
    notes,
  } = req.body;

  if (!name || !phone || !email || !vehicleType || !vehicleModel || !serviceType || !date || !timeSlot || !address) {
    res.status(400);
    throw new Error('Missing required booking fields');
  }

  const booking = await Booking.create({
    user: req.user._id,
    name,
    phoneNumber: phone,
    email,
    vehicleType,
    vehicleModel,
    serviceType,
    date: new Date(date),
    timeSlot,
    address,
    notes,
  });

  res.status(201).json(booking);
});

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(bookings);
});

module.exports = { createBooking, getMyBookings };


