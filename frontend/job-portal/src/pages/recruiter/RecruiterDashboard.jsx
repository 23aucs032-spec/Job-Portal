/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  PlusCircle,
  Settings,
  Users,
  LogOut,
  UserCircle2,
  Building2,
  MapPin,
  IndianRupee,
  Eye,
  ChevronDown,
} from "lucide-react";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const API = "http://localhost:5000";

const RecruiterDashboard = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recruiter, setRecruiter] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  /* ================= CLOSE DROPDOWN ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= SAFE FETCH HELPER ================= */
  const fetchJson = async (url, options = {}) => {
    const res = await fetch(url, options);

    const contentType = res.headers.get("content-type") || "";
    let data = null;

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error(
        `Invalid response from server (${res.status}). Expected JSON but got: ${text.slice(
          0,
          120
        )}`
      );
    }

    if (!res.ok) {
      throw new Error(data?.message || `Request failed with status ${res.status}`);
    }

    return data;
  };

  /* ================= FETCH DASHBOARD DATA ================= */
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/recruiter/login");
        return;
      }

      try {
        setLoading(true);

        /* FETCH RECRUITER PROFILE */
        const profileData = await fetchJson(`${API}/api/recruiter/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRecruiter(profileData);

        /* FETCH RECRUITER JOBS */
        // IMPORTANT:
        // Make sure this route matches your backend exactly.
        // If your backend uses another route, replace only this URL.
        const jobsData = await fetchJson(
          `${API}/api/jobs/recruiter/${profileData._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setJobs(Array.isArray(jobsData) ? jobsData : jobsData?.jobs || []);
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        alert(error.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const totalSkills = useMemo(() => {
    return jobs.reduce((sum, job) => sum + (job.skills?.length || 0), 0);
  }, [jobs]);

  const totalPerks = useMemo(() => {
    return jobs.reduce((sum, job) => sum + (job.perks?.length || 0), 0);
  }, [jobs]);

  const logoUrl =
    recruiter?.logo && recruiter.logo.startsWith("http")
      ? recruiter.logo
      : recruiter?.logo
      ? `${API}${recruiter.logo}`
      : "";

  return (
    <>
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen px-4 py-8 text-white md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* ================= TOP BAR ================= */}
          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-5 mb-8 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                Welcome,{" "}
                {recruiter?.fullName ||
                  recruiter?.name ||
                  recruiter?.companyName ||
                  "Recruiter"}
                !
              </h1>
              <p className="mt-2 text-slate-300">
                Manage your company hiring, posted jobs, and applicants from one place.
              </p>
            </div>

            {/* PROFILE DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-3 px-4 py-3 border shadow-xl rounded-2xl bg-black/50 backdrop-blur-xl border-white/10"
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Company Logo"
                    className="object-cover w-11 h-11 border rounded-full border-white/20"
                  />
                ) : (
                  <div className="flex items-center justify-center w-11 h-11 rounded-full bg-cyan-500/20">
                    <Building2 className="text-cyan-300" size={20} />
                  </div>
                )}

                <div className="text-left">
                  <p className="text-sm font-semibold">
                    {recruiter?.companyName || "Company"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {recruiter?.email || "Recruiter"}
                  </p>
                </div>

                <ChevronDown size={18} className="text-slate-300" />
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 z-30 w-52 mt-3 overflow-hidden border shadow-2xl rounded-2xl bg-[#0B1220]/95 backdrop-blur-xl border-white/10"
                  >
                    <button
                      onClick={() => navigate("/recruiter/profile")}
                      className="flex items-center w-full gap-3 px-4 py-3 text-left transition hover:bg-white/10"
                    >
                      <UserCircle2 size={18} />
                      Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full gap-3 px-4 py-3 text-left transition hover:bg-red-500/20"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ================= OPTIONAL STATS ================= */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.03 }}
              className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              <StatCard
                title="Total Jobs"
                value={jobs.length}
                icon={<Briefcase size={24} />}
              />
              <StatCard
                title="Total Skills Used"
                value={totalSkills}
                icon={<Users size={24} />}
              />
              <StatCard
                title="Total Perks Added"
                value={totalPerks}
                icon={<Settings size={24} />}
              />
            </motion.div>
          )}

          {/* ================= QUICK ACTIONS ================= */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3"
          >
            <QuickActionCard
              title="Post a New Job"
              subtitle="Create and publish a new opening"
              icon={<PlusCircle size={26} />}
              onClick={() => navigate("/post-job")}
            />

            <QuickActionCard
              title="Manage Jobs"
              subtitle="Edit, delete, and review posted jobs"
              icon={<Settings size={26} />}
              onClick={() => navigate("/manage-jobs")}
            />

            <QuickActionCard
              title="Recruiter Profile"
              subtitle="Update company and recruiter details"
              icon={<UserCircle2 size={26} />}
              onClick={() => navigate("/recruiter/profile")}
            />
          </motion.div>

          {/* ================= LOADING ================= */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="px-8 py-6 text-lg border shadow-2xl rounded-3xl bg-black/50 border-white/10 backdrop-blur-xl">
                Loading dashboard...
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="p-6 border shadow-2xl rounded-3xl bg-black/55 backdrop-blur-2xl border-white/10 md:p-8"
            >
              <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Recent Posted Jobs</h2>
                  <p className="mt-1 text-slate-300">
                    All your currently posted jobs are shown below.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/manage-jobs")}
                  className="px-5 py-3 font-medium transition border rounded-2xl border-white/10 bg-white/5 hover:bg-white/10"
                >
                  View All Jobs
                </button>
              </div>

              {jobs.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-5 rounded-full bg-cyan-500/15">
                    <Briefcase className="text-cyan-300" size={34} />
                  </div>

                  <h3 className="text-2xl font-bold">No Jobs Posted Yet</h3>
                  <p className="mt-3 text-slate-400">
                    Start hiring by posting your first job opening.
                  </p>

                  <button
                    onClick={() => navigate("/post-job")}
                    className="px-6 py-3 mt-6 font-semibold text-black transition rounded-2xl bg-cyan-400 hover:bg-cyan-300"
                  >
                    Post Your First Job
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {jobs.map((job, index) => (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="overflow-hidden border shadow-xl rounded-3xl bg-white/5 border-white/10"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {job.title || "Untitled Job"}
                            </h3>
                            <p className="mt-1 text-slate-400">
                              {job.companyName ||
                                job.consultancyName ||
                                recruiter?.companyName}
                            </p>
                          </div>

                          <button
                            onClick={() => navigate(`/applicants/${job._id}`)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
                          >
                            <Eye size={16} />
                            Applicants
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 mt-5 sm:grid-cols-2">
                          <MiniInfo
                            icon={<MapPin size={16} />}
                            label="Location"
                            value={job.location || "Not specified"}
                          />

                          <MiniInfo
                            icon={<Users size={16} />}
                            label="Experience"
                            value={`${job.minExp || 0} - ${job.maxExp || 0} yrs`}
                          />

                          <MiniInfo
                            icon={<IndianRupee size={16} />}
                            label="Salary"
                            value={`₹${job.minSalary || 0} - ${
                              job.maxSalary || 0
                            } LPA`}
                          />

                          <MiniInfo
                            icon={<Building2 size={16} />}
                            label="Work Mode"
                            value={job.workMode || "Not specified"}
                          />
                        </div>

                        {/* Skills */}
                        <div className="mt-5">
                          <p className="mb-2 text-sm font-semibold text-cyan-300">
                            Skills
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {job.skills?.length > 0 ? (
                              job.skills.slice(0, 6).map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 text-sm font-medium text-black rounded-full bg-cyan-400"
                                >
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-slate-400">
                                No skills added
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Perks */}
                        <div className="mt-4">
                          <p className="mb-2 text-sm font-semibold text-emerald-300">
                            Perks & Benefits
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {job.perks?.length > 0 ? (
                              job.perks.slice(0, 5).map((perk, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 text-sm font-medium text-black rounded-full bg-emerald-400"
                                >
                                  {perk}
                                </span>
                              ))
                            ) : (
                              <span className="text-sm text-slate-400">
                                No perks added
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="h-1 bg-linear-to-r from-cyan-400 to-teal-400" />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

const QuickActionCard = ({ title, subtitle, icon, onClick }) => {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onClick}
      className="p-6 text-left border shadow-2xl rounded-3xl bg-black/55 backdrop-blur-2xl border-white/10 hover:border-cyan-400/40"
    >
      <div className="flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-cyan-500/15 text-cyan-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
    </motion.button>
  );
};

const StatCard = ({ title, value, icon, small = false }) => {
  return (
    <div className="p-5 border shadow-2xl rounded-3xl border-white/10 bg-black/55 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-400">{title}</p>
          <h3
            className={`${
              small ? "text-lg" : "text-3xl"
            } mt-2 font-bold text-white truncate`}
          >
            {value}
          </h3>
        </div>

        <div className="flex items-center justify-center shrink-0 w-14 h-14 rounded-2xl bg-cyan-500/15 text-cyan-300">
          {icon}
        </div>
      </div>
    </div>
  );
};

const MiniInfo = ({ icon, label, value }) => {
  return (
    <div className="p-3 border rounded-2xl border-white/10 bg-white/5">
      <div className="flex items-center gap-2 mb-1 text-cyan-300">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-sm text-slate-300">{value}</p>
    </div>
  );
};

export default RecruiterDashboard;