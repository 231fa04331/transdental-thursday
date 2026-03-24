const mongoose = require("mongoose");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Chanting = require("../models/Chanting");
const BookReading = require("../models/BookReading");
const ApiError = require("../utils/ApiError");

const parsePagination = (page = 1, limit = 10) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  return { safePage, safeLimit, skip: (safePage - 1) * safeLimit };
};

const getStudents = async ({ page, limit, search }) => {
  const { safePage, safeLimit, skip } = parsePagination(page, limit);
  const filter = search
    ? {
        $or: [
          { full_name: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
          { mobile_number: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const [students, total] = await Promise.all([
    Student.find(filter)
      .select("full_name username mobile_number createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Student.countDocuments(filter),
  ]);

  return {
    data: students,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
};

const getStudentDetails = async (studentId) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new ApiError(400, "Invalid student ID");
  }

  const student = await Student.findById(studentId)
    .select("full_name username mobile_number createdAt")
    .lean();

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const [attendanceHistory, chantingHistory, bookReadingHistory, totalClassesAgg, totalChantingAgg, lastDates] =
    await Promise.all([
      Attendance.find({ student: studentId }).sort({ date: -1 }).lean(),
      Chanting.find({ student: studentId }).sort({ date: -1 }).lean(),
      BookReading.find({ student: studentId }).sort({ date: -1 }).lean(),
      Attendance.aggregate([
        { $match: { student: new mongoose.Types.ObjectId(studentId), present: true } },
        { $count: "totalClasses" },
      ]),
      Chanting.aggregate([
        { $match: { student: new mongoose.Types.ObjectId(studentId) } },
        { $group: { _id: null, totalRounds: { $sum: "$rounds" } } },
      ]),
      Promise.all([
        Attendance.findOne({ student: studentId }).sort({ date: -1 }).select("date").lean(),
        Chanting.findOne({ student: studentId }).sort({ date: -1 }).select("date").lean(),
        BookReading.findOne({ student: studentId }).sort({ date: -1 }).select("date").lean(),
      ]),
    ]);

  const allDates = lastDates.filter(Boolean).map((item) => item.date);
  const lastActive = allDates.length ? new Date(Math.max(...allDates.map((d) => new Date(d).getTime()))) : null;

  return {
    student,
    attendanceHistory,
    chantingHistory,
    bookReadingHistory,
    stats: {
      totalClasses: totalClassesAgg[0]?.totalClasses || 0,
      totalChanting: totalChantingAgg[0]?.totalRounds || 0,
      lastActive,
    },
  };
};

const updateStudent = async (studentId, payload) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new ApiError(400, "Invalid student ID");
  }

  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const updates = {};

  if (payload.full_name !== undefined) {
    updates.full_name = payload.full_name;
  }

  if (payload.username !== undefined) {
    const normalizedUsername = String(payload.username).toLowerCase();
    const existingByUsername = await Student.findOne({
      username: normalizedUsername,
      _id: { $ne: studentId },
    }).lean();

    if (existingByUsername) {
      throw new ApiError(409, "Username already exists");
    }

    updates.username = normalizedUsername;
  }

  if (payload.mobile_number !== undefined) {
    const existingByMobile = await Student.findOne({
      mobile_number: payload.mobile_number,
      _id: { $ne: studentId },
    }).lean();

    if (existingByMobile) {
      throw new ApiError(409, "Mobile number already exists");
    }

    updates.mobile_number = payload.mobile_number;
  }

  const updatedStudent = await Student.findByIdAndUpdate(studentId, updates, {
    new: true,
    runValidators: true,
  })
    .select("full_name username mobile_number createdAt")
    .lean();

  return {
    message: "Student updated successfully",
    student: updatedStudent,
  };
};

const deleteStudent = async (studentId) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new ApiError(400, "Invalid student ID");
  }

  const student = await Student.findByIdAndDelete(studentId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  await Promise.all([
    Attendance.deleteMany({ student: studentId }),
    Chanting.deleteMany({ student: studentId }),
    BookReading.deleteMany({ student: studentId }),
  ]);

  return { message: "Student and related records deleted" };
};

module.exports = {
  getStudents,
  getStudentDetails,
  updateStudent,
  deleteStudent,
};
