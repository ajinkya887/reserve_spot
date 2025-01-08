const jwt = require('jsonwebtoken');
const User = require('../models/Users');

// Verify JWT Token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Bearer header

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
    const user = await User.findById(decoded.userId); // Find the user in the database

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = {
      userId: user._id,
      name: user.userName,
      email: user.email,
    }; // Attach user to the request object

    req.userId = user._id; // For convenience
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Invalid or expired token' });
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