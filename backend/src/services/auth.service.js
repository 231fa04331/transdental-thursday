const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");

const signToken = (payload) => jwt.sign(payload, env.jwtSecret, { expiresIn: "7d" });

const registerStudent = async ({ full_name, username, mobile_number, password }) => {
  const normalizedUsername = username.toLowerCase();
  const existingByUsername = await Student.findOne({ username: normalizedUsername });
  if (existingByUsername) {
    throw new ApiError(409, "Username already exists");
  }

  const existingByMobile = await Student.findOne({ mobile_number });
  if (existingByMobile) {
    throw new ApiError(409, "Mobile number already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const student = await Student.create({
    full_name,
    username: normalizedUsername,
    mobile_number,
    password: hashedPassword,
  });

  const token = signToken({ id: student._id, role: "student", username: student.username });

  return {
    token,
    student: {
      id: student._id,
      full_name: student.full_name,
      username: student.username,
      mobile_number: student.mobile_number,
      createdAt: student.createdAt,
    },
  };
};

const loginStudent = async ({ username, password }) => {
  const normalizedUsername = username.toLowerCase();
  const student = await Student.findOne({ username: normalizedUsername });

  if (!student) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, student.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = signToken({ id: student._id, role: "student", username: student.username });

  return {
    token,
    student: {
      id: student._id,
      full_name: student.full_name,
      username: student.username,
      mobile_number: student.mobile_number,
      createdAt: student.createdAt,
    },
  };
};

const loginAdmin = async ({ username, password }) => {
  if (username !== env.adminUsername || password !== env.adminPassword) {
    throw new ApiError(401, "Invalid admin credentials");
  }

  const token = signToken({ id: "admin", role: "admin", username: env.adminUsername });
  return {
    token,
    admin: {
      username: env.adminUsername,
      role: "admin",
    },
  };
};

module.exports = {
  registerStudent,
  loginStudent,
  loginAdmin,
};
