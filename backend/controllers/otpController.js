const EmailOTP = require("../models/emailOtpModel");
const PhoneVerification = require("../models/phoneVerificationModel");
const sendEmailOTP = require("../utils/sendMail");


/* ================= SEND EMAIL OTP ================= */

const sendEmailOtp = async (req, res) => {

  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await EmailOTP.deleteMany({ email });

    const newOtp = new EmailOTP({
      email,
      otp
    });

    await newOtp.save();

    await sendEmailOTP(email, otp);

    res.json({
      success: true,
      message: "Email OTP sent"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send email OTP"
    });

  }

};


/* ================= VERIFY EMAIL OTP ================= */

const verifyEmailOtp = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const record = await EmailOTP.findOne({ email, otp });

    if (!record) {

      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });

    }

    await EmailOTP.deleteMany({ email });

    res.json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "OTP verification failed"
    });

  }

};


/* ================= SAVE VERIFIED PHONE ================= */

const saveVerifiedPhone = async (req, res) => {

  try {

    const { phone } = req.body;

    if (!phone) {

      return res.status(400).json({
        success: false,
        message: "Phone required"
      });

    }

    const phoneRecord = await PhoneVerification.findOneAndUpdate(

      { phone },

      {
        phone,
        verified: true,
        verifiedAt: Date.now()
      },

      {
        upsert: true,
        returnDocument: "after"
      }

    );

    res.json({
      success: true,
      message: "Phone verified successfully",
      data: phoneRecord
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to save phone verification"
    });

  }

};

module.exports = {
  sendEmailOtp,
  verifyEmailOtp,
  saveVerifiedPhone
};