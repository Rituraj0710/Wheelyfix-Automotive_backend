const asyncHandler = require('express-async-handler');

// @desc    Test connection endpoint
// @route   GET /api/users/test-connection
// @access  Public
const testConnection = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Backend connection successful',
    timestamp: new Date().toISOString()
  });
});

module.exports = { testConnection };