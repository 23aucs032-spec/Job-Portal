const axios = require("axios");

const sendPhoneOTP = async (phone, otp) => {

  try {

    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message: `Your Job Portal OTP is ${otp}`,
        language: "english",
        numbers: phone
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;

  } catch (error) {

    console.error("SMS Error:", error.response?.data || error.message);
    throw error;

  }

};

module.exports = sendPhoneOTP;