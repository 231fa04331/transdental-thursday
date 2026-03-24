const asyncHandler = require("../utils/asyncHandler");
const tripService = require("../services/trip.service");

const createTrip = asyncHandler(async (req, res) => {
  const result = await tripService.createTrip(req.body);
  res.status(201).json({ success: true, data: result });
});

const getTrips = asyncHandler(async (req, res) => {
  const result = await tripService.getTrips();
  res.status(200).json({ success: true, data: result });
});

const deleteTrip = asyncHandler(async (req, res) => {
  const result = await tripService.deleteTrip(req.params.id);
  res.status(200).json({ success: true, ...result });
});

module.exports = {
  createTrip,
  getTrips,
  deleteTrip,
};
