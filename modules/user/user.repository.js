const User = require('./../../models/userModel.js');
const { getMyData } = require('./user.controller.js');

class UserRepository {
    async findAll() { return User.find({}).select('-password').lean(); }
    async findById(id) { return User.findById(id).select('-password').lean(); }
    async findRawById(id) { return User.findById(id); }
    async getMyData(userId) {
        return await User.findById(userId).select("-password").populate({ path: "bookings", populate: { path: "tour", select: "title date duration price", }, })
    }
    async updateMe(userId, updateData) {
        return await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true,
        }).select("-password");
    }

    async deleteUser(userId) {
        return await User.findByIdAndDelete(userId);
    }

}

module.exports = new UserRepository();