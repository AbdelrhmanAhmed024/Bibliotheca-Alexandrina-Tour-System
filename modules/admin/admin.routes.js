const AdminController = require('./admin.controller');
const express = require('express');
const router = express.Router();

router.route('/')
    .get(AdminController.getAllAdmins)
    .post(AdminController.createAdmin);

router.route('/:id')
    .get(AdminController.getAdminById)
    .patch(AdminController.updateAdmin)
    .delete(AdminController.deleteAdmin);

module.exports = router;
