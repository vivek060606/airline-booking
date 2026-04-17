const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SeatMap = sequelize.define('SeatMap', {
  flightId: DataTypes.INTEGER,
  bookedSeats: DataTypes.JSON,
  selectedSeats: DataTypes.JSON
}, {
  tableName: 'seatmaps',
  timestamps: false
});

module.exports = SeatMap;