const express = require('express');
const { bookTicket, getTickets } = require('../controllers/ticketController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Use authentication middleware for all routes
router.use(verifyToken);

// Ticket routes
router.get('/tickets', getTickets); // Fetch tickets
router.post('/book', bookTicket); // Book tickets

module.exports = router;
