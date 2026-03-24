const asyncHandler = require("../utils/asyncHandler");
const contentService = require("../services/content.service");

const createContent = asyncHandler(async (req, res) => {
  const result = await contentService.createContent(req.body);
  res.status(201).json({ success: true, data: result });
});

const getContent = asyncHandler(async (req, res) => {
  const result = await contentService.getContent();
  res.status(200).json({ success: true, data: result });
});

module.exports = {
  createContent,
  getContent,
};
