const { Op } = require('sequelize');
const sequelize = require('../config/db');
const { Flight, SeatMap } = require('../models');

const getAllFlights = async (req, res) => {
    try {
        const flights = await Flight.findAll();
        res.json(flights);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const searchFlights = async (req, res) => {
    try {
        let { from, to } = req.query;

        from = from?.trim().toLowerCase();
        to = to?.trim().toLowerCase();

        const whereConditions = [];

        if (from) {
            whereConditions.push(
                sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('from')),
                    { [Op.like]: `%${from}%` }
                )
            );
        }

        if (to) {
            whereConditions.push(
                sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('to')),
                    { [Op.like]: `%${to}%` }
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
};

const getFlightById = async (req, res) => {
    try {
        const flight = await Flight.findByPk(req.params.id);
        if (!flight) {
            return res.status(404).json({ error: 'Flight not found' });
        }
        res.json(flight);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getFlightByNumber = async (req, res) => {
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
};

const getFlightStatus = async (req, res) => {
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
};

const getSeats = async (req, res) => {
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
};

const updateSeats = async (req, res) => {
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
};

module.exports = {
    getAllFlights,
    searchFlights,
    getFlightById,
    getFlightByNumber,
    getFlightStatus,
    getSeats,
    updateSeats
};