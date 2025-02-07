const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    condition: {
      type: String,
      required: true,
      enum: ["temperature", "rain", "humidity"],
    },
    threshold: { type: Number, required: true },
    alertType: { type: String, enum: ["above", "below"], required: true }, // Above or below threshold
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assuming you have a User model
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", AlertSchema);
