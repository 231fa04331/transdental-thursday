const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    type: { type: String, enum: ["image", "video"], required: true },
    title: { type: String, trim: true, maxlength: 200 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
