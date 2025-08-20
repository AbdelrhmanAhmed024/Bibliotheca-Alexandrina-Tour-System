const tour = require('./../../models/tourModel');

class TourRepository {
    async findAll() {
        return await tour.find().lean();
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
}

module.exports = new TourRepository();
