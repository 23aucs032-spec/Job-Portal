const mongoose = require("mongoose");

const phoneVerificationSchema = new mongoose.Schema({

  phone: {
    type: String,
    required: true,
    unique: true
  },

  verified: {
    type: Boolean,
    default: true
  },

  verifiedAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("PhoneVerification", phoneVerificationSchema);