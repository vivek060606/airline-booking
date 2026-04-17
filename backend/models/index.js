
const sequelize = require('../config/db');
const User = require('./User');
const Flight = require('./Flight');
const Booking = require('./Booking');
const SeatMap = require('./SeatMap');

// Relationships
Booking.belongsTo(Flight, { foreignKey: 'flightId', as: 'flight' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
SeatMap.belongsTo(Flight, { foreignKey: 'flightId', as: 'flight' });

// Sync and seed
async function initializeDatabase() {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');
    await seedFlights();
}

async function seedFlights() {
    const flightCount = await Flight.count();
    if (flightCount === 0) {
        const sampleFlights = [
            {
                airline: 'Air India',
                flight_number: 'AI101',
                from: 'Delhi',
                to: 'Mumbai',
                from_code: 'DEL',
                to_code: 'BOM',
                departure_time: '08:30',
                arrival_time: '10:45',
                duration: '2h 15m',
                stops: 'Non-stop',
                price: 4250,
                business_price: 12500,
                first_class_price: 25000,
                gate: 'G12',
                terminal_from: 'T3',
                terminal_to: 'T2',
                aircraft: 'Boeing 737',
                status: 'On Time',
                available_seats: 150
            },
            {
                airline: 'Air India Express',
                flight_number: 'IX202',
                from: 'Delhi',
                to: 'Mumbai',
                from_code: 'DEL',
                to_code: 'BOM',
                departure_time: '14:20',
                arrival_time: '16:50',
                duration: '2h 30m',
                stops: 'Non-stop',
                price: 3850,
                business_price: 9900,
                first_class_price: 18900,
                gate: 'G8',
                terminal_from: 'T3',
                terminal_to: 'T2',
                aircraft: 'Airbus A320',
                status: 'On Time',
                available_seats: 120
            },
            {
                airline: 'SpiceJet',
                flight_number: 'SG303',
                from: 'Delhi',
                to: 'Mumbai',
                from_code: 'DEL',
                to_code: 'BOM',
                departure_time: '18:45',
                arrival_time: '21:05',
                duration: '2h 20m',
                stops: 'Non-stop',
                price: 4150,
                business_price: 10800,
                first_class_price: 19900,
                gate: 'G15',
                terminal_from: 'T1',
                terminal_to: 'T2',
                aircraft: 'Boeing 737-800',
                status: 'On Time',
                available_seats: 140
            },
            {
                airline: 'GoAir',
                flight_number: 'G8404',
                from: 'Delhi',
                to: 'Mumbai',
                from_code: 'DEL',
                to_code: 'BOM',
                departure_time: '06:15',
                arrival_time: '10:00',
                duration: '3h 45m',
                stops: '1 Stop',
                price: 5200,
                business_price: 13500,
                first_class_price: 24000,
                gate: 'G5',
                terminal_from: 'T3',
                terminal_to: 'T2',
                aircraft: 'Airbus A320neo',
                status: 'Delayed',
                available_seats: 100
            },
            {
                airline: 'Vistara',
                flight_number: 'UK505',
                from: 'Delhi',
                to: 'Mumbai',
                from_code: 'DEL',
                to_code: 'BOM',
                departure_time: '12:00',
                arrival_time: '14:10',
                duration: '2h 10m',
                stops: 'Non-stop',
                price: 6500,
                business_price: 16500,
                first_class_price: 32000,
                gate: 'G20',
                terminal_from: 'T3',
                terminal_to: 'T2',
                aircraft: 'Boeing 787',
                status: 'On Time',
                available_seats: 160
            }
        ];

        await Flight.bulkCreate(sampleFlights);
        console.log('✅ Sample flight data inserted');
    }
}

module.exports = { sequelize, User, Flight, Booking, SeatMap, initializeDatabase };