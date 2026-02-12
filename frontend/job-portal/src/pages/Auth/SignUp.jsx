import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../../pages/LandingPage/components/AnimatedBackground";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  CheckCircle,
  User,
  Phone,
  MapPin,
  Loader,
  Briefcase,
} from "lucide-react";

/* ---------------- PASSWORD VALIDATION ---------------- */
// eslint-disable-next-line react-refresh/only-export-components
export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Minimum 8 characters required";
  if (!/[A-Z]/.test(password)) return "At least one uppercase letter required";
  if (!/[a-z]/.test(password)) return "At least one lowercase letter required";
  if (!/\d/.test(password)) return "At least one number required";
  return "";
};

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobile: "",
    role: "",
    city: "",
    experience: "",
  });

  const [formState, setFormState] = useState({
    loading: false,
    showPassword: false,
    success: false,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      alert(passwordError);
      return;
    }

    if (!formData.role) {
      alert("Please select work status");
      return;
    }

    try {
      setFormState((prev) => ({ ...prev, loading: true }));

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile,
          role: formData.role,
          city: formData.city,
          experience:
            formData.role === "Employer"
              ? formData.experience
              : undefined,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.user.role);

      setFormState({
        loading: false,
        showPassword: false,
        success: true,
      });

      setTimeout(() => {
        if (res.data.user.role === "Employer") {
          navigate("/employer/dashboard", { replace: true });
        } else {
          navigate("/jobseeker/dashboard", { replace: true });
        }
      }, 1000);
    } catch (err) {
      console.error("SIGNUP ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed");
      setFormState((prev) => ({ ...prev, loading: false }));
    }
  };

  /* ---------------- SUCCESS SCREEN ---------------- */
  if (formState.success) {
    return (
      <div className="relative flex items-center justify-center min-h-screen px-4 bg-[#020617]">
        <AnimatedBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 text-center border shadow-xl bg-[#020617]/80 backdrop-blur-md rounded-2xl border-[#1F2933]"
        >
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-[#38BDF8]" />
          <h2 className="mb-2 text-2xl font-bold text-white">
            Account Created!
          </h2>
          <p className="mb-4 text-gray-400">
            Welcome to JobPortal! Your account has been successfully created.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 bg-[#020617]">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 border shadow-xl bg-[#020617]/80 backdrop-blur-md rounded-2xl border-[#1F2933]"
      >
        <div className="mb-8 text-center">
          <h2
            className="mb-2 text-2xl font-bold text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(90deg, #38BDF8, #14B8A6)",
            }}
          >
            Create your profile
          </h2>
          <p className="text-gray-400">
            Search & apply to jobs from India’s No.1 Job Site
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-[#38BDF8]">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute w-5 h-5 left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full py-3 pl-10 rounded-lg border bg-[#020617] border-[#1F2933] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-[#38BDF8]">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute w-5 h-5 left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full py-3 pl-10 rounded-lg border bg-[#020617] border-[#1F2933] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Mobile */}
          <div>
            <label className="block mb-1 text-sm font-medium text-[#38BDF8]">
              Mobile Number *
            </label>
            <div className="relative">
              <Phone className="absolute w-5 h-5 left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="Enter your mobile number"
                className="w-full py-3 pl-10 rounded-lg border bg-[#020617] border-[#1F2933] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-[#38BDF8]">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute w-5 h-5 left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={formState.showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a strong password"
                className="w-full py-3 pl-10 rounded-lg border bg-[#020617] border-[#1F2933] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword,
                  }))
                }
              >
                {formState.showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Work Status */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleRoleSelect("JobSeeker")}
              className={`flex-1 p-4 rounded-lg border ${
                formData.role === "JobSeeker"
                  ? "border-[#38BDF8] bg-[#0F172A] text-white"
                  : "border-[#1F2933] text-gray-400"
              }`}
            >
              <UserCheck className="mx-auto mb-2" />
              I'm a Job Seeker (Fresher)
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("Employer")}
              className={`flex-1 p-4 rounded-lg border ${
                formData.role === "Employer"
                  ? "border-[#14B8A6] bg-[#0F172A] text-white"
                  : "border-[#1F2933] text-gray-400"
              }`}
            >
              <Building2 className="mx-auto mb-2" />
              I'm an Employer (Experienced)
            </button>
          </div>

          {/* City */}
          {formData.role && (
            <div>
              <label className="block mb-1 text-sm font-medium text-[#38BDF8]">
                City *
              </label>
              <div className="relative">
                <MapPin className="absolute w-5 h-5 left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  className="w-full py-3 pl-10 rounded-lg border bg-[#020617] border-[#1F2933] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          {/* Employer Experience */}
          {formData.role === "Employer" && (
            <div>
              <label className="block mb-1 text-sm font-medium text-[#38BDF8]">
                Work Experience *
              </label>
              <div className="relative">
                <Briefcase className="absolute w-5 h-5 left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="Enter work experience (e.g., 5 years)"
                  className="w-full py-3 pl-10 rounded-lg border bg-[#020617] border-[#1F2933] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#38BDF8] focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          <motion.button
            type="submit"
            disabled={formState.loading}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-center w-full py-3 font-semibold text-black rounded-lg"
            style={{
              background: "linear-gradient(90deg, #38BDF8, #14B8A6)",
            }}
          >
            {formState.loading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Create Account
              </>
            ) : (
              "Register now"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;
