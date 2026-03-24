const dotenv = require("dotenv");

dotenv.config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET", "ADMIN_USERNAME", "ADMIN_PASSWORD"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  adminUsername: process.env.ADMIN_USERNAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  vedabaseApi: process.env.VEDABASE_API || "",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
};
