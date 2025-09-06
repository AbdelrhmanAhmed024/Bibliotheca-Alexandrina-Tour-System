const Review = require('../../models/reviewModel');
const Tour = require('../../models/tourModel');

class ReviewRepository {
    async create(data) {
        return await Review.create(data);
    }

    async getAll() {
        return await Review.find()
            .populate('user', 'firstName')
            .populate('tour', 'title');
    }

    async findByTourId(tourId) {
        return await Review.find({ tour: tourId })
            .populate('user', 'firstName').populate('tour', 'title')
            .lean();
    }

    async findByUserId(userId) {
        return await Review.find({ user: userId })
            .populate('tour', 'title')
            .lean();
    }

    async findById(id) {
        return await Review.findById(id)
            .populate('user', 'firstName')
            .populate('tour', 'title')
            .lean();
    }

    async delete(id) {
        return await Review.findByIdAndDelete(id);
    }

    async updateTourRatings(tourId) {
        const stats = await Review.aggregate([
            {
                $match: { tour: tourId }
            },
            {
                $group: {
                    _id: '$tour',
                    avgRatings: { $avg: '$rating' },
                    numRatings: { $sum: 1 }
                }
            }
        ]);

        if (stats.length > 0) {
            await Tour.findByIdAndUpdate(tourId, {
                AvgRatings: Math.round(stats[0].avgRatings * 10) / 10,
                numberOfRatings: stats[0].numRatings
            });
        } else {
            await Tour.findByIdAndUpdate(tourId, {
                AvgRatings: 0,
                numberOfRatings: 0
            });
        }
    }
}

module.exports = new ReviewRepository();
