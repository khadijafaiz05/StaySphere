const jwt = require('jsonwebtoken');
const JWT_SECRET = 'staysphere_secret_key_2026';

exports.auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admin only' });
  next();
};