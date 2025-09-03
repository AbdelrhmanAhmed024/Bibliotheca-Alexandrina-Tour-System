const visitorService = require('./visitor.service');

class VisitorController {
    getAllVisitors = async (req, res, next) => {
        try {
            const visitors = await visitorService.getAllVisitors();
            res.status(200).json({
                status: 'success',
                results: visitors.length,
                data: {
                    visitors
                }
            });
        } catch (error) {
            next(error);
        }
    }

    getVisitorById = async (req, res, next) => {
        try {
            const visitor = await visitorService.getVisitorById(req.params.id);
            res.status(200).json({
                status: 'success',
                data: {
                    visitor
                }
            });
        } catch (error) {
            next(error);
        }
    }

    getMyBookings = async (req, res, next) => {
        try {
            const bookings = await visitorService.getVisitorBookings(req.user.id);
            res.status(200).json({
                status: 'success',
                results: bookings.length,
                data: {
                    bookings
                }
            });
        } catch (error) {
            next(error);
        }
    }

    updateVisitor = async (req, res, next) => {
        try {
            if (req.body.password) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'This route is not for password updates.'
                });
            }
            const visitor = await visitorService.updateVisitor(req.params.id, req.body);
            res.status(200).json({
                status: 'success',
                data: {
                    visitor
                }
            });
        } catch (error) {
            next(error);
        }
    }

    deleteVisitor = async (req, res, next) => {
        try {
            await visitorService.deleteVisitor(req.params.id);
            res.status(204).json({
                status: 'success',
                data: null
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new VisitorController();
