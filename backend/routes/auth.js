const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// ─────────────────────────────────────────────────────────────────────────────
// With Clerk, login/logout/session are handled entirely on the frontend.
// The backend only needs one route — /me — to confirm the session is valid
// and return the user info from the Clerk session token.
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/auth/me — verify session and return user info
router.get('/me', protect, (req, res) => {
  const { userId, sessionId } = req.auth;
  res.json({
    success: true,
    admin: {
      id: userId,
      sessionId,
    },
  });
});

// GET /api/auth/setup — no longer needed with Clerk
// User management is done in the Clerk dashboard at dashboard.clerk.com
router.get('/setup', (req, res) => {
  res.json({
    success: true,
    message: 'Using Clerk auth. Manage users at https://dashboard.clerk.com',
  });
});

module.exports = router;
