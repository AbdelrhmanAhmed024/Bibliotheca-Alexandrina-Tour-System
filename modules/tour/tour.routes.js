const express = require('express')
const tourController = require('./tour.controller')

const router = express.Router();

router.route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);

router.route('/:id')
    .get(tourController.getTourById)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
