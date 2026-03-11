/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaInfoCircle,
  FaBriefcase,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaBuilding,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaUsers,
} from "react-icons/fa";
import {
  ChevronDown,
  LogOut,
  UserCircle2,
  Settings,
  PlusCircle,
  LayoutDashboard,
  BadgeCheck,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [recruiter, setRecruiter] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);
  const dropdownRef = useRef(null);

  const getToken = () => localStorage.getItem("token");

  const getAuthHeaders = () => {
    const token = getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/recruiter/login");
  };

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

  /* ================= FETCH RECRUITER PROFILE ================= */
  const fetchRecruiterProfile = async () => {
    try {
      const token = getToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await axios.get(`${API}/api/recruiter/profile`, {
        headers: getAuthHeaders(),
      });

      setRecruiter(response.data || null);
    } catch (error) {
      console.error("Recruiter Profile Fetch Error:", error);
    }
  };

  /* ================= FETCH JOBS ================= */
  const fetchJobs = async () => {
    try {
      const token = getToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(`${API}/api/jobs/my/jobs`, {
        headers: getAuthHeaders(),
      });

      const jobsData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.jobs)
        ? response.data.jobs
        : [];

      setJobs(jobsData);
    } catch (error) {
      console.error("Fetch Jobs Error:", error);

      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch jobs";

      if (status === 401) {
        handleUnauthorized();
        return;
      }

      setErrorMessage(message);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    fetchRecruiterProfile();
    fetchJobs();
  }, []);

  /* ================= DELETE JOB ================= */
  const handleDelete = async (id) => {
    try {
      const token = getToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      if (!window.confirm("Are you sure you want to delete this job?")) return;

      setDeletingId(id);

      await axios.delete(`${API}/api/jobs/${id}`, {
        headers: getAuthHeaders(),
      });

      setJobs((prev) => prev.filter((job) => job._id !== id));

      if (selectedJob?._id === id) {
        setSelectedJob(null);
      }
    } catch (error) {
      console.error("Delete Error:", error);

      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete job";

      if (status === 401) {
        handleUnauthorized();
        return;
      }

      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  /* ================= MEMO ================= */
  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const totalSkills = jobs.reduce(
      (sum, job) => sum + (job.skills?.length || 0),
      0
    );
    const totalPerks = jobs.reduce(
      (sum, job) => sum + (job.perks?.length || 0),
      0
    );
    const totalApplicants = jobs.reduce((sum, job) => {
      if (Array.isArray(job.applicants)) return sum + job.applicants.length;
      if (typeof job.applicants === "number") return sum + job.applicants;
      return sum;
    }, 0);

    return { totalJobs, totalSkills, totalPerks, totalApplicants };
  }, [jobs]);

  const formatSalary = (min, max) => {
    if (min == null && max == null) return "Not disclosed";
    return `₹${min ?? 0} - ₹${max ?? 0} LPA`;
  };

  const formatExperience = (min, max) => {
    return `${min ?? 0} - ${max ?? 0} yrs`;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "-";
    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const recruiterName =
    recruiter?.fullName || recruiter?.name || "Recruiter";

  const companyName = recruiter?.companyName || "Company Name";

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
            <div className="flex items-center gap-8">
              <div
                onClick={() => navigate("/")}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-cyan-500/15 text-cyan-300">
                  <FaBriefcase size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Job Portal
                  </h1>
                  <p className="text-xs text-slate-400">Manage Jobs</p>
                </div>
              </div>

              <nav className="hidden gap-2 md:flex">
                <button
                  onClick={() => navigate("/recruiter/dashboard")}
                  className="px-4 py-2 text-sm font-medium transition rounded-xl text-slate-300 hover:bg-white/5"
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
                  className="px-4 py-2 text-sm font-medium rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/20"
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
                      onClick={() => navigate("/recruiter/dashboard")}
                      className="flex items-center w-full gap-3 px-4 py-3 text-left transition hover:bg-white/10"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
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
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="p-6 mb-8 border shadow-2xl rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#111827] to-[#0f172a] border-white/10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-medium border rounded-full bg-cyan-500/10 text-cyan-300 border-cyan-500/20">
                <Settings size={13} />
                Jobs Management Panel
              </div>

              <h2 className="text-2xl font-bold md:text-3xl">
                Manage Your Posted Jobs
              </h2>
              <p className="mt-2 max-w-2xl text-slate-300">
                View, edit, update, and remove jobs posted by your company from
                one professional workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/recruiter/dashboard")}
                className="px-5 py-3 font-medium transition border rounded-2xl border-white/10 bg-white/5 hover:bg-white/10"
              >
                Recruiter Dashboard
              </button>
            </div>
          </div>
        </motion.div>

        {/* ================= STATS ================= */}
        {!loading && !errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 xl:grid-cols-4"
          >
            <StatCard
              title="Total Jobs"
              value={stats.totalJobs}
              icon={<FaBriefcase />}
            />
            <StatCard
              title="Applicants"
              value={stats.totalApplicants}
              icon={<FaUsers />}
            />
            <StatCard
              title="Skills Tagged"
              value={stats.totalSkills}
              icon={<FaInfoCircle />}
            />
            <StatCard
              title="Perks Added"
              value={stats.totalPerks}
              icon={<FaMoneyBillWave />}
            />
          </motion.div>
        )}

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="px-8 py-6 text-lg border shadow-2xl rounded-3xl bg-white/5 border-white/10 backdrop-blur-xl">
              Loading jobs...
            </div>
          </div>
        )}

        {/* ================= JOBS GRID ================= */}
        {!loading && !errorMessage && jobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            <AnimatePresence>
              {jobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  whileHover={{ y: -4 }}
                  className="relative overflow-hidden border shadow-2xl rounded-3xl border-white/10 bg-gradient-to-br from-[#0f172a] to-[#111827]"
                >
                  <div className="p-6 md:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {job.title || "Untitled Job"}
                        </h2>

                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-300">
                          <span className="inline-flex items-center gap-2">
                            <FaBuilding className="text-cyan-300" />
                            {job.companyName ||
                              job.consultancyName ||
                              "Company"}
                          </span>

                          <span className="inline-flex items-center gap-2">
                            <FaMapMarkerAlt className="text-cyan-300" />
                            {job.location || "Location not specified"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <ActionButton
                          title="View Details"
                          color="blue"
                          onClick={() => setSelectedJob(job)}
                          icon={<FaInfoCircle />}
                        />

                        <ActionButton
                          title="Edit Job"
                          color="green"
                          onClick={() => navigate(`/edit-job/${job._id}`)}
                          icon={<FaEdit />}
                        />

                        <ActionButton
                          title="Delete Job"
                          color="red"
                          onClick={() => handleDelete(job._id)}
                          icon={<FaTrash />}
                          disabled={deletingId === job._id}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2">
                      <InfoMiniCard
                        icon={<FaClock />}
                        label="Experience"
                        value={formatExperience(job.minExp, job.maxExp)}
                      />

                      <InfoMiniCard
                        icon={<FaMoneyBillWave />}
                        label="Salary"
                        value={formatSalary(job.minSalary, job.maxSalary)}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 mt-5 sm:grid-cols-2">
                      <DetailRow label="Work Mode" value={job.workMode || "-"} />
                      <DetailRow label="Department" value={job.department || "-"} />
                      <DetailRow label="Industry" value={job.industry || "-"} />
                      <DetailRow label="Education" value={job.education || "-"} />
                    </div>

                    <div className="p-4 mt-5 border rounded-2xl border-white/10 bg-white/5">
                      <p className="mb-2 text-sm font-semibold text-cyan-300">
                        Job Description
                      </p>
                      <p className="text-sm leading-6 text-slate-300 line-clamp-3">
                        {stripHtml(job.jobDescription) ||
                          "No description available."}
                      </p>
                    </div>

                    <div className="mt-5">
                      <p className="mb-2 text-sm font-semibold text-cyan-300">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {job.skills?.length > 0 ? (
                          job.skills.map((skill, idx) => (
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
                          job.perks.map((perk, idx) => (
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

                  <div className="h-1 bg-gradient-to-r from-cyan-400 to-teal-400" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ================= EMPTY ================= */}
        {!loading && !errorMessage && jobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl p-10 mx-auto text-center border shadow-2xl rounded-3xl border-white/10 bg-white/5 backdrop-blur-2xl"
          >
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-5 rounded-full bg-cyan-500/20">
              <FaBriefcase className="text-3xl text-cyan-300" />
            </div>

            <h2 className="text-2xl font-bold">No Jobs Posted Yet</h2>
            <p className="mt-3 text-slate-300">
              Start hiring by posting your first job opening.
            </p>

            <button
              onClick={() => navigate("/post-job")}
              className="px-6 py-3 mt-6 font-semibold text-black transition rounded-2xl bg-cyan-400 hover:bg-cyan-300"
            >
              Post Your First Job
            </button>
          </motion.div>
        )}
      </div>

      {/* ================= DETAILS MODAL ================= */}
<AnimatePresence>
  {selectedJob && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedJob(null)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 24 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl border border-white/10 bg-[#0B1220]/95 text-white shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
      >
        {/* HEADER */}
        <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0B1220]/95 backdrop-blur-md">
          <div className="flex items-start justify-between gap-4 p-6">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-medium border rounded-full bg-cyan-500/10 text-cyan-300 border-cyan-500/20">
                Job Details
              </div>

              <h2 className="text-2xl font-bold leading-tight md:text-3xl">
                {selectedJob.title || "Job Details"}
              </h2>

              <p className="mt-2 text-slate-300">
                {selectedJob.companyName ||
                  selectedJob.consultancyName ||
                  "Company"}
              </p>
            </div>

            <button
              onClick={() => setSelectedJob(null)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition rounded-xl bg-white/10 hover:bg-white/20"
            >
              Close
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="max-h-[calc(92vh-96px)] overflow-y-auto p-6 md:p-7">
          {/* TOP SUMMARY */}
          <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryTile
              label="Location"
              value={selectedJob.location || "Not specified"}
              color="cyan"
            />

            <SummaryTile
              label="Experience"
              value={formatExperience(selectedJob.minExp, selectedJob.maxExp)}
              color="blue"
            />

            <SummaryTile
              label="Salary"
              value={formatSalary(selectedJob.minSalary, selectedJob.maxSalary)}
              color="emerald"
            />

            <SummaryTile
              label="Apply Before"
              value={formatDate(selectedJob.applyBefore)}
              color="purple"
            />
          </div>

          {/* INFO GRID */}
          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
            <ModalInfo label="Work Mode" value={selectedJob.workMode} />
            <ModalInfo label="Department" value={selectedJob.department} />
            <ModalInfo label="Company Type" value={selectedJob.companyType} />
            <ModalInfo label="Role Category" value={selectedJob.roleCategory} />
            <ModalInfo label="Industry" value={selectedJob.industry} />
            <ModalInfo label="Education" value={selectedJob.education} />
            <ModalInfo label="Contact Email" value={selectedJob.contactEmail} />
            <ModalInfo label="Hiring For" value={selectedJob.hiringFor} />
          </div>

          {/* SKILLS */}
          <SectionBlock
            title="Skills"
            subtitle="Core technologies and capabilities expected for this role."
          >
            <div className="flex flex-wrap gap-2">
              {selectedJob.skills?.length > 0 ? (
                selectedJob.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 text-sm font-medium text-black rounded-full bg-cyan-400"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-slate-400">No skills added</p>
              )}
            </div>
          </SectionBlock>

          {/* PERKS */}
          <SectionBlock
            title="Perks & Benefits"
            subtitle="Benefits and advantages offered with this job."
          >
            <div className="flex flex-wrap gap-2">
              {selectedJob.perks?.length > 0 ? (
                selectedJob.perks.map((perk, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 text-sm font-medium text-black rounded-full bg-emerald-400"
                  >
                    {perk}
                  </span>
                ))
              ) : (
                <p className="text-slate-400">No perks added</p>
              )}
            </div>
          </SectionBlock>

          {/* RESPONSIBILITIES */}
          <SectionBlock
            title="Responsibilities"
            subtitle="Main responsibilities associated with this position."
          >
            {selectedJob.responsibilities?.length > 0 ? (
              <div className="space-y-3">
                {selectedJob.responsibilities.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="w-2.5 h-2.5 mt-2 rounded-full bg-cyan-400 shrink-0" />
                    <p className="leading-6 text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No responsibilities added</p>
            )}
          </SectionBlock>

          {/* DESCRIPTION */}
          <SectionBlock
            title="Job Description"
            subtitle="Detailed overview of the role, expectations, and qualifications."
          >
            <div className="p-4 leading-7 border rounded-2xl border-white/10 bg-white/5 text-slate-300">
              {selectedJob.jobDescription ? (
                <div
                  className="prose prose-invert max-w-none prose-p:text-slate-300 prose-li:text-slate-300 prose-headings:text-white"
                  dangerouslySetInnerHTML={{
                    __html: selectedJob.jobDescription,
                  }}
                />
              ) : (
                <p>No description available</p>
              )}
            </div>
          </SectionBlock>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="p-5 border shadow-2xl rounded-3xl border-white/10 bg-white/5 backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-white">{value}</h3>
        </div>
        <div className="flex items-center justify-center w-14 h-14 text-xl rounded-2xl bg-cyan-500/15 text-cyan-300">
          {icon}
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ title, color, onClick, icon, disabled = false }) => {
  const colorMap = {
    blue: "bg-blue-500/15 text-blue-300 hover:bg-blue-500/25",
    green: "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25",
    red: "bg-red-500/15 text-red-300 hover:bg-red-500/25",
  };

  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`flex items-center justify-center w-10 h-10 rounded-xl transition ${
        colorMap[color]
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {icon}
    </button>
  );
};

const InfoMiniCard = ({ icon, label, value }) => {
  return (
    <div className="p-4 border rounded-2xl border-white/10 bg-white/5">
      <div className="flex items-center gap-3">
        <div className="text-cyan-300">{icon}</div>
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between gap-4 p-3 border rounded-xl border-white/10 bg-white/5">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-medium text-right text-white">
        {value || "-"}
      </span>
    </div>
  );
};

const SummaryTile = ({ icon, label, value, color = "cyan" }) => {
  const colorMap = {
    cyan: "bg-cyan-500/15 text-cyan-300",
    blue: "bg-blue-500/15 text-blue-300",
    emerald: "bg-emerald-500/15 text-emerald-300",
    purple: "bg-purple-500/15 text-purple-300",
  };

  return (
    <div className="p-4 border rounded-2xl border-white/10 bg-white/5">
      <div
        className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${colorMap[color]}`}
      >
        {icon}
      </div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white break-words">
        {value || "-"}
      </p>
    </div>
  );
};

const ModalInfo = ({ label, value }) => {
  return (
    <div className="p-4 border rounded-2xl border-white/10 bg-white/5">
      <p className="mb-1 text-sm text-slate-400">{label}</p>
      <p className="font-medium text-white break-words">{value || "-"}</p>
    </div>
  );
};

const SectionBlock = ({ title, subtitle, children }) => {
  return (
    <div className="p-5 mt-6 border rounded-3xl border-white/10 bg-[#111827]/70">
      <h3 className="text-lg font-semibold text-cyan-300">{title}</h3>
      {subtitle && <p className="mt-1 mb-4 text-sm text-slate-400">{subtitle}</p>}
      {children}
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
      <p className="text-sm leading-6 break-words text-slate-300">{value}</p>
    </div>
  );
};

const stripHtml = (html) => {
  if (!html) return "";
  return String(html).replace(/<[^>]+>/g, "");
};

export default ManageJobs;