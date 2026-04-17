const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Flight = sequelize.define('Flight', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    airline: {
        type: DataTypes.STRING,
        allowNull: false
    },
    flight_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    from: {
        type: DataTypes.STRING,
        allowNull: false
    },
    to: {
        type: DataTypes.STRING,
        allowNull: false
    },
    from_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    to_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departure_time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    arrival_time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stops: {
        type: DataTypes.STRING,
        defaultValue: 'Non-stop'
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    business_price: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    first_class_price: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    gate: {
        type: DataTypes.STRING
    },
    terminal_from: {
        type: DataTypes.STRING
    },
    terminal_to: {
        type: DataTypes.STRING
    },
    aircraft: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'On Time'
    },
    available_seats: {
        type: DataTypes.INTEGER,
        defaultValue: 150
    }
}, {
    tableName: 'flights',
    timestamps: false
});

module.exports = Flight;