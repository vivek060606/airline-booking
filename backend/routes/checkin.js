const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const auth = require('../middleware/auth');
const QRCode = require('qrcode');

// Online check-in
router.post('/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      userId: req.userId
    }).populate('flightId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const hoursToDeparture = Math.ceil((booking.flightId.departureTime - new Date()) / (1000 * 60 * 60));
    
    if (hoursToDeparture < 2) {
      return res.status(400).json({ message: 'Check-in closed. Please check-in at airport counter.' });
    }

    if (hoursToDeparture > 48) {
      return res.status(400).json({ message: 'Check-in opens 48 hours before departure' });
    }

    if (booking.status === 'checked-in') {
      return res.status(400).json({ message: 'Already checked in' });
    }

    booking.status = 'checked-in';
    await booking.save();

    // Generate boarding pass data
    const boardingPassData = {
      bookingReference: booking.bookingReference,
      passengerName: `${booking.passengers[0].firstName} ${booking.passengers[0].lastName}`,
      flightNumber: booking.flightId.flightNumber,
      from: booking.flightId.origin.code,
      to: booking.flightId.destination.code,
      seat: booking.passengers[0].seatNumber,
      departureTime: booking.flightId.departureTime,
      gate: booking.flightId.gate || 'TBD',
      boardingTime: new Date(booking.flightId.departureTime.getTime() - 45 * 60000)
    };

    // Generate QR code
    const qrCode = await QRCode.toDataURL(JSON.stringify(boardingPassData));

    res.json({
      message: 'Check-in successful',
      boardingPass: {
        ...boardingPassData,
        qrCode
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during check-in', error: error.message });
  }
});

// Get boarding pass
router.get('/:bookingId/boarding-pass', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      userId: req.userId
    }).populate('flightId');

    if (!booking || booking.status !== 'checked-in') {
      return res.status(400).json({ message: 'Please complete check-in first' });
    }

    const boardingPassData = {
      bookingReference: booking.bookingReference,
      passengerName: `${booking.passengers[0].firstName} ${booking.passengers[0].lastName}`,
      flightNumber: booking.flightId.flightNumber,
      from: booking.flightId.origin.code,
      to: booking.flightId.destination.code,
      seat: booking.passengers[0].seatNumber,
      class: booking.passengers[0].class,
      departureTime: booking.flightId.departureTime,
      gate: booking.flightId.gate || 'TBD',
      terminal: booking.flightId.terminal || 'TBD'
    };

    const qrCode = await QRCode.toDataURL(JSON.stringify(boardingPassData));

    res.json({
      boardingPass: {
        ...boardingPassData,
        qrCode
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating boarding pass' });
  }
});

module.exports = router;