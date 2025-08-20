const express = require("express");
const controller = require("./user.controller");
const router = express.Router();

router.get("/", controller.getAll);
router.get("/role/:role", controller.getAllByRole);
router.get("/:userId", controller.getUser);
router.patch("/:userId", controller.updateUser);
router.delete("/:userId", controller.deleteUser);
router.patch("/me/update-password", controller.changePassword);
router.get("/me/data", controller.getMyData);
router.patch("/me", controller.updateMe);

module.exports = router;
