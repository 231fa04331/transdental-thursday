const express = require("express");
const { body, param } = require("express-validator");
const controller = require("../controllers/book.controller");
const auth = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

router.post(
  "/",
  auth,
  allowRoles("student", "admin"),
  [
    body("book_name").trim().notEmpty().withMessage("book_name is required"),
    body("date").optional().isISO8601().withMessage("date must be valid"),
    body("studentId").optional().isMongoId().withMessage("studentId must be valid"),
  ],
  validate,
  controller.addBookReading
);

router.get(
  "/:studentId",
  auth,
  allowRoles("student", "admin"),
  [param("studentId").isMongoId().withMessage("Valid studentId is required")],
  validate,
  controller.getBookReadingByStudent
);

module.exports = router;
