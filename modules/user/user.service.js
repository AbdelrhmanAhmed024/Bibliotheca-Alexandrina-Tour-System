const userRepo = require('./user.repository');
const AppError = require('./../utils/AppError');
const bcrypt = require('bcrypt');;

class UserService {
    async listUsers() {
        const users = await userRepo.findAll();
        if (!users.length) throw new AppError("Couldn't find any users.", 404);
        return users;
    };

    async listUsersByRole(targetRole) {
        const role = targetRole.toLowwerCase();
        const users = await userRepo.findAllByRole(role);
        if (!users) throw new AppError("couldn't find users with this role.");
        return users;

    };

    async getUser(id) {
        const user = await userRepo.findById(id);
        if (!user) throw new AppError("Couldn't find user with that id.", 404);
        return user;
    };

    async getRawUser(id) {
        const user = await userRepo.findRawById(id);
        if (!user) throw new AppError("Couldn't find user with that id.", 404);
        return user;
    };

    async updateUser(id, data) {
        const user = await userRepo.updateById(id, data);
        if (!user) throw new AppError("Couldn't update user with that id.", 404);
        return user;
    };

    async changePassword(userId, currentPassword, newPassword) {
        if (!currentPassword || !newPassword) throw new AppError('Provide both current and new password', 400);
        const user = await userRepo.findRawById(userId).select('+password');
        if (!user) throw new AppError('User not found, please login again', 401);
        const valid = await user.comparePassword(currentPassword, user.password);
        if (!valid) throw new AppError('Your current password is wrong', 401);
        if (currentPassword === newPassword) throw new AppError("New password can't be the same as old password", 400);
        const hashed = await bcrypt.hash(newPassword, 12);
        user.password = hashed;
        await user.save();
    };


    async deleteUser(id) {
        const user = await userRepo.deleteById(id);
        if (!user) throw new AppError("Couldn't delete user with that id.", 404);
        return user;
    };
};

module.exports = new UserService();