const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  logoutUser,
} = require('../controllers/userController');
const { testConnection } = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(registerUser);
router.post('/login', authUser);
router.post('/logout', protect, logoutUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/test-connection').get(testConnection);

module.exports = router;
