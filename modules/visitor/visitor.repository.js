const Visitor = require('../../models/visitorModel');

class VisitorRepository {
    async findAll() {
        return await Visitor.find().select('-password').lean();
    }

    async findById(id) {
        return await Visitor.findById(id).select('-password').lean();
    }

    async findByIdWithBookings(id) {
        return await Visitor.findById(id)
            .select('-password')
            .populate({
                path: 'bookings',
                populate: {
                    path: 'tour',
                    select: 'title date duration price'
                }
            })
            .lean();
    }

    async create(data) {
        return await Visitor.create(data);
    }

    async updateById(id, data) {
        return await Visitor.findByIdAndUpdate(id, data, { new: true })
            .select('-password');
    }

    async deleteById(id) {
        return await Visitor.findByIdAndDelete(id);
    }
}

module.exports = new VisitorRepository();
