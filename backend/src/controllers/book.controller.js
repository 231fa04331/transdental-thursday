const asyncHandler = require("../utils/asyncHandler");
const bookService = require("../services/book.service");

const addBookReading = asyncHandler(async (req, res) => {
  const result = await bookService.addBookReading({
    user: req.user,
    studentId: req.body.studentId,
    date: req.body.date,
    book_name: req.body.book_name,
  });

  res.status(201).json({ success: true, data: result });
});

const getBookReadingByStudent = asyncHandler(async (req, res) => {
  const result = await bookService.getBookReadingByStudent({
    user: req.user,
    studentId: req.params.studentId,
    page: req.query.page,
    limit: req.query.limit,
  });

  res.status(200).json({ success: true, ...result });
});

module.exports = {
  addBookReading,
  getBookReadingByStudent,
};
