const Booking = require('./../../models/bookingModel');
const Tour = require('./../../models/tourModel');
const Visitor = require('./../../models/visitorModel');
const AppError = require('../utils/AppError');

exports.createBooking = async (userId, tourId) => {
    const tour = await Tour.findById(tourId);
    if (!tour) throw new AppError('Tour not found', 404);

    // ✅ Check if visitor already booked this tour
    const existingBooking = await Booking.findOne({ visitor: userId, tour: tourId });
    if (existingBooking) {
        throw new AppError('You have already booked this tour', 400);
    }

    // ✅ Check capacity
    if (tour.currentBookings >= tour.groupSize) {
        throw new AppError('Tour is fully booked', 400);
    }

    // 1) Create booking doc
    const booking = await Booking.create({ visitor: userId, tour: tourId });
    if (!booking) throw new AppError('Failed to create booking', 500);
    booking.bookingNumber = 1 + (await Booking.countDocuments());
    // 2) Update Tour
    tour.bookedBy.push(userId);
    tour.currentBookings = tour.currentBookings + 1;
    await tour.save();

    // 3) Update Visitor
    await Visitor.findByIdAndUpdate(userId, {
        $push: { bookings: booking._id }
    });

    return booking;
};

exports.cancelBooking = async (userId, bookingId, isAdmin = false) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);

    // only owner OR admin
    if (!isAdmin && booking.visitor.toString() !== userId.toString()) {
        throw new AppError('Not authorized to cancel this booking', 403);
    }

    const tour = await Tour.findById(booking.tour);
    if (!tour) throw new AppError('Tour not found', 404);

    // 1) Delete booking doc
    await Booking.findByIdAndDelete(bookingId);

    // 2) Update Tour
    tour.bookedBy = tour.bookedBy.filter(
        (id) => id.toString() !== booking.visitor.toString()
    );
    tour.currentBookings = Math.max(0, tour.currentBookings - 1);
    await tour.save();

    // 3) Update Visitor
    await Visitor.findByIdAndUpdate(booking.visitor, {
        $pull: { bookings: bookingId }
    });

    return { message: 'Booking cancelled successfully' };
};

exports.getUserBookings = async (userId) => {
    return await Booking.find({ visitor: userId }).select('-visitor').populate('tour');
};

exports.getAllBookings = async () => {
    return await Booking.find().populate({ path: 'tour', select: 'title date duration price guide' })
        .populate({ path: 'visitor', select: '-fullName -createdAt -updatedAt -password -nationality -role' });
};
