const express = require("express");
const { body, param } = require("express-validator");
const controller = require("../controllers/attendance.controller");
const auth = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

router.post(
  "/",
  auth,
  allowRoles("admin"),
  [
    body("studentId").isMongoId().withMessage("Valid studentId is required"),
    body("date").isISO8601().withMessage("Valid date is required"),
    body("present").isBoolean().withMessage("present must be true or false"),
  ],
  validate,
  controller.markAttendance
);

router.get(
  "/:studentId",
  auth,
  [param("studentId").isMongoId().withMessage("Valid studentId is required")],
  validate,
  controller.getAttendanceByStudent
);

router.get(
  "/date/:date",
  auth,
  allowRoles("admin"),
  [param("date").isISO8601().withMessage("Valid date is required")],
  validate,
  controller.getAttendanceByDate
);

module.exports = router;
