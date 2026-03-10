/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Menu,
  Search,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePageHeader = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="w-full text-white">
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#0b1120]/85 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-375 items-center justify-between gap-6 px-4 py-4 md:px-8">
          {/* LEFT */}
          <div className="flex min-w-0 items-center gap-8">
            <div
              className="flex cursor-pointer items-center gap-2"
              onClick={() => navigate("/")}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-cyan-500 font-bold shadow-lg shadow-blue-900/40">
                JP
              </div>
              <div className="leading-tight">
                <p className="text-lg font-bold tracking-wide text-white">
                  Job Portal
                </p>
                <p className="text-xs text-slate-400">Professional Profile</p>
              </div>
            </div>

            <div className="hidden items-center gap-6 text-sm text-slate-300 lg:flex">
              <span className="cursor-pointer transition hover:text-cyan-400">
                Prepare
              </span>
              <span className="cursor-pointer transition hover:text-cyan-400">
                Participate
              </span>
              <span className="cursor-pointer transition hover:text-cyan-400">
                Opportunities
              </span>
            </div>
          </div>

          {/* SEARCH */}
          <div className="hidden flex-1 justify-center lg:flex">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Search jobs, companies, skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 pr-12 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500/60"
              />
              <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <button className="relative rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10">
              <Bell size={18} className="text-slate-200" />
              <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                1
              </span>
            </button>

            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-slate-700 to-slate-900">
                  <User size={16} className="text-slate-200" />
                </div>
                <div className="hidden text-left md:block">
                  <p className="max-w-37.5 truncate text-sm font-semibold text-white">
                    {user?.name || user?.fullName || "User"}
                  </p>
                  <p className="text-xs capitalize text-slate-400">
                    {user?.role || "account"}
                  </p>
                </div>
                <Menu className="text-slate-300" size={18} />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-2xl shadow-black/40"
                  >
                    <button
                      onClick={goDashboard}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/5"
                    >
                      <LayoutDashboard size={17} />
                      Return to Dashboard
                    </button>

                    <button
                      onClick={() => navigate("/profile")}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-slate-200 transition hover:bg-white/5"
                    >
                      <User size={17} />
                      My Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="h-24" />
    </div>
  );
};

export default ProfilePageHeader;