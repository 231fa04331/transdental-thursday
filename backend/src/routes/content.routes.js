const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/content.controller");
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
    body("url").isURL().withMessage("url must be valid"),
    body("description").optional().trim(),
  ],
  validate,
  controller.createContent
);

router.get("/", auth, allowRoles("student", "admin"), controller.getContent);

module.exports = router;
