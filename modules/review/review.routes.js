const express = require('express');
const router = express.Router();
const reviewController = require('./review.controller');
const { protect, restrictTo } = require('../auth/auth.middleware');

// Create a review for a tour (requires authentication and visitor role)
router.post('/tours/:tourId/reviews',
    protect,
    restrictTo('visitor'),
    reviewController.createReview
);

// Get all reviews for a specific tour (public)
router.get('/tours/:tourId/reviews',
    reviewController.getTourReviews
);

// Get all reviews by the authenticated user
router.get('/my-reviews',
    protect,
    restrictTo('visitor'),
    reviewController.getMyReviews
);

// Get all reviews (admin only)
router.get('/',
    protect,
    restrictTo('admin'),
    reviewController.getAllReviews
);
// Delete a review (only the review creator can delete their review)
router.delete('/:reviewId',
    protect,
    restrictTo('visitor', 'admin'),
    reviewController.deleteReview
);

module.exports = router;
