const bookingService = require('./booking.service');
const catchAsync = require('./../utils/catchAsync');

exports.createBooking = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { tourId } = req.body;

    const booking = await bookingService.createBooking(userId, tourId);

    res.status(201).json({
        status: 'success',
        data: booking,
    });
});

exports.cancelBooking = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { bookingId } = req.params;
    const isAdmin = req.user.role === 'Admin';

    const result = await bookingService.cancelBooking(userId, bookingId, isAdmin);

    res.status(200).json({
        status: 'success',
        data: result,
    });
});

exports.getUserBookings = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const bookings = await bookingService.getUserBookings(userId);

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: bookings,
    });
});

exports.getAllBookings = catchAsync(async (req, res, next) => {
    const bookings = await bookingService.getAllBookings();

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: bookings,
    });
});
