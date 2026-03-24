const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    date: { type: Date, required: true, index: true },
    location: { type: String, required: true, trim: true, maxlength: 200 },
    places_to_visit: [{ type: String, trim: true, maxlength: 200 }],
    cost: { type: Number, default: 0, min: 0 },
    description: { type: String, trim: true, maxlength: 2000 },
    contact: { type: String, trim: true, maxlength: 120 },
    last_date: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);
