const asyncHandler = require("../utils/asyncHandler");
const galleryService = require("../services/gallery.service");

const createGalleryItem = asyncHandler(async (req, res) => {
  const result = await galleryService.createGalleryItem({
    file: req.file,
    url: req.body.url,
    type: req.body.type,
    title: req.body.title,
  });

  res.status(201).json({ success: true, data: result });
});

const getGalleryItems = asyncHandler(async (req, res) => {
  const result = await galleryService.getGalleryItems();
  res.status(200).json({ success: true, data: result });
});

module.exports = {
  createGalleryItem,
  getGalleryItems,
};
