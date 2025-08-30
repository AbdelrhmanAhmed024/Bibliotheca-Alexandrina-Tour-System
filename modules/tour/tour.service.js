const tourRepo = require('./tour.repository');
const AppError = require('./../utils/AppError');
const User = require('./../../models/userModel');

class TourService {
    async getAllTours(filters = {}) {
        const query = {};

        // Search by title or description
        if (filters.search) {
            const searchRegex = new RegExp(filters.search, 'i');
            query.$or = [
                { title: searchRegex },
            ];
        }

        // Filter by category
        if (filters.category) {
            query.category = filters.category;
        }

        // Filter by tags
        if (filters.tags && filters.tags.length > 0) {
            query.tags = { $in: filters.tags };
        }

        // Filter by date range
        if (filters.startDate) {
            query.Date = { $gte: new Date(filters.startDate) };
        }
        if (filters.endDate) {
            query.Date = { ...query.Date || {}, $lte: new Date(filters.endDate) };
        }

        // Filter by price range
        if (filters.minPrice !== undefined) {
            query.price = { $gte: filters.minPrice };
        }
        if (filters.maxPrice !== undefined) {
            query.price = { ...query.price || {}, $lte: filters.maxPrice };
        }

        const tours = await tourRepo.findByQuery(query);
        if (!tours || !tours.length) {
            throw new AppError('No tours found matching your criteria', 404);
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

    async bookTour(tourId, visitorId) {
        const tour = await this.getTourById(tourId);

        if (tour.currentBookings >= tour.groupSize) {
            throw new AppError('Tour is fully booked', 400);
        }


        const hasBooked = tour.bookedBy.some(bookingId => bookingId.toString() === visitorId.toString());
        if (hasBooked) {
            throw new AppError('You have already booked this tour', 400);
        }

        // Update the tour with new booking
        const updatedTour = await tourRepo.updateById(tourId, {
            $inc: { currentBookings: 1 },
            $push: { bookedBy: visitorId }
        });

        if (!updatedTour) {
            throw new AppError('Error booking tour', 400);
        }

        return updatedTour;
    }

    async cancelBooking(tourId, visitorId) {
        const tour = await this.getTourById(tourId);

        // Check if visitor has booked this tour using proper ObjectId comparison
        const hasBooked = tour.bookedBy.some(bookingId => bookingId.toString() === visitorId.toString());
        if (!hasBooked) {
            throw new AppError('You have not booked this tour', 400);
        }

        // Use atomic operation to ensure consistency
        const updatedTour = await tourRepo.updateById(
            { _id: tourId },
            {
                $inc: { currentBookings: -1 },
                $pull: { bookedBy: visitorId }
            },
            { new: true } // Return updated document
        );

        if (!updatedTour) {
            throw new AppError('Error canceling booking', 400);
        }

        // Verify the update was successful
        if (updatedTour.currentBookings < 0) {
            // Reset to 0 if somehow went negative
            await tourRepo.updateById(tourId, { currentBookings: 0 });
            throw new AppError('Error with booking count, please contact support', 500);
        }

        return updatedTour;
    }

    async assignGuide(tourId, guideId) {
        // Check if tour exists
        const tour = await this.getTourById(tourId);

        // Check if guide exists and is actually a guide
        const guide = await User.findOne({ _id: guideId, role: 'Guide' });
        if (!guide) {
            throw new AppError('Guide not found', 404);
        }

        // Check if guide is already assigned to another tour at the same time
        const conflictingTour = await tourRepo.findGuideConflictingTour(guideId, tour.Date, tour.duration);
        if (conflictingTour) {
            throw new AppError('Guide is already assigned to another tour at this time', 400);
        }

        // Update tour with new guide
        const updatedTour = await tourRepo.updateById(tourId, {
            tourGuide: guideId
        });

        if (!updatedTour) {
            throw new AppError('Error assigning guide', 400);
        }

        return updatedTour;
    }

    async removeGuide(tourId) {
        const tour = await this.getTourById(tourId);

        // Check if tour has any bookings
        if (tour.currentBookings > 0) {
            throw new AppError('Cannot remove guide from tour with existing bookings', 400);
        }

        // Remove guide from tour
        const updatedTour = await tourRepo.updateById(tourId, {
            $unset: { tourGuide: "" }
        });

        if (!updatedTour) {
            throw new AppError('Error removing guide', 400);
        }

        return updatedTour;
    }

    async getGuideTours(guideId) {
        const tours = await tourRepo.findByGuide(guideId);
        if (!tours || !tours.length) {
            throw new AppError('No tours found for this guide', 404);
        }
        return tours;
    }
}

module.exports = new TourService();
