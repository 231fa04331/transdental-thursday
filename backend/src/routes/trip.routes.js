const express = require("express");
const { body, param } = require("express-validator");
const controller = require("../controllers/trip.controller");
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
    body("date").isISO8601().withMessage("date is required"),
    body("location").trim().notEmpty().withMessage("location is required"),
    body("cost").optional().isNumeric().withMessage("cost must be numeric"),
    body("last_date").optional().isISO8601().withMessage("last_date must be valid"),
    body("places_to_visit").optional().isArray().withMessage("places_to_visit must be an array"),
  ],
  validate,
  controller.createTrip
);

router.get("/", auth, allowRoles("student", "admin"), controller.getTrips);

router.delete(
  "/:id",
  auth,
  allowRoles("admin"),
  [param("id").isMongoId().withMessage("Valid trip id is required")],
  validate,
  controller.deleteTrip
);

module.exports = router;
