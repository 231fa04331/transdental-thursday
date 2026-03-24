const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/chatbot.controller");
const auth = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

router.post(
  "/",
  auth,
  allowRoles("student", "admin"),
  [body("message").trim().notEmpty().withMessage("message is required")],
  validate,
  controller.chat
);

module.exports = router;
