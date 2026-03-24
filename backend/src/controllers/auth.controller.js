const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
  const result = await authService.registerStudent(req.body);
  res.status(201).json({ success: true, ...result });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.loginStudent(req.body);
  res.status(200).json({ success: true, ...result });
});

const adminLogin = asyncHandler(async (req, res) => {
  const result = await authService.loginAdmin(req.body);
  res.status(200).json({ success: true, ...result });
});

module.exports = {
  register,
  login,
  adminLogin,
};
