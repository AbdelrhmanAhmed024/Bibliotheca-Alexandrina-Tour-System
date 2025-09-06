const reviewRepo = require('./review.repository');
const tourRepo = require('../tour/tour.repository');
const AppError = require('../utils/AppError');

class ReviewService {
    async createReview(userId, tourId, rating, comment) {
        // Get the tour to check if it has ended and if the user actually booked it
        const tour = await tourRepo.findById(tourId);
        if (!tour) {
            throw new AppError('Tour not found', 404);
        }

        // Check if tour has ended
        if (new Date(tour.Date) > new Date()) {
            throw new AppError('Cannot review a tour that has not ended yet', 400);
        }

        // Check if user was actually on this tour
        if (!tour.bookedBy.includes(userId)) {
            throw new AppError('You can only review tours you have attended', 403);
        }

        // Check if user has already reviewed this tour
        const existingReview = await reviewRepo.findByTourId(tourId);
        const hasReviewed = existingReview.some(review => review.user._id.toString() === userId);
        if (hasReviewed) {
            throw new AppError('You have already reviewed this tour', 400);
        }

        // Create the review
        const review = await reviewRepo.create({
            user: userId,
            tour: tourId,
            rating,
            comment
        });

        // Update tour ratings
        await reviewRepo.updateTourRatings(tourId);

        return review;
    }

    async getAllReviews() {
        return reviewRepo.getAll();
    }

    async getTourReviews(tourId) {
        const reviews = await reviewRepo.findByTourId(tourId);
        return reviews;
    }

    async getUserReviews(userId) {
        const reviews = await reviewRepo.findByUserId(userId);
        return reviews;
    }

    async deleteReview(reviewId, userId) {
        const review = await reviewRepo.findById(reviewId);
        if (!review) {
            throw new AppError('Review not found', 404);
        }

        // Check if the review belongs to the user
        if (review.user._id.toString() !== userId) {
            throw new AppError('You can only delete your own reviews', 403);
        }

        await reviewRepo.delete(reviewId);
        await reviewRepo.updateTourRatings(review.tour._id);

        return { message: 'Review deleted successfully' };
    }
}

module.exports = new ReviewService();
