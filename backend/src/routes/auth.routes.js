const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("full_name").trim().notEmpty().withMessage("full_name is required"),
    body("username").trim().isLength({ min: 3 }).withMessage("username must be at least 3 chars"),
    body("mobile_number")
      .trim()
      .matches(/^\+?[0-9]{7,15}$/)
      .withMessage("mobile_number must be 7 to 15 digits and may start with +"),
    body("password").isLength({ min: 6 }).withMessage("password must be at least 6 chars"),
  ],
  validate,
  controller.register
);

router.post(
  "/login",
  [
    body("username").trim().notEmpty().withMessage("username is required"),
    body("password").notEmpty().withMessage("password is required"),
  ],
  validate,
  controller.login
);

router.post(
  "/admin-login",
  [
    body("username").trim().notEmpty().withMessage("username is required"),
    body("password").notEmpty().withMessage("password is required"),
  ],
  validate,
  controller.adminLogin
);

module.exports = router;
