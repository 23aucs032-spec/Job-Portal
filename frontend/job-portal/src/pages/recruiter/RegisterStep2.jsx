import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const RegisterStep2 = () => {
  const navigate = useNavigate();
  const basicDetails = JSON.parse(localStorage.getItem("basicDetails"));

  const [company, setCompany] = useState({
    companyName: "",
    employeesRange: "",
    designation: "",
    pincode: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!company.companyName.trim())
      newErrors.companyName = "Company Name is required";
    if (!company.employeesRange)
      newErrors.employeesRange = "Please select employees range";
    if (!company.designation.trim())
      newErrors.designation = "Designation is required";
    if (!company.pincode.trim())
      newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(company.pincode))
      newErrors.pincode = "Pincode must be 6 digits";
    if (!company.address.trim())
      newErrors.address = "Company Address is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const finalData = { ...basicDetails, ...company };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/recruiter/register",
        finalData
      );

      localStorage.removeItem("basicDetails");
      localStorage.setItem("token", res.data.token);
      navigate("/recruiter/dashboard");
    } catch (error) {
      console.log(error);
      alert("Registration Failed");
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
          onSubmit={handleSubmit}
          className="bg-[#0B1120]/90 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-cyan-500/30"
        >
          <h2 className="text-3xl font-bold mb-8 text-center bg-linear-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Company Details
          </h2>

          {[
            ["Company Name", "companyName"],
            ["Your Designation", "designation"],
            ["Pincode", "pincode"],
          ].map(([label, key]) => (
            <div className="mb-5" key={key}>
              <label className="block mb-2 text-sm text-cyan-300">
                {label}
              </label>
              <input
                type="text"
                value={company[key]}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="w-full bg-[#020617] border border-cyan-500/40 p-3 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                onChange={(e) =>
                  setCompany({ ...company, [key]: e.target.value })
                }
              />
              {errors[key] && (
                <p className="text-red-400 text-sm mt-1">
                  {errors[key]}
                </p>
              )}
            </div>
          ))}

          <div className="mb-5">
            <label className="block mb-2 text-sm text-cyan-300">
              Employees Range
            </label>
            <select
              value={company.employeesRange}
              className="w-full bg-[#020617] border border-cyan-500/40 p-3 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              onChange={(e) =>
                setCompany({ ...company, employeesRange: e.target.value })
              }
            >
              <option value="">Select Employees Range</option>
              <option value="0-100">0 - 100</option>
              <option value="100-200">100 - 200</option>
              <option value="200-300">200 - 300</option>
              <option value="300-400">300 - 400</option>
              <option value="400-500">400 - 500</option>
              <option value="500-above">500 - Above</option>
            </select>
            {errors.employeesRange && (
              <p className="text-red-400 text-sm mt-1">
                {errors.employeesRange}
              </p>
            )}
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-sm text-cyan-300">
              Company Address
            </label>
            <textarea
              value={company.address}
              placeholder="Enter company address"
              className="w-full bg-[#020617] border border-cyan-500/40 p-3 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              onChange={(e) =>
                setCompany({ ...company, address: e.target.value })
              }
            />
            {errors.address && (
              <p className="text-red-400 text-sm mt-1">
                {errors.address}
              </p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 transition py-3 rounded-xl font-semibold shadow-lg"
          >
            Register & Go to Dashboard →
          </motion.button>
        </motion.form>
      </div>
    </>
  );
};

export default RegisterStep2;
