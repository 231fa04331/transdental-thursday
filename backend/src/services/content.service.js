const Content = require("../models/Content");

const createContent = async (payload) => Content.create(payload);

const getContent = async () => Content.find({}).sort({ createdAt: -1 }).lean();

module.exports = {
  createContent,
  getContent,
};
