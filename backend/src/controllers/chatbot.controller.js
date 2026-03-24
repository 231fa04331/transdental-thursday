const asyncHandler = require("../utils/asyncHandler");
const chatbotService = require("../services/chatbot.service");

const chat = asyncHandler(async (req, res) => {
  const result = await chatbotService.getChatbotResponse(req.body.message);
  res.status(200).json({ success: true, ...result });
});

module.exports = { chat };
