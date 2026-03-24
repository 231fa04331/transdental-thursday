const asyncHandler = require("../utils/asyncHandler");
const chantingService = require("../services/chanting.service");

const addChanting = asyncHandler(async (req, res) => {
  const result = await chantingService.addChanting({
    user: req.user,
    studentId: req.body.studentId,
    date: req.body.date,
    rounds: req.body.rounds,
  });

  res.status(201).json({ success: true, data: result });
});

const getChantingByStudent = asyncHandler(async (req, res) => {
  const result = await chantingService.getChantingByStudent({
    user: req.user,
    studentId: req.params.studentId,
    page: req.query.page,
    limit: req.query.limit,
  });

  res.status(200).json({ success: true, ...result });
});

module.exports = {
  addChanting,
  getChantingByStudent,
};
