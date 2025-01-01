const jwt = require('jsonwebtoken');
const User = require('../models/Users');

// Verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log("Token: ", token);

  if (!token) {
    return res.status(403).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Check if user is an organizer
const isOrganizer = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'organizer') {
      return res.status(403).json({ message: 'Only organizers can access this route' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking user role' });
  }
};

module.exports = {
    verifyToken,
    isOrganizer
}