/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const API = "http://localhost:5000";

const RegisterStep1 = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    accountType: "company/business",
    fullName: "",
    officialEmail: "",
    password: "",
    emailOtp: "",
  });

  const [loading, setLoading] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!validateEmail(form.officialEmail)) {
      newErrors.officialEmail = "Enter a valid official email";
    }

    if (!form.password || form.password.length < 8) {
      newErrors.password = "Password must be 8 to 40 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmailOtp = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const res = await axios.post(`${API}/api/otp/send-email-otp`, {
        email: form.officialEmail,
      });

      if (res.data.success) {
        setEmailOtpSent(true);
        alert("Email OTP sent successfully");
      }
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to send email OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailOtp = async () => {
    if (!form.emailOtp.trim()) {
      alert("Enter email OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API}/api/otp/verify-email-otp`, {
        email: form.officialEmail,
        otp: form.emailOtp,
      });

      if (res.data.success) {
        setEmailVerified(true);
        alert("Email verified successfully");
      }
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Invalid email OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!emailVerified) {
      alert("Please verify your email first");
      return;
    }

    localStorage.setItem(
      "recruiterRegisterStep1",
      JSON.stringify({
        accountType: form.accountType,
        fullName: form.fullName,
        email: form.officialEmail,
        password: form.password,
      })
    );

    navigate("/recruiter/register-step2");
  };

  return (
    <>
      <AnimatedBackground />

      <div className="flex items-center justify-center min-h-screen px-4 py-10 text-white">
        <motion.form
          onSubmit={handleNext}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg rounded-3xl border border-cyan-500/30 bg-[#0B1120]/90 p-8 shadow-2xl backdrop-blur-xl"
        >
          <h2 className="mb-2 text-3xl font-bold text-center text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">
            Basic Details
          </h2>

          <p className="mb-8 text-sm text-center text-slate-300">
            Create your recruiter account
          </p>

          <div className="mb-5">
            <label className="block mb-2 text-sm text-cyan-300">
              You're creating account as
            </label>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="accountType"
                  value="company/business"
                  checked={form.accountType === "company/business"}
                  onChange={(e) =>
                    setForm({ ...form, accountType: e.target.value })
                  }
                />
                Company / Business
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="accountType"
                  value="individual/proprietor"
                  checked={form.accountType === "individual/proprietor"}
                  onChange={(e) =>
                    setForm({ ...form, accountType: e.target.value })
                  }
                />
                Individual / Proprietor
              </label>
            </div>
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm text-cyan-300">Full Name</label>
            <input
              type="text"
              placeholder="Name as per PAN"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full rounded-xl border border-cyan-500/40 bg-[#020617] p-3 outline-none focus:border-cyan-400"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
            )}
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm text-cyan-300">
              Official Email ID
            </label>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email ID"
                value={form.officialEmail}
                onChange={(e) =>
                  setForm({
                    ...form,
                    officialEmail: e.target.value,
                    emailVerified: false,
                  })
                }
                className="w-full rounded-xl border border-cyan-500/40 bg-[#020617] p-3 outline-none focus:border-cyan-400"
              />

              <button
                type="button"
                onClick={sendEmailOtp}
                disabled={loading}
                className="px-4 py-3 font-medium rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
              >
                Send OTP
              </button>
            </div>

            {errors.officialEmail && (
              <p className="mt-1 text-sm text-red-400">{errors.officialEmail}</p>
            )}

            {emailOtpSent && !emailVerified && (
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  placeholder="Enter email OTP"
                  value={form.emailOtp}
                  onChange={(e) =>
                    setForm({ ...form, emailOtp: e.target.value })
                  }
                  className="w-full rounded-xl border border-cyan-500/40 bg-[#020617] p-3 outline-none focus:border-cyan-400"
                />

                <button
                  type="button"
                  onClick={verifyEmailOtp}
                  disabled={loading}
                  className="px-4 py-3 font-medium bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-50"
                >
                  Verify
                </button>
              </div>
            )}

            {emailVerified && (
              <p className="mt-2 text-sm text-green-400">✅ Email verified</p>
            )}
          </div>

          <div className="mb-7">
            <label className="block mb-2 text-sm text-cyan-300">
              Create Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-cyan-500/40 bg-[#020617] p-3 outline-none focus:border-cyan-400"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
            <p className="mt-2 text-xs text-slate-400">8 - 40 characters</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            type="submit"
            disabled={!emailVerified}
            className="w-full py-3 font-semibold rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 disabled:opacity-50"
          >
            Continue
          </motion.button>
        </motion.form>
      </div>
    </>
  );
};

export default RegisterStep1;