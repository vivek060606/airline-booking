const { Booking, Flight, User, SeatMap } = require('../models');

const createBooking = async (req, res) => {
    try {
        const { flightId, passengerDetails, selectedSeats, travelClass, totalAmount } = req.body;

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

        const completeBooking = await Booking.findByPk(booking.id, {
            include: [{ model: Flight, as: 'flight' }]
        });

        res.status(201).json(completeBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getBookingByPNR = async (req, res) => {
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
};

const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [{ model: Flight, as: 'flight' }]
        });

        const userBookings = bookings.filter(b =>
            b.passengerDetails.email === req.params.email
        );

        res.json(userBookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const cancelBooking = async (req, res) => {
    try {
        console.log(req);
        console.log(res);
        const booking = await Booking.findOne({ where: { pnr: req.params.pnr } });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        booking.status = 'cancelled';
        await booking.save();

        const flight = await Flight.findByPk(booking.flightId);
        if (flight) {
            flight.available_seats += booking.selectedSeats.length;
            await flight.save();
        }

        console.log(res);
        res.json({ success: true, message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllBookings = async (req, res) => {
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
};

const checkIn = async (req, res) => {
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
};

module.exports = {
    createBooking,
    getBookingByPNR,
    getUserBookings,
    cancelBooking,
    getAllBookings,
    checkIn
};