const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');

// Strict rate limiting for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  skipSuccessfulRequests: true,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' }
});

// Helper: send token as cookie + JSON
const sendTokenResponse = (admin, statusCode, res) => {
  const token = admin.getSignedJwtToken();
  const isProd = process.env.NODE_ENV === 'production';
  const options = {
    expires: new Date(Date.now() + (parseInt(process.env.JWT_COOKIE_EXPIRE) || 7) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  };
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      admin: { id: admin._id, email: admin.email, name: admin.name },
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/setup
// Creates the first admin account if none exists.
// Uses ADMIN_EMAIL and ADMIN_PASSWORD from environment variables.
// Returns 403 once an admin already exists — safe to leave in production.
// Visit this URL once in your browser after first deploy:
//   https://your-render-app.onrender.com/api/auth/setup
// ─────────────────────────────────────────────────────────────────────────────
router.get('/setup', async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    if (count > 0) {
      return res.status(403).json({
        success: false,
        message: 'Setup already complete. Admin account exists.',
      });
    }

    const email    = process.env.ADMIN_EMAIL    || 'admin@isaacmathenge.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@SecurePass123!';
    const name     = 'Isaac Mathenge';

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      return res.status(400).json({
        success: false,
        message: 'Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables in Render first, then visit this URL.',
      });
    }

    const admin = await Admin.create({ email, password, name });

    res.status(201).json({
      success: true,
      message: '✅ Admin account created! You can now log in.',
      email: admin.email,
      note: 'This endpoint is now disabled since an admin exists.',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', loginLimiter, [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    admin.lastLogin = Date.now();
    await admin.save({ validateBeforeSave: false });
    sendTokenResponse(admin, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    admin: { id: req.admin._id, email: req.admin.email, name: req.admin.name, lastLogin: req.admin.lastLogin }
  });
});

// POST /api/auth/logout
router.post('/logout', protect, (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.json({ success: true, message: 'Logged out successfully' });
});

// PUT /api/auth/password
router.put('/password', protect, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }).withMessage('Min 8 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const admin = await Admin.findById(req.admin._id).select('+password');
    if (!(await admin.matchPassword(req.body.currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    admin.password = req.body.newPassword;
    await admin.save();
    sendTokenResponse(admin, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
