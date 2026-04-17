const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, 'secretkey123');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const bookings = [];

// Create booking
router.post('/', auth, (req, res) => {
  const { flightId, passengers, totalAmount } = req.body;
  
  const booking = {
    id: bookings.length + 1,
    bookingReference: 'BK' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    userId: req.userId,
    flightId,
    passengers,
    totalAmount,
    status: 'confirmed',
    bookingDate: new Date().toISOString()
  };
  
  bookings.push(booking);
  res.status(201).json({ success: true, booking });
});

// Get user bookings
router.get('/my-bookings', auth, (req, res) => {
  const userBookings = bookings.filter(b => b.userId === req.userId);
  res.json(userBookings);
});

// Get booking by ID
router.get('/:bookingId', auth, (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.bookingId));
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  if (booking.userId !== req.userId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  res.json(booking);
});

module.exports = router;