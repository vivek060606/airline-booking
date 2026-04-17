const express = require('express');
const router = express.Router();
const {
    createBooking,
    getBookingByPNR,
    getUserBookings,
    cancelBooking,
    getAllBookings,
    checkIn
} = require('../controllers/bookingController');

router.get('/', getAllBookings);
router.post('/', createBooking);
router.post('/checkin', checkIn);
router.get('/user/:email', getUserBookings);
router.get('/:pnr', getBookingByPNR);
router.put('/:pnr/cancel', cancelBooking);

module.exports = router;