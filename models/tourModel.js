const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Historical', 'Cultural', 'Educational', 'Special Exhibition', 'Architecture']
    },
    tags: [{
        type: String,
        enum: [
            'Ancient Egypt', 'Manuscripts', 'Art Gallery',
            'Digital Archives', 'Library Tour', 'Research Facilities',
            'Planetarium', 'Science Museum', 'Antiquities',
            'Modern History', 'Workshops', 'Interactive'
        ]
    }],
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
    currentBookings: {
        type: Number,
        default: 0,
        min: 0
    },
    bookedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Visitor"
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
