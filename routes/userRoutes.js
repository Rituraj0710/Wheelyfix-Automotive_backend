const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  logoutUser,
  updateUserProfile,
  uploadAvatar,
  updateUserRole,
} = require('../controllers/userController');
const { testConnection } = require('../controllers/testController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists before handling multipart
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Simple disk storage for avatars
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user._id}${ext}`);
  },
});
const upload = multer({ storage });

router.route('/').post(registerUser);
router.post('/login', authUser);
router.post('/logout', protect, logoutUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.route('/test-connection').get(testConnection);

// Admin: list users
router.get('/', protect, admin, async (req, res) => {
  const User = require('../models/userModel');
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// Admin: update role
router.put('/:id/role', protect, admin, updateUserRole);

module.exports = router;
