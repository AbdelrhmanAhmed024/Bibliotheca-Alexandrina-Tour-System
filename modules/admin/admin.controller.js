const adminService = require('./admin.service');

class AdminController {
    getAllAdmins = async (req, res, next) => {
        try {
            const admins = await adminService.getAllAdmins();
            res.status(200).json({
                status: 'success',
                results: admins.length,
                data: {
                    admins
                }
            });
        } catch (error) {
            next(error);
        }
    }

    getAdminById = async (req, res, next) => {
        try {
            const admin = await adminService.getAdminById(req.params.id);
            res.status(200).json({
                status: 'success',
                data: {
                    admin
                }
            });
        } catch (error) {
            next(error);
        }
    }

    createAdmin = async (req, res, next) => {
        try {
            const admin = await adminService.createAdmin(req.body);
            res.status(201).json({
                status: 'success',
                data: {
                    admin
                }
            });
        } catch (error) {
            next(error);
        }
    }

    updateAdmin = async (req, res, next) => {
        try {
            // Add a message to inform about password updates not being allowed
            if (req.body.password) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'This route is not for password updates.'
                });
            }

            const admin = await adminService.updateAdmin(req.params.id, req.body);
            res.status(200).json({
                status: 'success',
                data: {
                    admin
                }
            });
        } catch (error) {
            next(error);
        }
    }

    deleteAdmin = async (req, res, next) => {
        try {
            await adminService.deleteAdmin(req.params.id);
            res.status(204).json({
                status: 'success',
                data: null
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AdminController();