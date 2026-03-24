const Notification = require("../models/Notification");

const createNotification = async (payload) => Notification.create(payload);

const getNotifications = async () =>
  Notification.find({}).sort({ createdAt: -1 }).lean();

module.exports = {
  createNotification,
  getNotifications,
};
