const express = require('express');
const bookingController = require('./booking.controller');
const authController = require('./../auth/auth.middleware');

const router = express.Router();

// user must be logged in
router.use(authController.protect);

router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getUserBookings);

router.delete('/:bookingId', bookingController.cancelBooking);

// admin routes
router.use(authController.restrictTo('admin'));
router.get('/', bookingController.getAllBookings);

module.exports = router;
