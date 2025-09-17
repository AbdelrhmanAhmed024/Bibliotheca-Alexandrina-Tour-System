const reviewRepo = require('./review.repository');
const tourRepo = require('../tour/tour.repository');
const AppError = require('../utils/AppError');
const Review = require('../../models/reviewModel');
const Tour = require('../../models/tourModel');

class ReviewService {
    async createReview(userId, tourId, rating, comment) {
        const review = await reviewRepo.create({
            user: userId,
            tour: tourId,
            rating,
            comment
        });
        if (!review) {
            throw new AppError('Failed to create review', 500);
        }

        await Review.calcAverageRatings(tourId);
        const tour = await Tour.findById(tourId);
        console.log(tour.AvgRatings, tour.numberOfRatings);

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
