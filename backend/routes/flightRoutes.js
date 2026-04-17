const express = require('express');
const router = express.Router();
const {
    getAllFlights,
    searchFlights,
    getFlightById,
    getFlightByNumber,
    getFlightStatus,
    getSeats,
    updateSeats
} = require('../controllers/flightController');

router.get('/', getAllFlights);
router.get('/search', searchFlights);
router.get('/number/:flightNumber', getFlightByNumber);
router.get('/:flightNumber/status', getFlightStatus);
router.get('/:id', getFlightById);
router.get('/:flightId/seats', getSeats);
router.post('/:flightId/seats', updateSeats);

module.exports = router;