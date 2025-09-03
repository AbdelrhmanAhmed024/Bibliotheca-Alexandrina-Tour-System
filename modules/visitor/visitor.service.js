const visitorRepo = require('./visitor.repository');
const tourService = require('../tour/tour.service');
const AppError = require('../utils/AppError');

class VisitorService {
    async getAllVisitors() {
        const visitors = await visitorRepo.findAll();
        if (!visitors || visitors.length === 0) {
            throw new AppError('No visitors found', 404);
        }
        return visitors;
    }

    async getVisitorById(id) {
        const visitor = await visitorRepo.findById(id);
        if (!visitor) {
            throw new AppError('Visitor not found', 404);
        }
        return visitor;
    }

    async getVisitorBookings(id) {
        const visitor = await visitorRepo.findByIdWithBookings(id);
        if (!visitor) {
            throw new AppError('you are not a visitor', 400);
        }
        return visitor.bookings;
    }

    async createVisitor(data) {
        const visitor = await visitorRepo.create(data);
        if (!visitor) {
            throw new AppError('Error creating visitor', 400);
        }
        return visitor;
    }

    async updateVisitor(id, data) {
        if (data.password) delete data.password;
        const visitor = await visitorRepo.updateById(id, data);
        if (!visitor) {
            throw new AppError('Visitor not found', 404);
        }
        return visitor;
    }

    async deleteVisitor(id) {
        const visitor = await visitorRepo.deleteById(id);
        if (!visitor) {
            throw new AppError('Visitor not found', 404);
        }
        return visitor;
    }
}

module.exports = new VisitorService();
