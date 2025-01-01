const express = require("express");
const { createEvent, getEventsByOrganizer, updateEvent, deleteEvent } = require('../controllers/eventController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

// Apply the authentication middleware for all event routes
router.use(verifyToken);

// Event routes
router.post('/create', createEvent); // Organizer creates event
router.get('/my-events', getEventsByOrganizer); // Get all events of the logged-in organizer
router.put('/:eventId', updateEvent); // Update event
router.delete('/:eventId', deleteEvent); // Delete event

module.exports = router;