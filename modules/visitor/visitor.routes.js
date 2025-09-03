const express = require('express');
const visitorController = require('./visitor.controller');
const { protect, restrictTo } = require('../auth/auth.middleware');
const router = express.Router();

// Protected routes
router.use(protect);

// Visitor's own routes
router.get('/my-bookings', visitorController.getMyBookings);

// Admin only routes
router.use(restrictTo('admin'));
router.route('/')
    .get(visitorController.getAllVisitors);

router.route('/:id')
    .get(visitorController.getVisitorById)
    .patch(visitorController.updateVisitor)
    .delete(visitorController.deleteVisitor);

module.exports = router;
