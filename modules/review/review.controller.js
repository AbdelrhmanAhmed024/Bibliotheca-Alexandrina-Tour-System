const reviewService = require('./review.service');

class ReviewController {
    createReview = async (req, res, next) => {
        try {
            const { rating, comment } = req.body;
            const { tourId } = req.params;
            const userId = req.user.id; // Assuming user is attached by auth middleware
            if (!tourId || !rating) {
                return res.status(400).json({ status: 'fail', message: 'Tour or rating are missing' });
            }
            const review = await reviewService.createReview(userId, tourId, rating, comment);

            res.status(201).json({
                status: 'success',
                data: {
                    review
                }
            });
        } catch (error) {
            next(error);
        }
    }

    getTourReviews = async (req, res, next) => {
        try {
            const { tourId } = req.params;
            const reviews = await reviewService.getTourReviews(tourId);

            res.status(200).json({
                status: 'success',
                data: {
                    reviews
                }
            });
        } catch (error) {
            next(error);
        }
    }

    getAllReviews = async (req, res, next) => {
        try {
            const reviews = await reviewService.asyncgetAllReviews();
            res.status(200).json({
                status: 'success',
                reviewsCount: reviews.length,
                data: {
                    reviews
                }
            });
        } catch (error) {
            next(error);
        }
    }

    getMyReviews = async (req, res, next) => {
        try {
            const userId = req.user.id; // Assuming user is attached by auth middleware
            const reviews = await reviewService.getUserReviews(userId);

            res.status(200).json({
                status: 'success',
                data: {
                    reviews
                }
            });
        } catch (error) {
            next(error);
        }
    }

    deleteReview = async (req, res, next) => {
        try {
            const { reviewId } = req.params;
            const userId = req.user.id; // Assuming user is attached by auth middleware

            const result = await reviewService.deleteReview(reviewId, userId);

            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReviewController();
