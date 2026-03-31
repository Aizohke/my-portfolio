const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Protect routes — verifies JWT from Authorization header OR httpOnly cookie
 */
exports.protect = async (req, res, next) => {
  let token;

  // Check Authorization header first
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Then check cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized — no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id);
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Admin not found' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized — invalid token' });
  }
};
