const adminRepo = require('./admin.repository');
const AppError = require('./../utils/AppError');

class adminService {
    async getAllAdmins() {
        const admins = await adminRepo.findAll();
        if (!admins || admins.length === 0) {
            throw new AppError('No admins found', 404);
        }
        return admins;
    }

    async getAdminById(id) {
        const admin = await adminRepo.findById(id);
        if (!admin) throw new AppError('Admin not found', 404);
        return admin;
    }

    async createAdmin(data) {
        const admin = await adminRepo.create(data);
        if (!admin) throw new AppError('Error creating admin', 400);
        return admin;
    }

    async updateAdmin(id, data) {
        const admin = await adminRepo.updateById(id, data);
        if (!admin) throw new AppError('Admin not found or can\'t be updated', 404);
        return admin;
    }

    async deleteAdmin(id) {
        const admin = await adminRepo.deleteById(id);
        if (!admin) throw new AppError('Admin not found', 404);
        return admin;
    }
}

module.exports = new adminService();