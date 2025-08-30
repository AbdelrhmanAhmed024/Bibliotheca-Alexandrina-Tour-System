const tour = require('./../../models/tourModel');

class TourRepository {
    async findAll() {
        return await tour.find().lean();
    }

    async findByQuery(query) {
        return await tour.find(query)
            .populate('tourGuide', 'name')
            .lean();
    }

    async findById(id) {
        return await tour.findById(id).lean();
    }

    async create(data) {
        return await tour.create(data);
    }

    async updateById(id, data) {
        return await tour.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteById(id) {
        return await tour.findByIdAndDelete(id);
    }

    async findByGuide(guideId) {
        return await tour.find({
            tourGuide: guideId,
            Date: { $gte: new Date() } // Only future tours
        }).sort({ Date: 1 }).lean();
    }

    async findGuideConflictingTour(guideId, tourDate, duration) {
        const tourEnd = new Date(tourDate);
        tourEnd.setHours(tourEnd.getHours() + duration);

        return await tour.findOne({
            tourGuide: guideId,
            $or: [
                {
                    // New tour starts during another tour
                    Date: {
                        $lte: tourDate
                    },
                    endTime: {
                        $gte: tourDate
                    }
                },
                {
                    // New tour ends during another tour
                    Date: {
                        $lte: tourEnd
                    },
                    endTime: {
                        $gte: tourEnd
                    }
                }
            ]
        }).lean();
    }
}

module.exports = new TourRepository();
