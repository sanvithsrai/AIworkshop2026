const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sahyadri_placement_secret_key_2026_jwt_token';

// Require authenticated user
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please login.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token. Please re-login.' });
  }
};

// Optional auth (populates req.user if token is present)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // Ignore token failure for optional auth
    }
  }
  next();
};

// Require specific role (e.g. 'faculty' or 'student')
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (req.user.role !== role && req.user.role !== 'admin' && req.user.role !== 'faculty') {
      return res.status(403).json({ error: `Access forbidden: Requires ${role} privileges.` });
    }
    next();
  };
};

module.exports = {
  requireAuth,
  optionalAuth,
  requireRole,
  JWT_SECRET
};

