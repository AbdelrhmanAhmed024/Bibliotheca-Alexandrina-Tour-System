const guideService = require('./guide.service');

class GuideController {
    getAllGuides = async (req, res, next) => {
        try {
            const guides = await guideService.getAllGuides();
            res.status(200).json({
                status: 'success',
                results: guides.length,
                data: {
                    guides
                }
            });
        } catch (error) {
            next(error);
        }
    }

    getGuideById = async (req, res, next) => {
        try {
            const guide = await guideService.getGuideById(req.params.id);
            res.status(200).json({
                status: 'success',
                data: {
                    guide
                }
            });
        } catch (error) {
            next(error);
        }
    }

    createGuide = async (req, res, next) => {
        try {
            const guide = await guideService.createGuide(req.body);
            res.status(201).json({
                status: 'success',
                data: {
                    guide
                }
            });
        } catch (error) {
            next(error);
        }
    }

    updateGuide = async (req, res, next) => {
        try {
            if (req.body.password) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'This route is not for password updates.'
                });
            }
            const guide = await guideService.updateGuide(req.params.id, req.body);
            res.status(200).json({
                status: 'success',
                data: {
                    guide
                }
            });
        } catch (error) {
            next(error);
        }
    }

    deleteGuide = async (req, res, next) => {
        try {
            await guideService.deleteGuide(req.params.id);
            res.status(204).json({
                status: 'success',
                data: null
            });
        } catch (error) {
            next(error);
        }
    }

    getAvailableGuides = async (req, res, next) => {
        try {
            const guides = await guideService.findAvailableGuides(req.query.date);
            res.status(200).json({
                status: 'success',
                data: {
                    guides
                }
            });
        } catch (error) {
            next(error);
        }
    }

    getGuidesByLanguage = async (req, res, next) => {
        try {
            const guides = await guideService.findGuidesByLanguage(req.query.language);
            res.status(200).json({
                status: 'success',
                data: {
                    guides
                }
            });
        } catch (error) {
            next(error);
        }
    }

    getGuidesBySpecialization = async (req, res, next) => {
        try {
            const guides = await guideService.findGuidesBySpecialization(req.query.specialization);
            res.status(200).json({
                status: 'success',
                data: {
                    guides
                }
            });
        } catch (error) {
            next(error);
        }
    }

    getGuidesByExperience = async (req, res, next) => {
        try {
            const guides = await guideService.findGuidesByExperience(parseInt(req.query.minYears));
            res.status(200).json({
                status: 'success',
                data: {
                    guides
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new GuideController();