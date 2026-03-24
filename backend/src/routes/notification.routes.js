const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/notification.controller");
const auth = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

router.post(
  "/",
  auth,
  allowRoles("admin"),
  [
    body("title").trim().notEmpty().withMessage("title is required"),
    body("message").trim().notEmpty().withMessage("message is required"),
  ],
  validate,
  controller.createNotification
);

router.get("/", auth, allowRoles("student", "admin"), controller.getNotifications);

module.exports = router;
