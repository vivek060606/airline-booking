const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  seatNumber: String,
  class: {
    type: String,
    enum: ['economy', 'business', 'first'],
    default: 'economy'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  price: Number,
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const FlightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true
  },
  airline: String,
  origin: {
    code: String,
    city: String,
    airport: String
  },
  destination: {
    code: String,
    city: String,
    airport: String
  },
  departureTime: Date,
  arrivalTime: Date,
  duration: Number,
  seats: [SeatSchema],
  status: {
    type: String,
    enum: ['scheduled', 'delayed', 'cancelled', 'boarding', 'departed', 'arrived'],
    default: 'scheduled'
  },
  delayMinutes: {
    type: Number,
    default: 0
  },
  basePrice: {
    economy: Number,
    business: Number,
    first: Number
  },
  availableSeats: {
    economy: Number,
    business: Number,
    first: Number
  }
});

module.exports = mongoose.model('Flight', FlightSchema);