const mongoose = require('mongoose');
const User = require('./userModel');
const visitorSchema = new mongoose.Schema({
    nationality: {
        type: String,
        required: true
    },
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }],

});

visitorSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'visitor'
});

const Visitor = User.discriminator('Visitor', visitorSchema);

module.exports = Visitor;
