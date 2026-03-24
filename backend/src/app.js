const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const chantingRoutes = require("./routes/chanting.routes");
const bookRoutes = require("./routes/book.routes");
const notificationRoutes = require("./routes/notification.routes");
const tripRoutes = require("./routes/trip.routes");
const galleryRoutes = require("./routes/gallery.routes");
const contentRoutes = require("./routes/content.routes");
const chatbotRoutes = require("./routes/chatbot.routes");

const notFoundMiddleware = require("./middlewares/notFound.middleware");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ success: true, message: "Temple Spiritual Management API is running" });
});

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Temple Spiritual Management API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/chanting", chantingRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
