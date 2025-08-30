const TourService = require('./tour.service');

class tourController {
    getAllTours = async (req, res, next) => {
        try {
            const filters = {
                search: req.query.search,
                category: req.query.category,
                tags: req.query.tags ? req.query.tags.split(',') : undefined,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
                minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
                maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined
            };

            const tours = await TourService.getAllTours(filters);
            res.status(200).json({
                status: 'success',
                results: tours.length,
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

    bookTour = async (req, res, next) => {
        try {
            const tour = await TourService.bookTour(req.params.id, req.visitor.id);
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

    cancelBooking = async (req, res, next) => {
        try {
            const tour = await TourService.cancelBooking(req.params.id, req.visitor.id);
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

    getAvailableTours = async (req, res, next) => {
        try {
            const tours = await TourService.getAllTours();
            const availableTours = tours
                .filter(tour => tour.currentBookings < tour.groupSize)
                .map(tour => {
                    const tourData = tour.toJSON ? tour.toJSON() : { ...tour };
                    const { bookedBy, ...tourWithoutBookedBy } = tourData;
                    return tourWithoutBookedBy;
                });

            res.status(200).json({
                status: 'success',
                message: `there are ${availableTours.length} available tours.`,
                data: {
                    tours: availableTours
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

    assignGuide = async (req, res, next) => {
        try {
            const tour = await TourService.assignGuide(req.params.tourId, req.params.guideId);
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

    removeGuide = async (req, res, next) => {
        try {
            const tour = await TourService.removeGuide(req.params.tourId);
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

    getMyTours = async (req, res, next) => {
        try {
            const tours = await TourService.getGuideTours(req.user._id);
            res.status(200).json({
                status: 'success',
                results: tours.length,
                data: {
                    tours
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new tourController();
