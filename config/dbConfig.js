const mongoose = require("mongoose");
const dbURI = "mongodb://localhost:27017/weather-alerts"; // Your connection string, or use MongoDB Atlas URI

// Prevent multiple connections by tracking connection state
let isConnected = false; // Flag to track connection status

const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected.");
    return; // If already connected, no need to connect again
  }

  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Exit the application if the connection fails
  }
};

module.exports = connectDB;
