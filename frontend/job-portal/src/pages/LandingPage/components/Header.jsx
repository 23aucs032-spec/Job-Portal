import React, { useState, useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const isAuthenticated = false;
  //const user = { fullName: "Karthik", role: "employer" };
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#020617] border-b border-[#1F2933]"
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#38BDF8]">
              <Briefcase className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold text-white">
              Job Portal
            </span>
          </div>

          {/* Nav */}
          <nav className="items-center hidden space-x-8 md:flex text-gray-300">
            <button onClick={() => navigate("/")}>Home</button>
            <button onClick={() => navigate("/jobs")}>Jobs</button>
            <button onClick={() => navigate("/companies")}>Companies</button>
            <button onClick={() => navigate("/services")}>Services</button>
          </nav>

          {/* Right */}
          <div className="flex items-center space-x-4">

            {!isAuthenticated && (
              <>
                {/* Login */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-gray-200 border border-[#1F2933] rounded-lg hover:bg-[#0adce0b4]"
                >
                  Login
                </motion.button>

                {/* Register */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/signup")}
                  className="px-6 py-2 text-black rounded-lg shadow-md"
                  style={{
                    background: "linear-gradient(90deg, #38BDF8, #14B8A6)",
                  }}
                >
                  Register
                </motion.button>

                <div className="h-6 border-l border-gray-600"></div>

                {/* For Employers */}
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className="flex items-center px-4 py-2 space-x-2 border border-[#1F2933] rounded-lg text-gray-200 hover:bg-[#0fa8ab]"
                  >
                    <span>For Employers</span>
                    <ChevronDown size={16} />
                  </motion.button>

                  <AnimatePresence>
                    {openDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 w-48 mt-2 bg-[#020617] border border-[#1F2933] rounded-lg shadow-lg text-gray-200"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => {
                            navigate("/recruiter/login");
                            setOpenDropdown(false);
                          }}
                          className="block w-full px-4 py-3 text-left hover:bg-[#0fa8ab]"
                        >
                          Recruiter Login
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => {
                            navigate("/recruiter/register");
                            setOpenDropdown(false);
                          }}
                          className="block w-full px-4 py-3 text-left hover:bg-[#0fa8ab]"
                        >
                          Recruiter Register
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
