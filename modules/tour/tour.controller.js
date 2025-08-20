const TourService = require('./tour.service');

class tourController {
    getAllTours = async (req, res, next) => {
        try {
            const tours = await TourService.getAllTours();
            res.status(200).json({
                status: 'success',
                data: {
                    tours
                }
            });
        } catch (error) {
            next(error);
        }
    }

    getTourById = async (req, res, next) => {
        try {
            const tour = await TourService.getTourById(req.params.id);
            res.status(200).json({
                status: 'success',
                data: {
                    tour
                }
            });
        } catch (error) {
            next(error);
        }
    }

    createTour = async (req, res, next) => {
        try {
            const newTour = await TourService.createTour(req.body);
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            });
        } catch (error) {
            next(error);
        }
    }

    updateTour = async (req, res, next) => {
        try {
            const updatedTour = await TourService.updateTour(req.params.id, req.body);
            res.status(200).json({
                status: 'success',
                data: {
                    tour: updatedTour
                }
            });
        } catch (error) {
            next(error);
        }
    }

    deleteTour = async (req, res, next) => {
        try {
            await TourService.deleteTour(req.params.id);
            res.status(204).json({
                status: 'success',
                data: null
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new tourController();
