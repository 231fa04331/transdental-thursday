const mongoose = require("mongoose");

const chantingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    rounds: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chanting", chantingSchema);
