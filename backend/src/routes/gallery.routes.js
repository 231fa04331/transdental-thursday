const express = require("express");
const multer = require("multer");
const { body } = require("express-validator");
const controller = require("../controllers/gallery.controller");
const auth = require("../middlewares/auth.middleware");
const allowRoles = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

router.post(
  "/",
  auth,
  allowRoles("admin"),
  upload.single("file"),
  [
    body("title").optional().trim(),
    body("type").optional().isIn(["image", "video"]).withMessage("type must be image or video"),
    body("url").optional().isURL().withMessage("url must be valid"),
  ],
  validate,
  controller.createGalleryItem
);

router.get("/", auth, allowRoles("student", "admin"), controller.getGalleryItems);

module.exports = router;
