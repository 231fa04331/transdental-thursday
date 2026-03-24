const asyncHandler = require("../utils/asyncHandler");
const notificationService = require("../services/notification.service");

const createNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.createNotification(req.body);
  res.status(201).json({ success: true, data: result });
});

const getNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.getNotifications();
  res.status(200).json({ success: true, data: result });
});

module.exports = {
  createNotification,
  getNotifications,
};
