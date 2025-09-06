const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: "Tour", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
});

// دالة حساب الاحصائيات
reviewSchema.statics.calcAverageRatings = async function (tourId) {
    const stats = await this.aggregate([
        { $match: { tour: tourId } },
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
            AvgRatings: Math.round(stats[0].avgRating * 10) / 10,
            numberOfRatings: stats[0].numRatings
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            AvgRatings: 0,
            numberOfRatings: 0
        });
    }
};

// بعد ما الريفيو يتسجل
reviewSchema.post("save", function () {
    this.constructor.calcAverageRatings(this.tour);
});

// بعد ما الريفيو يتمسح (استخدم Review مش doc.constructor)
reviewSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await mongoose.model("Review").calcAverageRatings(doc.tour);
    }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
