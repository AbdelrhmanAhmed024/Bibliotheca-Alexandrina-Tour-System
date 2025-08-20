const Admin = require('./../../models/adminModel')

class adminRepository {
    async findAll() { return Admin.find({}).select('-password').lean(); }
    async findById(id) { return Admin.findById(id).select('-password').lean(); }
    async create(data) { return Admin.create(data); }
    async updateById(id, data, projection = '-password') { return Admin.findByIdAndUpdate(id, data, { new: true }).select(projection).lean(); }
    async deleteById(id) { return Admin.findByIdAndDelete(id); }

}

module.exports = new adminRepository();