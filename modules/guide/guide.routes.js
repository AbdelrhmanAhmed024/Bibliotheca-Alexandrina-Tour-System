const express = require('express');
const guideController = require('./guide.controller');
const { protect, restrictTo } = require('../auth/auth.middleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// Public guide routes (authenticated users can view)
router.get('/available', restrictTo('admin', 'visitor'), guideController.getAvailableGuides);
router.get('/by-language', restrictTo('admin', 'visitor'), guideController.getGuidesByLanguage);
router.get('/by-specialization', restrictTo('admin', 'visitor'), guideController.getGuidesBySpecialization);
router.get('/by-experience', restrictTo('admin', 'visitor'), guideController.getGuidesByExperience);

// Admin only routes
router.use(restrictTo('admin'));

router.route('/')
    .get(guideController.getAllGuides)
    .post(guideController.createGuide);

router.route('/:id')
    .get(guideController.getGuideById)
    .patch(guideController.updateGuide)
    .delete(guideController.deleteGuide);

module.exports = router;
