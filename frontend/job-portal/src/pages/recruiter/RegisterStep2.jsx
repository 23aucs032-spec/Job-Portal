/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const RegisterStep2 = () => {
  const navigate = useNavigate();
  const basic = JSON.parse(localStorage.getItem("companyBasic"));

  const [form, setForm] = useState({
    companyName: "",
    companyAddress: "",
    recruiterName: "",
    designation: "",
    employeesRange: "",
    pincode: "",
    recruiterPhone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validatePhone = (phone) => /^\d{10}$/.test(phone);
  const validatePincode = (pincode) => /^\d{6}$/.test(pincode);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!form.companyName.trim()) newErrors.companyName = "Company name required";
    if (!form.companyAddress.trim()) newErrors.companyAddress = "Address required";
    if (!form.recruiterName.trim()) newErrors.recruiterName = "Recruiter name required";
    if (!form.designation.trim()) newErrors.designation = "Designation required";

    if (!form.employeesRange) newErrors.employeesRange = "Select employees";

    if (!validatePincode(form.pincode))
      newErrors.pincode = "Enter valid pincode";

    if (!validatePhone(form.recruiterPhone))
      newErrors.recruiterPhone = "Phone must be 10 digits";

    if (form.password.length < 6)
      newErrors.password = "Password must be 6 characters";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const finalData = { ...basic, ...form };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/recruiter/register",
        finalData
      );

      localStorage.removeItem("companyBasic");
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

      <div className="flex items-center justify-center min-h-screen px-4 text-white">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0B1120]/90 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-cyan-500/30"
        >
          <h2 className="mb-8 text-3xl font-bold text-center text-transparent bg-linear-to-r from-cyan-400 to-teal-400 bg-clip-text">
            Recruiter Details
          </h2>

          {[
            ["Company Name", "companyName"],
            ["Company Address", "companyAddress"],
            ["Recruiter Name", "recruiterName"],
            ["Designation", "designation"],
            ["Pincode", "pincode"],
            ["Recruiter Phone", "recruiterPhone"],
            ["Password", "password"],
          ].map(([label, key]) => (
            <div className="mb-5" key={key}>
              <label className="block mb-2 text-sm text-cyan-300">
                {label}
              </label>

              <input
                type={key === "password" ? "password" : "text"}
                value={form[key]}
                placeholder={`Enter ${label}`}
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
                className="w-full bg-[#020617] border border-cyan-500/40 p-3 rounded-xl"
              />

              {errors[key] && (
                <p className="mt-1 text-sm text-red-400">
                  {errors[key]}
                </p>
              )}
            </div>
          ))}

          {/* Employees */}
          <div className="mb-6">
            <label className="block mb-2 text-sm text-cyan-300">
              Employees Range
            </label>

            <select
              value={form.employeesRange}
              onChange={(e) =>
                setForm({ ...form, employeesRange: e.target.value })
              }
              className="w-full bg-[#020617] border border-cyan-500/40 p-3 rounded-xl"
            >
              <option value="">Select Range</option>
              <option value="0-100">0-100</option>
              <option value="100-200">100-200</option>
              <option value="200-300">200-300</option>
              <option value="300-400">300-400</option>
              <option value="400-500">400-500</option>
              <option value="500+">500+</option>
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            type="submit"
            className="w-full py-3 font-semibold bg-linear-to-r from-cyan-600 to-teal-600 rounded-xl"
          >
            Register →
          </motion.button>
        </motion.form>
      </div>
    </>
  );
};

export default RegisterStep2;