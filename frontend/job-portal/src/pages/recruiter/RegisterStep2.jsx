/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";
import industryOptions from "./components/industryOptions";

const API = "http://localhost:5000";

const RegisterStep2 = () => {
  const navigate = useNavigate();
  const basic = JSON.parse(localStorage.getItem("recruiterRegisterStep1")) || {};

  const [form, setForm] = useState({
    hiringFor: "your company",
    companyName: "",
    industry: "",
    employeesRange: "",
    designation: "",
    pincode: "",
    companyAddress: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!basic?.email || !basic?.fullName || !basic?.password) {
      alert("Step 1 data missing. Please register again.");
      navigate("/recruiter/register");
    }
  }, []);

  const validatePincode = (pincode) => /^\d{6}$/.test(pincode);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.companyName.trim()) newErrors.companyName = "Company name required";
    if (!form.industry) newErrors.industry = "Select industry";
    if (!form.employeesRange) newErrors.employeesRange = "Select employees range";
    if (!form.designation.trim()) newErrors.designation = "Designation required";
    if (!validatePincode(form.pincode))
      newErrors.pincode = "Enter valid 6 digit pincode";
    if (!form.companyAddress.trim())
      newErrors.companyAddress = "Company address required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      accountType: basic.accountType,
      fullName: basic.fullName,
      email: basic.email,
      password: basic.password,
      hiringFor: form.hiringFor,
      companyName: form.companyName,
      industry: form.industry,
      employeesRange: form.employeesRange,
      designation: form.designation,
      pincode: form.pincode,
      companyAddress: form.companyAddress,
    };

    try {
      setLoading(true);

      const res = await axios.post(`${API}/api/recruiter/register`, payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.recruiter));
      localStorage.removeItem("recruiterRegisterStep1");

      alert("Recruiter registered successfully");
      navigate("/recruiter/dashboard");
    } catch (error) {
      console.error("Registration Error:", error);
      alert(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatedBackground />

      <div className="flex items-center justify-center min-h-screen px-4 py-10 text-white">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg rounded-3xl border border-cyan-500/30 bg-[#0B1120]/90 p-8 shadow-2xl backdrop-blur-xl"
        >
          <h2 className="mb-2 text-3xl font-bold text-center text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-teal-400">
            Company Details
          </h2>

          <p className="mb-8 text-sm text-center text-slate-300">
            Add your company information
          </p>

          <div className="mb-5">
            <label className="block mb-2 text-sm text-cyan-300">Hiring for</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="hiringFor"
                  value="your company"
                  checked={form.hiringFor === "your company"}
                  onChange={handleChange}
                />
                your company
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="hiringFor"
                  value="a consultancy"
                  checked={form.hiringFor === "a consultancy"}
                  onChange={handleChange}
                />
                a consultancy
              </label>
            </div>
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm text-cyan-300">Company</label>
            <input
              type="text"
              name="companyName"
              placeholder="Enter company name"
              value={form.companyName}
              onChange={handleChange}
              className="w-full rounded-xl border border-cyan-500/40 bg-[#020617] p-3 outline-none focus:border-cyan-400"
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-400">{errors.companyName}</p>
            )}
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm text-cyan-300">Select Industry</label>
            <select
              name="industry"
              value={form.industry}
              onChange={handleChange}
              className="w-full rounded-xl border border-cyan-500/40 bg-[#020617] p-3 outline-none focus:border-cyan-400"
            >
              <option value="">Select industry</option>
              {industryOptions.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            {errors.industry && (
              <p className="mt-1 text-sm text-red-400">{errors.industry}</p>
            )}
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm text-cyan-300">
              Number of Employees
            </label>
            <select
              name="employeesRange"
              value={form.employeesRange}
              onChange={handleChange}
              className="w-full rounded-xl border border-cyan-500/40 bg-[#020617] p-3 outline-none focus:border-cyan-400"
            >
              <option value="">Select range</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="201-500">201-500</option>
              <option value="501-1000">501-1000</option>
              <option value="1000+">1000+</option>
            </select>
            {errors.employeesRange && (
              <p className="mt-1 text-sm text-red-400">{errors.employeesRange}</p>
            )}
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm text-cyan-300">
              Your Designation
            </label>
            <input
              type="text"
              name="designation"
              placeholder="Enter designation"
              value={form.designation}
              onChange={handleChange}
              className="w-full rounded-xl border border-cyan-500/40 bg-[#020617] p-3 outline-none focus:border-cyan-400"
            />
            {errors.designation && (
              <p className="mt-1 text-sm text-red-400">{errors.designation}</p>
            )}
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm text-cyan-300">Pin Code</label>
            <input
              type="text"
              name="pincode"
              placeholder="Enter company pincode"
              value={form.pincode}
              onChange={handleChange}
              className="w-full rounded-xl border border-cyan-500/40 bg-[#020617] p-3 outline-none focus:border-cyan-400"
            />
            {errors.pincode && (
              <p className="mt-1 text-sm text-red-400">{errors.pincode}</p>
            )}
          </div>

          <div className="mb-7">
            <label className="block mb-2 text-sm text-cyan-300">
              Company Address
            </label>
            <textarea
              name="companyAddress"
              placeholder="Enter company address"
              rows="4"
              value={form.companyAddress}
              onChange={handleChange}
              className="w-full rounded-xl border border-cyan-500/40 bg-[#020617] p-3 outline-none focus:border-cyan-400"
            />
            {errors.companyAddress && (
              <p className="mt-1 text-sm text-red-400">{errors.companyAddress}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 font-semibold rounded-xl bg-linear-to-r from-cyan-600 to-teal-600 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Continue"}
          </motion.button>
        </motion.form>
      </div>
    </>
  );
};

export default RegisterStep2;