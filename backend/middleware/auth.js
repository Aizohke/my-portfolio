const Clerk = require('@clerk/clerk-sdk-node');

/**
 * protect middleware — verifies Clerk JWT sent as Authorization: Bearer <token>
 * 
 * Requires CLERK_SECRET_KEY in Render environment variables.
 */
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized — no token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the Clerk session token
    const payload = await Clerk.verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!payload) {
      return res.status(401).json({ success: false, message: 'Not authorized — invalid token' });
    }

    req.auth = payload;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ success: false, message: 'Not authorized — ' + err.message });
  }
};
