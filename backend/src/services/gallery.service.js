const Gallery = require("../models/Gallery");
const { cloudinary } = require("../config/cloudinary");
const ApiError = require("../utils/ApiError");

const uploadBufferToCloudinary = (buffer, resourceType = "auto") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "temple-gallery", resource_type: resourceType },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });

const createGalleryItem = async ({ file, url, type, title }) => {
  let finalUrl = url;
  let finalType = type;

  if (file) {
    const uploaded = await uploadBufferToCloudinary(file.buffer, "auto");
    finalUrl = uploaded.secure_url;
    finalType = uploaded.resource_type === "video" ? "video" : "image";
  }

  if (!finalUrl) {
    throw new ApiError(400, "Either file upload or url is required");
  }

  if (!finalType || !["image", "video"].includes(finalType)) {
    throw new ApiError(400, "type must be image or video");
  }

  return Gallery.create({ url: finalUrl, type: finalType, title });
};

const getGalleryItems = async () => Gallery.find({}).sort({ createdAt: -1 }).lean();

module.exports = {
  createGalleryItem,
  getGalleryItems,
};
