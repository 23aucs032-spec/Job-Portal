import React, { useState, useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  UserPlus,
  LogIn,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const isAuthenticated = !!user && !!token;

  const [openDropdown, setOpenDropdown] = useState(false);
  const [openEmployer, setOpenEmployer] = useState(false);

  const dropdownRef = useRef(null);
  const employerRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
      if (employerRef.current && !employerRef.current.contains(event.target)) {
        setOpenEmployer(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  // Navigate to dashboard depending on role
  const goDashboard = () => {
    if (!user || !user.role) return;
    if (user.role === "jobseeker") {
      navigate("/jobseeker/dashboard");
    } else if (user.role === "recruiter") {
      navigate("/recruiter/dashboard");
    }
  };

  const buttonAnim = {
    whileHover: { scale: 1.08, y: -2 },
    whileTap: { scale: 0.95 },
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#020617] border-b border-[#1F2933]"
    >
      <div className="container px-6 mx-auto">
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <motion.div
            {...buttonAnim}
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#38BDF8]">
              <Briefcase className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold text-white">Job Portal</span>
          </motion.div>

          {/* NAVIGATION */}
          <nav className="hidden md:flex space-x-8 text-gray-300">
            <button onClick={() => navigate("/")}>Home</button>
            <button onClick={() => navigate("/jobs")}>Jobs</button>
            <button onClick={() => navigate("/companies")}>Companies</button>
            <button onClick={() => navigate("/services")}>Services</button>
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-4">

            {/* IF NOT LOGGED IN */}
            {!isAuthenticated && (
              <>
                <motion.button
                  {...buttonAnim}
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 border border-gray-600 rounded-lg text-gray-200 hover:bg-cyan-500"
                >
                  Login
                </motion.button>

                <motion.button
                  {...buttonAnim}
                  onClick={() => navigate("/signup")}
                  className="px-6 py-2 rounded-lg text-black"
                  style={{ background: "linear-gradient(90deg,#38BDF8,#14B8A6)" }}
                >
                  Register
                </motion.button>

                {/* Employer Dropdown */}
                <div ref={employerRef} className="relative">
                  <motion.button
                    {...buttonAnim}
                    onClick={() => setOpenEmployer(!openEmployer)}
                    className="px-4 py-2 border border-gray-600 rounded-lg text-gray-200 flex items-center gap-2 hover:bg-cyan-500"
                  >
                    For Employers
                    <motion.div animate={{ rotate: openEmployer ? 180 : 0 }}>
                      <ChevronDown size={16} />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {openEmployer && (
                      <motion.div
                        initial={{ opacity: 0, y: -15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="absolute right-0 w-52 mt-3 bg-[#020617] border border-gray-700 rounded-xl shadow-xl overflow-hidden"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05, x: 8, backgroundColor: "#0891B2" }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => navigate("/recruiter/login")}
                          className="w-full px-4 py-3 text-left text-white flex items-center gap-2"
                        >
                          <LogIn size={18} /> Employer Login
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05, x: 8, backgroundColor: "#0891B2" }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => navigate("/recruiter/register")}
                          className="w-full px-4 py-3 text-left text-white flex items-center gap-2"
                        >
                          <UserPlus size={18} /> Employer Register
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            {/* IF LOGGED IN */}
            {isAuthenticated && (
              <div ref={dropdownRef} className="relative">
                <motion.div
                  whileHover={{
                    scale: 1.06,
                    borderColor: "#38BDF8",
                    boxShadow: "0px 0px 12px rgba(56,189,248,0.4)",
                  }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="flex items-center gap-3 cursor-pointer bg-black/60 px-3 py-2 rounded-lg border border-gray-700 transition-all"
                >
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={
                      user.logo || user.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    className="w-9 h-9 rounded-full"
                  />
                  <span className="text-white text-sm font-semibold">
                    {user.fullName || user.name || user.companyName}
                  </span>
                  <motion.div animate={{ rotate: openDropdown ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown size={16} />
                  </motion.div>
                </motion.div>

                <AnimatePresence>
                  {openDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="absolute right-0 w-52 mt-3 bg-[#020617] border border-gray-700 rounded-xl shadow-xl overflow-hidden"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05, x: 8, backgroundColor: "#0891B2" }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        onClick={goDashboard}
                        className="w-full px-4 py-3 text-left text-white flex items-center gap-2"
                      >
                        <LayoutDashboard size={18} /> Dashboard
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05, x: 8, backgroundColor: "#DC2626" }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-white flex items-center gap-2"
                      >
                        <LogOut size={18} /> Logout
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;