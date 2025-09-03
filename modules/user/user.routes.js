const express = require("express");
const controller = require("./user.controller");
const { protect, restrictTo } = require('../auth/auth.middleware');
const authController = require("../auth/auth.controller");
const router = express.Router();

// Protect all routes
router.use(protect);

// Routes accessible by the authenticated user
router.get("/me/data", controller.getMyData);
router.patch("/me", controller.updateMe);
router.patch("/me/update-password", authController.changePassword);

// Admin only routes
router.use(restrictTo('admin'));
router.get("/", controller.getAll);
router.get("/:userId", controller.getUser);
router.delete("/:id", controller.deleteUser);

module.exports = router;
