const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    pnr: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    flightId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'flights',
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    passengerDetails: {
        type: DataTypes.JSON,
        allowNull: false
    },
    selectedSeats: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    travelClass: {
        type: DataTypes.STRING,
        defaultValue: 'Economy'
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'confirmed'
    },
    bookingDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'bookings',
    timestamps: false
});

module.exports = Booking;