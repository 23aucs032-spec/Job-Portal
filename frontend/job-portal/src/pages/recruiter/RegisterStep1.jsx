/* eslint-disable no-unused-vars */

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";
import axios from "axios";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./components/firebase";

const RegisterStep1 = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyEmail: "",
    companyPhone: "",
    emailOtp: "",
    phoneOtp: "",
  });

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const [confirmationResult, setConfirmationResult] = useState(null);

  /* ================= VALIDATION ================= */

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const formatPhone = (phone) => `+91${phone}`;

  /* ================= EMAIL OTP ================= */

  const sendEmailOtp = async () => {

    if (!validateEmail(form.companyEmail)) {
      alert("Enter valid email");
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:5000/api/otp/send-email-otp",
        { email: form.companyEmail }
      );

      if (res.data.success) {
        setEmailOtpSent(true);
        alert("Email OTP sent successfully");
      }

    } catch (err) {
      console.error(err);
      alert("Failed to send Email OTP");
    }

  };

  const verifyEmailOtp = async () => {

    if (!form.emailOtp) {
      alert("Enter Email OTP");
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:5000/api/otp/verify-email-otp",
        {
          email: form.companyEmail,
          otp: form.emailOtp,
        }
      );

      if (res.data.success) {
        setEmailVerified(true);
        alert("Email verified successfully");
      }

    } catch (err) {
      console.error(err);
      alert("Invalid Email OTP");
    }

  };

  /* ================= FIREBASE PHONE OTP ================= */

  const setupRecaptcha = () => {

  if (!window.recaptchaVerifier) {

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          console.log("Recaptcha Verified");
        }
      }
    );

  }

};

  const sendPhoneOtp = async () => {

  if (!form.companyPhone) {
    alert("Enter phone number");
    return;
  }

  try {

    setupRecaptcha();

    const appVerifier = window.recaptchaVerifier;

    const result = await signInWithPhoneNumber(
      auth,
      "+91" + form.companyPhone,
      appVerifier
    );

    setConfirmationResult(result);
    setPhoneOtpSent(true);

    alert("OTP sent successfully");

  } catch (error) {

    console.error(error);
    alert(error.message);

  }

};

  const verifyPhoneOtp = async () => {

  if (!form.phoneOtp) {
    alert("Enter OTP");
    return;
  }

  try {

    await confirmationResult.confirm(form.phoneOtp);

    setPhoneVerified(true);

    alert("Phone verified successfully");

  } catch (error) {

    console.error(error);
    alert("Invalid OTP");

  }

};

  /* ================= NEXT ================= */

  const handleNext = (e) => {

    e.preventDefault();

    if (!emailVerified) {
      alert("Verify email first");
      return;
    }

    if (!phoneVerified) {
      alert("Verify phone first");
      return;
    }

    localStorage.setItem("companyDetails", JSON.stringify(form));

    navigate("/recruiter/register-step2");

  };

  return (
    <>
      <AnimatedBackground />

      <div className="flex items-center justify-center min-h-screen px-4 text-white">

        <motion.form
          onSubmit={handleNext}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#0B1120]/90 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-cyan-500/30"
        >

          <h2 className="mb-8 text-3xl font-bold text-center text-transparent bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text">
            Company Contact
          </h2>

          {/* EMAIL */}

          <div className="mb-6">

            <label className="block mb-2 text-sm text-cyan-300">
              Company Email
            </label>

            <div className="flex gap-2">

              <input
                type="email"
                placeholder="example@company.com"
                value={form.companyEmail}
                onChange={(e) =>
                  setForm({ ...form, companyEmail: e.target.value })
                }
                className="w-full bg-[#020617] border border-cyan-500/40 p-3 rounded-xl"
              />

              <button
                type="button"
                onClick={sendEmailOtp}
                className="px-4 bg-cyan-600 rounded-xl"
              >
                Send
              </button>

            </div>

            {emailOtpSent && (

              <div className="flex gap-2 mt-3">

                <input
                  type="text"
                  placeholder="Enter Email OTP"
                  value={form.emailOtp}
                  onChange={(e) =>
                    setForm({ ...form, emailOtp: e.target.value })
                  }
                  className="w-full bg-[#020617] border border-cyan-500/40 p-3 rounded-xl"
                />

                <button
                  type="button"
                  onClick={verifyEmailOtp}
                  className="px-4 bg-green-600 rounded-xl"
                >
                  Verify
                </button>

              </div>

            )}

            {emailVerified && (
              <p className="mt-2 text-green-400">✅ Email Verified</p>
            )}

          </div>

          {/* PHONE */}

          <div className="mb-6">

            <label className="block mb-2 text-sm text-cyan-300">
              Company Phone
            </label>

            <div className="flex gap-2">

              <input
                type="tel"
                placeholder="Enter 10 digit phone number"
                value={form.companyPhone}
                onChange={(e) =>
                  setForm({ ...form, companyPhone: e.target.value })
                }
                className="w-full bg-[#020617] border border-cyan-500/40 p-3 rounded-xl"
              />

              <button
                type="button"
                onClick={sendPhoneOtp}
                className="px-4 bg-cyan-600 rounded-xl"
              >
                Send
              </button>

            </div>

            {phoneOtpSent && (

              <div className="flex gap-2 mt-3">

                <input
                  type="text"
                  placeholder="Enter Phone OTP"
                  value={form.phoneOtp}
                  onChange={(e) =>
                    setForm({ ...form, phoneOtp: e.target.value })
                  }
                  className="w-full bg-[#020617] border border-cyan-500/40 p-3 rounded-xl"
                />

                <button
                  type="button"
                  onClick={verifyPhoneOtp}
                  className="px-4 bg-green-600 rounded-xl"
                >
                  Verify
                </button>

              </div>

            )}

            {phoneVerified && (
              <p className="mt-2 text-green-400">✅ Phone Verified</p>
            )}

          </div>

          <motion.button
            type="submit"
            disabled={!emailVerified || !phoneVerified}
            className="w-full py-3 bg-linear-to-r from-cyan-600 to-blue-600 rounded-xl disabled:opacity-50"
          >
            Next →
          </motion.button>

        </motion.form>

      </div>

      {/* Firebase Recaptcha */}
      <div id="recaptcha-container"></div>
    </>
  );
};

export default RegisterStep1;