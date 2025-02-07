const mongoose = require("mongoose");

// Define user schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create and export the model
const User = mongoose.model("User", userSchema);
module.exports = User;
