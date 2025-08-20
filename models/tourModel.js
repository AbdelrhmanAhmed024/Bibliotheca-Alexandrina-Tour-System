const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    Date: {
        type: Date,
        required: true
    },
    groupSize: {
        type: Number,
        required: true
    },
    tourGuide: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    AvgRatings: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numberOfRatings: {
        type: Number,
        default: 0,
        min: 0
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
