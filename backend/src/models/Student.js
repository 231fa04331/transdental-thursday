const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    mobile_number: {
      type: String,
      required: true,
      trim: true,
      match: /^\+?[0-9]{7,15}$/,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

module.exports = mongoose.model("Student", studentSchema);
