const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes, Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ============= DATABASE CONNECTION =============
const sequelize = new Sequelize('airline_db', 'root', 'root123', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// Test database connection
sequelize.authenticate()
    .then(() => console.log('✅ MySQL connected successfully'))
    .catch(err => console.error('❌ Unable to connect to MySQL:', err));

// ============= MODELS =============

// User Model
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users',
    timestamps: false
});

// Flight Model
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

// Booking Model
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

// SeatMap Model
const SeatMap = sequelize.define('SeatMap', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    flightId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'flights',
            key: 'id'
        }
    },
    rows: {
        type: DataTypes.INTEGER,
        defaultValue: 10
    },
    seatsPerRow: {
        type: DataTypes.INTEGER,
        defaultValue: 4
    },
    bookedSeats: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    selectedSeats: {
        type: DataTypes.JSON,
        defaultValue: []
    }
}, {
    tableName: 'seatmaps',
    timestamps: false
});

// Relationships
Booking.belongsTo(Flight, { foreignKey: 'flightId', as: 'flight' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
SeatMap.belongsTo(Flight, { foreignKey: 'flightId', as: 'flight' });

// ============= SYNC DATABASE =============
sequelize.sync({ alter: true })
    .then(() => {
        console.log(' Database synced');
        initializeSampleData();
    })
    .catch(err => console.error(' Database sync error:', err));

// Initialize sample data
async function initializeSampleData() {
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
        console.log(' Sample flight data inserted');
    }
}

// ============= API ROUTES =============

// Register User
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone
        });
        
        // Generate token
        const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '24h' });
        
        const { password: _, ...userWithoutPassword } = user.toJSON();
        res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate token
        const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '24h' });
        
        const { password: _, ...userWithoutPassword } = user.toJSON();
        res.json({ user: userWithoutPassword, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const user = await User.findByPk(decoded.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const { password, ...userWithoutPassword } = user.toJSON();
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Update user profile
app.put('/api/user/profile', async (req, res) => {
    try {
        const token = req.headers['x-auth-token'];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, 'your_jwt_secret');
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { firstName, lastName, email, phone } = req.body;

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email is already in use' });
            }
        }

        user.firstName = firstName ?? user.firstName;
        user.lastName = lastName ?? user.lastName;
        user.email = email ?? user.email;
        user.phone = phone ?? user.phone;

        await user.save();

        const { password, ...userWithoutPassword } = user.toJSON();
        res.json({ user: userWithoutPassword });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all flights
app.get('/api/flights', async (req, res) => {
    try {
        const flights = await Flight.findAll();
        res.json(flights);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search flights
app.get('/api/flights/search', async (req, res) => {
    try {
        let { from, to } = req.query;

        from = from?.trim().toLowerCase();
        to = to?.trim().toLowerCase();

        const whereConditions = [];

        if (from) {
            whereConditions.push(
                sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('from')),
                    {
                        [Op.like]: `%${from}%`
                    }
                )
            );
        }

        if (to) {
            whereConditions.push(
                sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('to')),
                    {
                        [Op.like]: `%${to}%`
                    }
                )
            );
        }

        const flights = await Flight.findAll({
            where: whereConditions.length > 0 ? { [Op.and]: whereConditions } : {}
        });
        res.json(flights);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single flight
app.get('/api/flights/:id', async (req, res) => {
    try {
        const flight = await Flight.findByPk(req.params.id);
        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' });
        }
        res.json(flight);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get seat map for flight
app.get('/api/flights/:flightId/seats', async (req, res) => {
    try {
        let seatMap = await SeatMap.findOne({ 
            where: { flightId: req.params.flightId } 
        });
        
        if (!seatMap) {
            seatMap = await SeatMap.create({
                flightId: req.params.flightId,
                rows: 10,
                seatsPerRow: 4,
                bookedSeats: [],
                selectedSeats: []
            });
        }
        
        res.json(seatMap);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update seat selection
app.post('/api/flights/:flightId/seats', async (req, res) => {
    try {
        const { selectedSeats } = req.body;
        
        const [seatMap, created] = await SeatMap.findOrCreate({
            where: { flightId: req.params.flightId },
            defaults: {
                flightId: req.params.flightId,
                rows: 10,
                seatsPerRow: 4,
                bookedSeats: [],
                selectedSeats: selectedSeats
            }
        });
        
        if (!created) {
            seatMap.selectedSeats = selectedSeats;
            await seatMap.save();
        }
        
        res.json({ success: true, selectedSeats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
    try {
        const { flightId, passengerDetails, selectedSeats, travelClass, totalAmount } = req.body;
        
        // Generate unique PNR
        const pnr = 'PNR' + Date.now() + Math.floor(Math.random() * 1000);
        
        const booking = await Booking.create({
            pnr,
            flightId,
            passengerDetails,
            selectedSeats,
            travelClass,
            totalAmount,
            status: 'confirmed'
        });
        
        // Update seat map
        let seatMap = await SeatMap.findOne({ where: { flightId } });
        if (seatMap) {
            const updatedBookedSeats = [...seatMap.bookedSeats, ...selectedSeats];
            seatMap.bookedSeats = updatedBookedSeats;
            seatMap.selectedSeats = [];
            await seatMap.save();
        }
        
        // Update available seats
        const flight = await Flight.findByPk(flightId);
        if (flight) {
            flight.available_seats -= selectedSeats.length;
            await flight.save();
        }
        
        // Get complete booking with flight details
        const completeBooking = await Booking.findByPk(booking.id, {
            include: [{ model: Flight, as: 'flight' }]
        });
        
        res.status(201).json(completeBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Get booking by PNR
app.get('/api/bookings/:pnr', async (req, res) => {
    try {
        const booking = await Booking.findOne({
            where: { pnr: req.params.pnr },
            include: [{ model: Flight, as: 'flight' }]
        });
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user bookings
app.get('/api/bookings/user/:email', async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [{ model: Flight, as: 'flight' }]
        });
        
        // Filter by email in passengerDetails
        const userBookings = bookings.filter(b => 
            b.passengerDetails.email === req.params.email
        );
        
        res.json(userBookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancel booking
app.put('/api/bookings/:pnr/cancel', async (req, res) => {
    try {
        console.log(req)
        console.log(res)
        const booking = await Booking.findOne({ where: { pnr: req.params.pnr } });//monogo db me jaa ke check karega 
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        booking.status = 'cancelled';
        await booking.save();
        
        // Update available seats
        const flight = await Flight.findByPk(booking.flightId);
        if (flight) {
            flight.available_seats += booking.selectedSeats.length;
            await flight.save();
        }
         console.log(res)
        res.json({ success: true, message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check-in
app.post('/api/checkin', async (req, res) => {
    try {
        const { pnr, lastName } = req.body;
        
        const booking = await Booking.findOne({
            where: { pnr },
            include: [{ model: Flight, as: 'flight' }]
        });
        
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        if (booking.passengerDetails.lastName.toLowerCase() !== lastName.toLowerCase()) {
            return res.status(401).json({ error: 'Invalid last name' });
        }
        
        if (booking.status !== 'confirmed') {
            return res.status(400).json({ error: 'Booking is not confirmed' });
        }
        
        res.json({
            success: true,
            booking: booking,
            boardingPass: {
                passengerName: `${booking.passengerDetails.title} ${booking.passengerDetails.firstName} ${booking.passengerDetails.lastName}`,
                flightNumber: booking.flight.flight_number,
                flight: booking.flight,
                from: booking.flight.from_code,
                to: booking.flight.to_code,
                date: new Date().toISOString().split('T')[0],
                departureTime: booking.flight.departure_time,
                arrivalTime: booking.flight.arrival_time,
                seat: booking.selectedSeats[0],
                class: booking.travelClass,
                gate: booking.flight.gate,
                pnr: booking.pnr,
                status: 'Checked-in'
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Flight status
app.get('/api/flights/:flightNumber/status', async (req, res) => {
    try {
        const flight = await Flight.findOne({
            where: { flight_number: req.params.flightNumber }
        });
        
        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' });
        }
        
        res.json(flight);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get flight by number
app.get('/api/flights/number/:flightNumber', async (req, res) => {
    try {
        const flight = await Flight.findOne({
            where: { flight_number: req.params.flightNumber }
        });
        
        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' });
        }
        
        res.json(flight);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all bookings (admin)
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: Flight, as: 'flight' },
                { model: User, as: 'user' }
            ]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ MySQL database connected`);
});