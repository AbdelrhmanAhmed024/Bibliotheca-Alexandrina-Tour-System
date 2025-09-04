const Booking = require('./../../models/bookingModel');

class BookingRepository {
    async create(data) {
        const booking = new Booking(data);
        return await booking.save();
    }

    async findById(id) {
        return await Booking.findById(id)
            .populate('visitor', 'firstName email')
            .populate('tour', 'title date duration price guide');
    }

    async findAll(filter = {}) {
        return await Booking.find(filter)
            .populate('visitor', 'firstName email')
            .populate('tour', 'title date duration price guide');
    }

    async deleteById(id) {
        return await Booking.findByIdAndDelete(id);
    }
}

module.exports = new BookingRepository();
