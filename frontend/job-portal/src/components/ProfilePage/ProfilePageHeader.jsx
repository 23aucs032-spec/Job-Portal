/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Menu, Search, LayoutDashboard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePageHeader = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef();

  /* ================= CLOSE MENU ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= ROLE BASED NAVIGATION ================= */
  const goDashboard = () => {
    if (!user || !user.role) return;

    if (user.role === "jobseeker") {
      navigate("/jobseeker/dashboard");
    } else if (user.role === "recruiter") {
      navigate("/recruiter/dashboard");
    } else if (user.role === "employer") {
      navigate("/employer/dashboard");
    }

    setMenuOpen(false);
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="w-full bg-[#0F172A] text-white">

      {/* ================= DARK HEADER ================= */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0F172A] border-b border-gray-800 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-3">

          {/* LEFT SECTION */}
          <div className="flex items-center gap-10">

            <div className="flex items-center gap-2 cursor-pointer">
              <span className="text-blue-500 font-bold text-xl">Job</span>
              <span className="text-orange-400 font-semibold text-lg">Portal</span>
            </div>

            <div className="hidden md:flex items-center gap-8 font-medium text-gray-300">
              <span className="cursor-pointer hover:text-blue-400">Prepare</span>
              <span className="cursor-pointer hover:text-blue-400">Participate</span>
              <span className="cursor-pointer hover:text-blue-400">Opportunities</span>
            </div>
          </div>

          {/* SEARCH */}
          <div className="hidden md:flex relative w-105">
            <input
              type="text"
              placeholder="Search jobs here"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-2 pr-12 rounded-full bg-[#1E293B] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute right-4 top-2.5 text-gray-400" size={18} />
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-6 relative">

            {/* Notification */}
            <motion.div whileHover={{ scale: 1.1 }} className="relative cursor-pointer">
              <Bell className="text-gray-300 hover:text-blue-400" size={20} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                1
              </span>
            </motion.div>

            {/* Menu Button */}
            <div ref={menuRef} className="relative">
              <motion.div
                whileHover={{ rotate: 90 }}
                className="cursor-pointer"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <Menu className="text-gray-300 hover:text-blue-400" size={22} />
              </motion.div>

              {/* ================= DROPDOWN ================= */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-52 bg-[#1E293B] border border-gray-700 rounded-lg shadow-xl overflow-hidden"
                  >
                    <div
                      onClick={goDashboard}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#334155] cursor-pointer"
                    >
                      <LayoutDashboard size={18} />
                      <span>Return to Dashboard</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </motion.div>

      <div className="h-16"></div>
    </div>
  );
};

export default ProfilePageHeader;