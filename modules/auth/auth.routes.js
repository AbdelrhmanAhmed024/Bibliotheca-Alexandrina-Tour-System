const express = require('express');
const authController = require('./auth.controller');
const { protect } = require('./auth.middleware');
const router = express.Router();

// Authentication routes
router.post('/signup/visitor', authController.signupVisitor);
router.post('/signup/guide', authController.signupGuide);
router.post('/signup/admin', authController.signupAdmin);
router.post('/login', authController.login);
router.patch('/change-password', protect, authController.changePassword);
router.post('/logout', protect, authController.logout);

module.exports = router;
