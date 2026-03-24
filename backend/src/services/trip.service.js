const Trip = require("../models/Trip");
const ApiError = require("../utils/ApiError");

const createTrip = async (payload) => Trip.create(payload);

const getTrips = async () => Trip.find({}).sort({ date: 1 }).lean();

const deleteTrip = async (tripId) => {
  const deleted = await Trip.findByIdAndDelete(tripId);
  if (!deleted) {
    throw new ApiError(404, "Trip not found");
  }
  return { message: "Trip deleted" };
};

module.exports = {
  createTrip,
  getTrips,
  deleteTrip,
};
