const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // 🔥 IMPORTANT for login security
    },
    mobile: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["JobSeeker", "Employer"],
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
