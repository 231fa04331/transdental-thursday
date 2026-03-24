const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    url: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
