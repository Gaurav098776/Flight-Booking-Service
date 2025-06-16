const express = require('express');

const { BookingController } = require('../../controllers');

const router = express.Router();
//http://localhost:4000/api/v1/bookings
router.post(
    '/',
    BookingController.createBooking
)

router.post(
    '/payments',
    BookingController.makePayment
);

module.exports = router;