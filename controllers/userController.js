const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { 
    name, 
    email, 
    password, 
    phoneNumber,
    address,
    vehicles 
  } = req.body;

  // Validate input fields
  if (!name || !email || !password || !phoneNumber) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Please enter a valid email address');
  }

  // Phone number validation
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phoneNumber)) {
    res.status(400);
    throw new Error('Please enter a valid 10-digit phone number');
  }

  // Check if user already exists
  const userExists = await User.findOne({ 
    $or: [
      { email: email.toLowerCase() },
      { phoneNumber }
    ]
  });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email or phone number');
  }

  // Validate password strength
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phoneNumber,
    address: address || {},
    vehicles: vehicles || []
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      vehicles: user.vehicles,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      vehicles: user.vehicles,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  // In a real implementation with server-side sessions, you would invalidate the session here
  // Since we're using JWT tokens stored in localStorage on the client side,
  // the actual logout happens on the client by removing the token
  
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = { authUser, registerUser, getUserProfile, logoutUser };
