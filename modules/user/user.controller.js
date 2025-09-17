const userService = require("./user.service");
const AppError = require("./../utils/AppError")

class UserController {

    getAll = async (req, res, next) => {
        try {
            const users = await userService.listUsers();
            res.json({
                status: "success",
                results: users.length,
                data: {
                    users
                }
            });
        } catch (e) {
            next(e);
        }
    };

    getAllByRole = async (req, res, next) => {
        try {
            const users = await userService.listUsersByRole(req.params.role);
            res.json(users);
        } catch (e) {
            next(e);
        }
    };

    getUser = async (req, res, next) => {
        try {
            const user = await userService.getUser(req.params.userId);
            res.json(user);
        } catch (e) {
            next(e);
        }
    };

    updateUser = async (req, res, next) => {
        try {
            const updated = await userService.updateUser(req.params.userId, req.body);
            res.json(updated);
        } catch (e) {
            next(e);
        }
    };

    deleteUser = async (req, res, next) => {
        try {
            await userService.deleteUser(req.user, req.params.userId);
            res.status(204).json({ status: "success", data: null });
        } catch (e) {
            next(e);
        }
    };

    changePassword = async (req, res, next) => {
        try {
            await userService.changePassword(
                req.user._id,
                req.body.currentPassword,
                req.body.newPassword
            );
            res
                .status(200)
                .json({
                    status: "success",
                    message: "Password updated successfully, please login again",
                });
        } catch (e) {
            next(e);
        }
    };

    getMyData = async (req, res, next) => {
        try {
            const data = await userService.getMyData(req.user, req.query);
            res.status(200).json({ status: "success", data });
        } catch (e) {
            next(e);
        }
    };

    updateMe = async (req, res, next) => {
        try {
            const user = await userService.updateUser(req.user, req.body, req.file);
            res.status(200).json({ status: "success", data: { user } });
        } catch (e) {
            next(e);
        }
    };
}

module.exports = new UserController();
