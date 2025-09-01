const Guide = require('../../models/guideModel');
const Tour = require('../../models/tourModel');

class GuideRepository {
    async findAll() {
        return await Guide.find().select('-password').lean();
    }

    async findById(id) {
        return await Guide.findById(id).select('-password').lean();
    }

    async create(data) {
        return await Guide.create(data);
    }

    async updateById(id, data) {
        return await Guide.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        }).select('-password').lean();
    }

    async deleteById(id) {
        return await Guide.findByIdAndDelete(id);
    }

    async findAvailableGuides(date) {
        const busyGuides = await Tour.distinct('tourGuide', {
            Date: date,
            tourGuide: { $exists: true }
        });

        return await Guide.find({
            _id: { $nin: busyGuides }
        }).select('-password').lean();
    }

    async findByLanguage(language) {
        return await Guide.find({
            languages: language
        }).select('-password').lean();
    }

    async findBySpecialization(specialization) {
        return await Guide.find({
            specialization
        }).select('-password').lean();
    }

    async findByExperience(minYears) {
        return await Guide.find({
            yearsOfExperience: { $gte: minYears }
        }).select('-password').lean();
    }
}

module.exports = new GuideRepository();
