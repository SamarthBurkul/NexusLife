const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * JWT Authentication Middleware
 * Verifies the Bearer token from the Authorization header
 * and attaches decoded user data to req.user
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  // Debug logging
  console.log('[AUTH] Request to:', req.path);
  console.log('[AUTH] Headers received:', Object.keys(req.headers));
  console.log('[AUTH] Authorization header:', authHeader ? `${authHeader.substring(0, 30)}...` : 'MISSING');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('[AUTH] ❌ No valid Bearer token - authHeader:', authHeader);
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexuslife_jwt_secret_change_in_production');
    console.log('[AUTH] ✅ Token verified for user:', decoded.id);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('[AUTH] ❌ Token verification failed:', err.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
