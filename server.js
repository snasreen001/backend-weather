const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/dbConfig");
const logger = require("./config/logging");
const bodyParser = require("body-parser");
const weatherRoutes = require("./routes/weatherRoutes");
// const cityRoutes = require("./models/City");
const app = express();
require("./cronJobs");
require("dotenv").config();

connectDB();

app.use(express.json());

app.use(cors());
app.use(bodyParser.json());
app.use("/api/cities", weatherRoutes);
// app.use("/api/cities", cityRoutes);

app.use("/api/alerts", weatherRoutes);
// app.use("/api/users", userRoutes);

// mongoose
//   .connect("mongodb://localhost:27017/weather_alerts", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   });

// app.use("/api/cities", weatherRoutes);
app.get("/test", (req, res) => {
  logger.info("Test route accessed"); // Log info-level message
  res.send("Test Successful!");
});

app.get("/error", (req, res) => {
  try {
    throw new Error("An example error");
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`); // Log error-level message
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.use((err, req, res, next) => {
  logger.error(`Unexpected error: ${err.stack}`); // Log full error stack
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
