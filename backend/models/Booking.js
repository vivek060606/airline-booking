const mongoose = require('mongoose');

const PassengerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  passportNumber: String,
  seatNumber: String,
  class: String,
  baggage: {
    checked: Number,
    carryOn: Number,
    weight: Number
  }
});

const BookingSchema = new mongoose.Schema({
  bookingReference: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flightId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  passengers: [PassengerSchema],
  totalAmount: Number,
  discountApplied: Number,
  finalAmount: Number,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'checked-in'],
    default: 'pending'
  },
  paymentId: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  cancellationDate: Date,
  refundAmount: Number
});

module.exports = mongoose.model('Booking', BookingSchema);