const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
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
      index: true,
    },
    present: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
