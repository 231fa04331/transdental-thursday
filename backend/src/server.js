const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
const { configureCloudinary } = require("./config/cloudinary");

const startServer = async () => {
  try {
    await connectDB(env.mongoUri);
    configureCloudinary(env.cloudinary);

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
