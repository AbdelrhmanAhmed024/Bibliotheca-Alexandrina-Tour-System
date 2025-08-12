const User = require('./../../models/userModel.js')

class UserRepository {
    async findAll() { return User.find({}).select('-password').lean(); }
    async findAllByRole(role) { return User.find({ role }).select('-password').lean(); }
    async findById(id) { return User.findById(id).select('-password').lean(); }
    async findRawById(id) { return User.findById(id); }
    async updateById(id, data, projection = '-password') { return User.findByIdAndUpdate(id, data).select(projection).lean(); }
    async delete(id) { return User.findByIdAndDelete(id); }

}

module.exports = new UserRepository();