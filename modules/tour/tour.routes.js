const express = require('express')
const tourController = require('./tour.controller')
const router = express.Router();
const { protect, restrictTo } = require('../auth/auth.middleware');

// Public routes (no authentication needed)
router.get('/available', tourController.getAvailableTours);
router.get('/:id/details', tourController.getTourById);

// Protected routes (require authentication)
router.use(protect);

// Routes for authenticated users
router.get('/', tourController.getAllTours);


router.get('/my-tours', restrictTo('guide'), tourController.getMyTours);
// Admin only routes
router.use(restrictTo('admin'));
router.route('/')
    .post(tourController.createTour);

router.route('/:id')
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);


// Guide assignment routes (admin only)
router.patch('/:tourId/assign-guide/:guideId', restrictTo('admin'), tourController.assignGuide);
router.patch('/:tourId/remove-guide', restrictTo('admin'), tourController.removeGuide);

// Guide routes

module.exports = router;
