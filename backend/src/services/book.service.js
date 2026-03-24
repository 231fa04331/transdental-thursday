const mongoose = require("mongoose");
const BookReading = require("../models/BookReading");
const Student = require("../models/Student");
const ApiError = require("../utils/ApiError");

const parsePagination = (page = 1, limit = 10) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  return { safePage, safeLimit, skip: (safePage - 1) * safeLimit };
};

const resolveStudentForWrite = async (user, studentIdFromBody) => {
  const targetStudentId = user.role === "student" ? user.id : studentIdFromBody;

  if (!targetStudentId) {
    throw new ApiError(400, "studentId is required for admin requests");
  }

  if (!mongoose.Types.ObjectId.isValid(targetStudentId)) {
    throw new ApiError(400, "Invalid student ID");
  }

  const student = await Student.findById(targetStudentId).lean();
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return targetStudentId;
};

const assertCanRead = (user, studentId) => {
  if (user.role === "admin") {
    return;
  }

  if (String(user.id) !== String(studentId)) {
    throw new ApiError(403, "Forbidden: you can only access your own records");
  }
};

const addBookReading = async ({ user, studentId, date, book_name }) => {
  const resolvedStudentId = await resolveStudentForWrite(user, studentId);
  return BookReading.create({ student: resolvedStudentId, date: date || new Date(), book_name });
};

const getBookReadingByStudent = async ({ user, studentId, page, limit }) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new ApiError(400, "Invalid student ID");
  }
  assertCanRead(user, studentId);

  const { safePage, safeLimit, skip } = parsePagination(page, limit);

  const [history, total] = await Promise.all([
    BookReading.find({ student: studentId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    BookReading.countDocuments({ student: studentId }),
  ]);

  return {
    history,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
};

module.exports = {
  addBookReading,
  getBookReadingByStudent,
};
