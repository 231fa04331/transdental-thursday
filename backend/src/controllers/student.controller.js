const asyncHandler = require("../utils/asyncHandler");
const studentService = require("../services/student.service");

const getStudents = asyncHandler(async (req, res) => {
  const result = await studentService.getStudents(req.query);
  res.status(200).json({ success: true, ...result });
});

const getStudentDetails = asyncHandler(async (req, res) => {
  const result = await studentService.getStudentDetails(req.params.id);
  res.status(200).json({ success: true, ...result });
});

const updateStudent = asyncHandler(async (req, res) => {
  const result = await studentService.updateStudent(req.params.id, req.body);
  res.status(200).json({ success: true, ...result });
});

const deleteStudent = asyncHandler(async (req, res) => {
  const result = await studentService.deleteStudent(req.params.id);
  res.status(200).json({ success: true, ...result });
});

module.exports = {
  getStudents,
  getStudentDetails,
  updateStudent,
  deleteStudent,
};
