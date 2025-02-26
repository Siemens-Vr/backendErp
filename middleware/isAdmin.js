const jwt = require('jsonwebtoken');

module.exports = function isAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Bearer header

    if (!token) {
      return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded.role !== 'Admin') {
      return res.status(403).json({ message: 'Access Denied. You are not an Admin.' });
    }

    req.user = decoded; // Attach user details to request object
    next(); // Continue to next middleware or controller
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or Expired Token' });
  }
};
