const tourRepo = require('./tour.repository');
const AppError = require('./../utils/AppError');

class TourService {
    async getAllTours() {
        const tours = await tourRepo.findAll();
        if (!tours || !tours.length) {
            throw new AppError('No tours found', 404);
        }
        return tours;
    }

    async getTourById(id) {
        const tour = await tourRepo.findById(id);
        if (!tour) {
            throw new AppError('Tour not found', 404);
        }
        return tour;
    }

    async createTour(data) {
        const newTour = await tourRepo.create(data);
        if (!newTour) {
            throw new AppError('Error creating tour', 400);
        }
        return newTour;
    }

    async updateTour(id, data) {
        const updatedTour = await tourRepo.updateById(id, data);
        if (!updatedTour) {
            throw new AppError('Tour not found', 404);
        }
        return updatedTour;
    }

    async deleteTour(id) {
        const deletedTour = await tourRepo.deleteById(id);
        if (!deletedTour) {
            throw new AppError('Tour not found', 404);
        }
        return deletedTour;
    }
}

module.exports = new TourService();
