const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

// Add baggage
router.post('/:bookingId/add-baggage', auth, async (req, res) => {
  try {
    const { passengerIndex, additionalCheckedBags, specialItems } = req.body;
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      userId: req.userId
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const passenger = booking.passengers[passengerIndex];
    const additionalCost = additionalCheckedBags * 30; // $30 per extra bag
    
    passenger.baggage.checked += additionalCheckedBags;
    passenger.baggage.specialItems = specialItems || [];
    passenger.baggage.additionalCost = additionalCost;
    
    booking.finalAmount += additionalCost;
    await booking.save();

    // Generate baggage tag
    const baggageTag = {
      tagNumber: `BG${Date.now()}${passengerIndex}`,
      passengerName: `${passenger.firstName} ${passenger.lastName}`,
      flightNumber: (await booking.populate('flightId')).flightId.flightNumber,
      weight: passenger.baggage.weight,
      items: passenger.baggage.checked,
      specialItems
    };

    res.json({
      message: 'Baggage added successfully',
      additionalCost,
      totalBaggage: passenger.baggage.checked,
      baggageTag
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding baggage' });
  }
});

// Track baggage
router.get('/:bookingId/track-baggage', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      userId: req.userId
    }).populate('flightId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Simulate baggage tracking status
    const trackingStatus = booking.passengers.map(passenger => ({
      passenger: `${passenger.firstName} ${passenger.lastName}`,
      bags: passenger.baggage.checked,
      status: 'Loaded on aircraft',
      lastUpdate: new Date(),
      location: booking.flightId.origin.airport
    }));

    res.json(trackingStatus);
  } catch (error) {
    res.status(500).json({ message: 'Error tracking baggage' });
  }
});

module.exports = router;