import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { validateEmail } from "../utils/validation";

const RecruiterLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    success: false,
  });

  /* ---------------- INPUT CHANGE ---------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setFormState((prev) => ({
        ...prev,
        errors: {
          ...prev.errors,
          email: validateEmail(value),
        },
      }));
    }
  };

  /* ---------------- VALIDATION ---------------- */
  const validateForm = () => {
    const errors = {};

    if (validateEmail(formData.email)) {
      errors.email = validateEmail(formData.email);
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFormState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setFormState((prev) => ({ ...prev, loading: true }));

      const res = await axios.post(
        "http://localhost:5000/api/recruiter/login",
        {
          email: formData.email,
          password: formData.password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const recruiter = res.data.user;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...recruiter, role: "recruiter" })
      );

      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {},
        success: true,
      }));

      setTimeout(() => {
        navigate("/recruiter/dashboard", { replace: true });
      }, 1200);
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: {
          submit:
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Invalid email or password",
        },
      }));
    }
  };

  /* ---------------- SUCCESS SCREEN ---------------- */
  if (formState.success) {
    return (
      <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#020617]">
        <AnimatedBackground />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md p-8 text-center border shadow-xl bg-[#020617]/80 backdrop-blur-md rounded-2xl border-[#1F2933]"
        >
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h2 className="mb-2 text-2xl font-bold text-white">
            Welcome Recruiter!
          </h2>
          <p className="mb-4 text-gray-400">
            Login successful. Redirecting to dashboard...
          </p>
          <div className="w-6 h-6 mx-auto border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        </motion.div>
      </div>
    );
  }

  /* ---------------- LOGIN FORM ---------------- */
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#020617]">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md p-8 border shadow-xl bg-[#020617]/80 backdrop-blur-md rounded-2xl border-[#1F2933]"
      >
        <div className="mb-8 text-center">
          <h2
            className="text-3xl font-bold text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #4F46E5, #06B6D4)",
            }}
          >
            Employer Login
          </h2>
          <p className="text-gray-400">
            Sign in to your employer account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-indigo-400">
              Company Email
            </label>
            <div className="relative">
              <Mail className="absolute w-5 h-5 text-indigo-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full py-3 pl-10 pr-4 text-white bg-transparent border border-indigo-500 rounded-lg placeholder:text-gray-500 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="Enter your company email"
              />
            </div>
            {formState.errors.email && (
              <p className="flex items-center mt-1 text-sm text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-indigo-400">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute w-5 h-5 text-indigo-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type={formState.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full py-3 pl-10 pr-12 text-white bg-transparent border border-indigo-500 rounded-lg placeholder:text-gray-500 focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
                className="absolute -translate-y-1/2 right-3 top-1/2 text-indigo-400"
              >
                {formState.showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {formState.errors.password && (
              <p className="flex items-center mt-1 text-sm text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.password}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {formState.errors.submit && (
            <p className="flex items-center text-sm text-red-500">
              <AlertCircle className="w-4 h-4 mr-1" />
              {formState.errors.submit}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={formState.loading}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-center w-full py-3 font-semibold text-white rounded-lg"
            style={{
              background:
                "linear-gradient(90deg, #4F46E5, #06B6D4)",
            }}
          >
            {formState.loading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In as Recruiter"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default RecruiterLogin;
