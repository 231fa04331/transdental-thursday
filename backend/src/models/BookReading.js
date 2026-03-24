const mongoose = require("mongoose");

const bookReadingSchema = new mongoose.Schema(
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
    book_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookReading", bookReadingSchema);
