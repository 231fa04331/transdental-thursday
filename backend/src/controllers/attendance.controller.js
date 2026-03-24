const asyncHandler = require("../utils/asyncHandler");
const attendanceService = require("../services/attendance.service");

const markAttendance = asyncHandler(async (req, res) => {
  const result = await attendanceService.markAttendance(req.body);
  res.status(201).json({ success: true, data: result });
});

const getAttendanceByStudent = asyncHandler(async (req, res) => {
  const result = await attendanceService.getAttendanceByStudent({
    studentId: req.params.studentId,
    page: req.query.page,
    limit: req.query.limit,
  });
  res.status(200).json({ success: true, ...result });
});

const getAttendanceByDate = asyncHandler(async (req, res) => {
  const result = await attendanceService.getAttendanceByDate({
    date: req.params.date,
    page: req.query.page,
    limit: req.query.limit,
  });
  res.status(200).json({ success: true, ...result });
});

module.exports = {
  markAttendance,
  getAttendanceByStudent,
  getAttendanceByDate,
};
