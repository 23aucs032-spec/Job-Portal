const mongoose = require("mongoose");

const emailOtpSchema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    index: true
  },

  otp: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300
  }

});

module.exports = mongoose.model("EmailOTP", emailOtpSchema);