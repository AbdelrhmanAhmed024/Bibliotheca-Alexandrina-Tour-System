const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const mongoose = require("mongoose");
    const Tour = require("./tourModel");

    const stats = await this.aggregate([
        { $match: { tour: new mongoose.Types.ObjectId(tourId) } },
        {
            $group: {
                _id: "$tour",
                avgRating: { $avg: "$rating" },
                numRatings: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            AvgRatings: stats[0].avgRating,
            numberOfRatings: stats[0].numRatings
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            AvgRatings: 0,
            numberOfRatings: 0
        });
    }
};

reviewSchema.post('save', async function () {
    const Review = this.constructor;
    const Tour = require('./tourModel');

    const stats = await Review.aggregate([
        { $match: { tour: this.tour } },
        {
            $group: {
                _id: '$tour',
                avgRating: { $avg: '$rating' },
                nRating: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(this.tour, {
            AvgRatings: stats[0].avgRating,
            numberOfRatings: stats[0].nRating
        });
    } else {
        await Tour.findByIdAndUpdate(this.tour, {
            AvgRatings: 0,
            numberOfRatings: 0
        });
    }
});

reviewSchema.post("save", function () {
    this.constructor.calcAverageRatings(this.tour);
});

// بعد update أو delete
reviewSchema.post(/^findOneAnd/, async function (doc) {
    if (doc) {
        await mongoose.model("Review").calcAverageRatings(doc.tour);
    }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
