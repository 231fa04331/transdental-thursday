const jwt = require("jsonwebtoken");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, "Unauthorized: missing token"));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    return next();
  } catch (error) {
    return next(new ApiError(401, "Unauthorized: invalid token"));
  }
};

module.exports = authMiddleware;
