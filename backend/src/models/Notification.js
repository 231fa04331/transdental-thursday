const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
