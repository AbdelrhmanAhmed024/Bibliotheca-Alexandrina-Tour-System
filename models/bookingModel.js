const mongoose = require('mongoose');


const bookingSchema = new mongoose.Schema(
    {
        bookingNumber: { type: Number, unique: true },
        visitor: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true },
        tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
        date: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const counterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('BookingCounter', counterSchema);

// 🔹 static method للزيادة
bookingSchema.statics.getNextBookingNumber = async function () {
    const counter = await Counter.findOneAndUpdate(
        { name: 'bookingNumber' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
};

// 🔹 pre-save hook
bookingSchema.pre('save', async function (next) {
    if (this.isNew && !this.bookingNumber) {
        this.bookingNumber = await this.constructor.getNextBookingNumber();
    }
    next();
});


const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
