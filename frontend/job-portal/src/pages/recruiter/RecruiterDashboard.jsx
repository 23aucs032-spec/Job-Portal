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
  LayoutDashboard,
  BadgeCheck,
  Clock3,
  Mail,
  Phone,
  FileText,
} from "lucide-react";

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

        const profileData = await fetchJson(`${API}/api/recruiter/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRecruiter(profileData);

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

  /* ================= MEMO VALUES ================= */
  const totalSkills = useMemo(() => {
    return jobs.reduce((sum, job) => sum + (job.skills?.length || 0), 0);
  }, [jobs]);

  const totalPerks = useMemo(() => {
    return jobs.reduce((sum, job) => sum + (job.perks?.length || 0), 0);
  }, [jobs]);

  const totalApplicants = useMemo(() => {
    return jobs.reduce((sum, job) => {
      if (Array.isArray(job.applicants)) return sum + job.applicants.length;
      if (typeof job.applicants === "number") return sum + job.applicants;
      return sum;
    }, 0);
  }, [jobs]);

  const recruiterName =
    recruiter?.fullName ||
    recruiter?.name ||
    "Recruiter";

  const companyName =
    recruiter?.companyName || "Company Name";

  const logoUrl =
    recruiter?.logo && recruiter.logo.startsWith("http")
      ? recruiter.logo
      : recruiter?.logo
      ? `${API}${recruiter.logo}`
      : "";

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* ================= NAVBAR / HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020617]/95 backdrop-blur-md">
        <div className="max-w-7xl px-4 py-4 mx-auto md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-8">
              <div
                onClick={() => navigate("/")}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-cyan-500/15 text-cyan-300">
                  <Briefcase size={22} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Job Portal</h1>
                  <p className="text-xs text-slate-400">
                    Recruiter Dashboard
                  </p>
                </div>
              </div>

              <nav className="hidden gap-2 md:flex">
                <button
                  onClick={() => navigate("/recruiter/dashboard")}
                  className="px-4 py-2 text-sm font-medium rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/20"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => navigate("/post-job")}
                  className="px-4 py-2 text-sm font-medium transition rounded-xl text-slate-300 hover:bg-white/5"
                >
                  Post Job
                </button>

                <button
                  onClick={() => navigate("/manage-jobs")}
                  className="px-4 py-2 text-sm font-medium transition rounded-xl text-slate-300 hover:bg-white/5"
                >
                  Manage Jobs
                </button>

                <button
                  onClick={() => navigate("/recruiter/profile")}
                  className="px-4 py-2 text-sm font-medium transition rounded-xl text-slate-300 hover:bg-white/5"
                >
                  Profile
                </button>
              </nav>
            </div>

            {/* RIGHT PROFILE */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-3 px-4 py-3 border shadow-xl rounded-2xl bg-white/5 backdrop-blur-xl border-white/10 hover:border-cyan-400/30"
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Company Logo"
                    className="object-cover w-11 h-11 border rounded-full border-white/20"
                  />
                ) : (
                  <div className="flex items-center justify-center w-11 h-11 rounded-full bg-cyan-500/15">
                    <UserCircle2 className="text-cyan-300" size={22} />
                  </div>
                )}

                <div className="text-left">
                  <p className="text-sm font-semibold">{recruiterName}</p>
                  <p className="text-xs text-slate-400">{companyName}</p>
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
                    className="absolute right-0 z-30 w-56 mt-3 overflow-hidden border shadow-2xl rounded-2xl bg-[#0B1220]/95 backdrop-blur-xl border-white/10"
                  >
                    <button
                      onClick={() => navigate("/recruiter/profile")}
                      className="flex items-center w-full gap-3 px-4 py-3 text-left transition hover:bg-white/10"
                    >
                      <UserCircle2 size={18} />
                      Profile
                    </button>

                    <button
                      onClick={() => navigate("/manage-jobs")}
                      className="flex items-center w-full gap-3 px-4 py-3 text-left transition hover:bg-white/10"
                    >
                      <Briefcase size={18} />
                      Manage Jobs
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
          </div>
        </div>
      </header>

      <div className="max-w-7xl px-4 py-8 mx-auto md:px-8">
        {/* ================= HERO SECTION ================= */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="p-6 mb-8 border shadow-2xl rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#111827] to-[#0f172a] border-white/10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-medium border rounded-full bg-cyan-500/10 text-cyan-300 border-cyan-500/20">
                <LayoutDashboard size={13} />
                Hiring Control Panel
              </div>

              <h2 className="text-2xl font-bold md:text-3xl">
                Welcome, {recruiterName}
              </h2>
              <p className="mt-2 max-w-2xl text-slate-300">
                Manage your company hiring, monitor applicants, and maintain all
                your posted jobs from one professional workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/post-job")}
                className="px-5 py-3 font-semibold text-black transition rounded-2xl bg-cyan-400 hover:bg-cyan-300"
              >
                Post New Job
              </button>

              <button
                onClick={() => navigate("/manage-jobs")}
                className="px-5 py-3 font-medium transition border rounded-2xl border-white/10 bg-white/5 hover:bg-white/10"
              >
                Manage Jobs
              </button>
            </div>
          </div>
        </motion.div>

        {/* ================= BASIC DETAILS ================= */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-[1.2fr_0.8fr]"
          >
            {/* RECRUITER DETAILS */}
            <div className="p-6 border shadow-2xl rounded-3xl bg-white/5 border-white/10">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-300">
                  <UserCircle2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Recruiter Details</h3>
                  <p className="text-sm text-slate-400">
                    Basic recruiter information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <DetailCard
                  icon={<UserCircle2 size={16} />}
                  label="Recruiter Name"
                  value={recruiterName}
                />
                <DetailCard
                  icon={<Building2 size={16} />}
                  label="Company Name"
                  value={companyName}
                />
                <DetailCard
                  icon={<Mail size={16} />}
                  label="Email"
                  value={recruiter?.email || "Not available"}
                />
                <DetailCard
                  icon={<Phone size={16} />}
                  label="Phone"
                  value={recruiter?.phone || "Not available"}
                />
                <DetailCard
                  icon={<MapPin size={16} />}
                  label="Address"
                  value={recruiter?.address || "Not available"}
                />
                <DetailCard
                  icon={<BadgeCheck size={16} />}
                  label="Designation"
                  value={recruiter?.designation || "Not available"}
                />
              </div>
            </div>

            {/* COMPANY DETAILS */}
            <div className="p-6 border shadow-2xl rounded-3xl bg-white/5 border-white/10">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-300">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Company Overview</h3>
                  <p className="text-sm text-slate-400">
                    Basic company information
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <DetailCard
                  icon={<Building2 size={16} />}
                  label="Employees Range"
                  value={recruiter?.employeesRange || "Not available"}
                />
                <DetailCard
                  icon={<MapPin size={16} />}
                  label="Pincode"
                  value={recruiter?.pincode || "Not available"}
                />
                <DetailCard
                  icon={<FileText size={16} />}
                  label="About"
                  value={
                    recruiter?.companyDescription ||
                    recruiter?.aboutCompany ||
                    "Company description not available"
                  }
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= STATS ================= */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.03 }}
            className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 xl:grid-cols-4"
          >
            <StatCard
              title="Total Jobs"
              value={jobs.length}
              icon={<Briefcase size={24} />}
            />
            <StatCard
              title="Applicants"
              value={totalApplicants}
              icon={<Users size={24} />}
            />
            <StatCard
              title="Skills Used"
              value={totalSkills}
              icon={<BadgeCheck size={24} />}
            />
            <StatCard
              title="Perks Added"
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
            subtitle="Create and publish a new opening for candidates"
            icon={<PlusCircle size={26} />}
            onClick={() => navigate("/post-job")}
          />

          <QuickActionCard
            title="Manage Posted Jobs"
            subtitle="Edit, review, and maintain your job postings"
            icon={<Settings size={26} />}
            onClick={() => navigate("/manage-jobs")}
          />

          <QuickActionCard
            title="Update Profile"
            subtitle="Manage recruiter and company details"
            icon={<UserCircle2 size={26} />}
            onClick={() => navigate("/recruiter/profile")}
          />
        </motion.div>

        {/* ================= JOB LIST ================= */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="px-8 py-6 text-lg border shadow-2xl rounded-3xl bg-white/5 border-white/10 backdrop-blur-xl">
              Loading dashboard...
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="p-6 border shadow-2xl rounded-3xl bg-white/5 backdrop-blur-2xl border-white/10 md:p-8"
          >
            <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Recent Posted Jobs</h2>
                <p className="mt-1 text-slate-300">
                  A quick overview of your currently posted job openings.
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
                    className="overflow-hidden border shadow-xl rounded-3xl bg-gradient-to-br from-[#0f172a] to-[#111827] border-white/10 hover:border-cyan-400/30"
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
                              recruiter?.companyName ||
                              "Company"}
                          </p>
                        </div>

                        <button
                          onClick={() => navigate(`/applicants/${job._id}`)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition rounded-xl bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25"
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
                          value={`₹${job.minSalary || 0} - ${job.maxSalary || 0} LPA`}
                        />

                        <MiniInfo
                          icon={<Building2 size={16} />}
                          label="Work Mode"
                          value={job.workMode || "Not specified"}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-3 mt-4 sm:grid-cols-2">
                        <MiniInfo
                          icon={<Clock3 size={16} />}
                          label="Department"
                          value={job.department || "Not specified"}
                        />

                        <MiniInfo
                          icon={<BadgeCheck size={16} />}
                          label="Role Category"
                          value={job.roleCategory || "Not specified"}
                        />
                      </div>

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

                    <div className="h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-400" />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const QuickActionCard = ({ title, subtitle, icon, onClick }) => {
  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onClick}
      className="p-6 text-left border shadow-2xl rounded-3xl bg-white/5 backdrop-blur-2xl border-white/10 hover:border-cyan-400/40"
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
    <div className="p-5 border shadow-2xl rounded-3xl border-white/10 bg-white/5 backdrop-blur-2xl">
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

const DetailCard = ({ icon, label, value }) => {
  return (
    <div className="p-4 border rounded-2xl border-white/10 bg-[#0f172a]">
      <div className="flex items-center gap-2 mb-2 text-cyan-300">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-sm leading-6 text-slate-300 break-words">
        {value}
      </p>
    </div>
  );
};

export default RecruiterDashboard;