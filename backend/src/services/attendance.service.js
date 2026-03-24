const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const ApiError = require("../utils/ApiError");

const parsePagination = (page = 1, limit = 10) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  return { safePage, safeLimit, skip: (safePage - 1) * safeLimit };
};

const markAttendance = async ({ studentId, date, present }) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new ApiError(400, "Invalid student ID");
  }

  const student = await Student.findById(studentId).lean();
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);

  try {
    const record = await Attendance.create({
      student: studentId,
      date: attendanceDate,
      present,
    });

    return record;
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "Attendance already marked for this student and date");
    }
    throw error;
  }
};

const getAttendanceByStudent = async ({ studentId, page, limit }) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new ApiError(400, "Invalid student ID");
  }

  const { safePage, safeLimit, skip } = parsePagination(page, limit);

  const [history, total, totalClasses] = await Promise.all([
    Attendance.find({ student: studentId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Attendance.countDocuments({ student: studentId }),
    Attendance.countDocuments({ student: studentId, present: true }),
  ]);

  return {
    history,
    totalClasses,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
};

const getAttendanceByDate = async ({ date, page, limit }) => {
  const { safePage, safeLimit, skip } = parsePagination(page, limit);

  const requestedDate = new Date(date);
  if (Number.isNaN(requestedDate.getTime())) {
    throw new ApiError(400, "Invalid date format");
  }

  const start = new Date(requestedDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(requestedDate);
  end.setHours(23, 59, 59, 999);

  const filter = { date: { $gte: start, $lte: end } };

  const [records, total] = await Promise.all([
    Attendance.find(filter)
      .populate("student", "full_name username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Attendance.countDocuments(filter),
  ]);

  return {
    data: records,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 1,
    },
  };
};

module.exports = {
  markAttendance,
  getAttendanceByStudent,
  getAttendanceByDate,
};
