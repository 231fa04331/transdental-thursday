const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/student.controller");
const auth = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

router.get("/", auth, allowRoles("admin"), controller.getStudents);
router.get("/:id", auth, allowRoles("admin"), controller.getStudentDetails);
router.patch(
	"/:id",
	auth,
	allowRoles("admin"),
	[
		body("full_name").optional().trim().notEmpty().withMessage("full_name cannot be empty"),
		body("username")
			.optional()
			.trim()
			.isLength({ min: 3 })
			.withMessage("username must be at least 3 chars"),
		body("mobile_number")
			.optional()
			.trim()
			.matches(/^\+?[0-9]{7,15}$/)
			.withMessage("mobile_number must be 7 to 15 digits and may start with +"),
	],
	validate,
	controller.updateStudent
);
router.delete("/:id", auth, allowRoles("admin"), controller.deleteStudent);

module.exports = router;
