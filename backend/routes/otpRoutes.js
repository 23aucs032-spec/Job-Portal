const express = require("express");
const router = express.Router();

const {
  sendEmailOtp,
  verifyEmailOtp,
  saveVerifiedPhone
} = require("../controllers/otpController");

router.post("/send-email-otp", sendEmailOtp);
router.post("/verify-email-otp", verifyEmailOtp);
router.post("/phone-verified", saveVerifiedPhone);

module.exports = router;