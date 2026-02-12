import { useNavigate } from "react-router-dom";
import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const RegisterStep1 = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNext = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(form.email))
      newErrors.email = "Enter a valid email address";

    if (!form.password.trim())
      newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      localStorage.setItem("basicDetails", JSON.stringify(form));
      navigate("/recruiter/register-step2");
    }
  };

  return (
    <>
      <AnimatedBackground />

      <div className="flex justify-center items-center min-h-screen text-white px-4">
        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleNext}
          className="bg-[#0B1120]/90 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-cyan-500/30"
        >
          <h2 className="text-3xl font-bold mb-8 text-center bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Employer Registration
          </h2>

          <div className="mb-5">
            <label className="block mb-2 text-sm text-cyan-300">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              className="w-full bg-[#020617] border border-cyan-500/40 p-3 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm text-cyan-300">
              Company Email
            </label>
            <input
              type="email"
              placeholder="Enter your company email"
              value={form.email}
              className="w-full bg-[#020617] border border-cyan-500/40 p-3 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-sm text-cyan-300">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              className="w-full bg-[#020617] border border-cyan-500/40 p-3 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transition py-3 rounded-xl font-semibold shadow-lg"
          >
            Continue →
          </motion.button>
        </motion.form>
      </div>
    </>
  );
};

export default RegisterStep1;
