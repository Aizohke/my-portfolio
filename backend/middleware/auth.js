const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

/**
 * Protect routes using Clerk.
 * Verifies the session token sent automatically by the frontend.
 * Requires CLERK_SECRET_KEY in Render environment variables.
 */
exports.protect = ClerkExpressRequireAuth({
  onError: (err, req, res) => {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — invalid or missing session',
    });
  },
});
