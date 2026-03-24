const { v2: cloudinary } = require("cloudinary");

const configureCloudinary = ({ cloudName, apiKey, apiSecret }) => {
  if (!cloudName || !apiKey || !apiSecret) {
    return;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
};

module.exports = { cloudinary, configureCloudinary };
