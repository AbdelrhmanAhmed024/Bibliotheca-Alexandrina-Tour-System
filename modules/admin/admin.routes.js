const AdminController = require('./admin.controller');
const express = require('express');
const { protect, restrictTo } = require('../auth/auth.middleware');
const router = express.Router();

// Protect all routes after this middleware
router.use(protect);
router.use(restrictTo('admin'));

router.route('/')
    .get(AdminController.getAllAdmins)
    .post(AdminController.createAdmin);

router.route('/:id')
    .get(AdminController.getAdminById)
    .patch(AdminController.updateAdmin)
    .delete(AdminController.deleteAdmin);

module.exports = router;
