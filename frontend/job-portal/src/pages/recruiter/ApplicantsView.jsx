/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  FileText,
  Briefcase,
  ArrowLeft,
  GraduationCap,
  Clock3,
  Building2,
  Users,
  CalendarDays,
  BadgeCheck,
  Eye,
  Download,
  UserCircle2,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  Settings,
} from "lucide-react";

const API = "http://localhost:5000";
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const ApplicationViewer = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
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

  /* ================= FETCH DATA ================= */
  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/recruiter/login");
        return;
      }

      const recruiterRes = await fetch(`${API}/api/recruiter/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (recruiterRes.ok) {
        const recruiterData = await recruiterRes.json();
        setRecruiter(recruiterData);
      }

      const jobRes = await fetch(`${API}/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!jobRes.ok) {
        throw new Error("Failed to fetch job");
      }

      const jobData = await jobRes.json();
      setJob(jobData);

      const res = await fetch(`${API}/api/applications/job/${jobId}/applicants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to fetch applicants");
      }

      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Applicants fetch error:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  /* ================= HELPERS ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const totalResumes = useMemo(() => {
    return applications.filter(
      (application) => application?.applicant?.resume
    ).length;
  }, [applications]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatResumeName = (resumePath) => {
    if (!resumePath) return "Resume";
    const fileName = resumePath.split("/").pop();
    return fileName || "Resume";
  };

  const recruiterName =
    recruiter?.fullName || recruiter?.name || "Recruiter";
  const companyName =
    recruiter?.companyName || job?.companyName || "Company";

  const logoUrl =
    recruiter?.logo && recruiter.logo.startsWith("http")
      ? recruiter.logo
      : recruiter?.logo
      ? `${API}${recruiter.logo}`
      : "";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl border border-white/10 bg-white/5 px-8 py-6 text-lg font-semibold text-cyan-400 shadow-xl backdrop-blur-xl"
        >
          Loading Applicants...
        </motion.div>
      </div>
    );
  }

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
                  <Briefcase size={22} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Job Portal</h1>
                  <p className="text-xs text-slate-400">Application Viewer</p>
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
                  className="px-4 py-2 text-sm font-medium transition rounded-xl text-slate-300 hover:bg-white/5"
                >
                  Manage Jobs
                </button>

                <button
                  onClick={() => navigate(`/applicants/${jobId}`)}
                  className="px-4 py-2 text-sm font-medium rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/20"
                >
                  Applicants
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
                      onClick={() => navigate("/post-job")}
                      className="flex items-center w-full gap-3 px-4 py-3 text-left transition hover:bg-white/10"
                    >
                      <PlusCircle size={18} />
                      Post Job
                    </button>

                    <button
                      onClick={() => navigate("/manage-jobs")}
                      className="flex items-center w-full gap-3 px-4 py-3 text-left transition hover:bg-white/10"
                    >
                      <Settings size={18} />
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
        {/* ================= HERO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-r from-[#0f172a] via-[#111827] to-[#0f172a] p-6 shadow-2xl"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                <Users size={13} />
                Applicant Management
              </div>

              <h1 className="mt-3 text-3xl font-bold md:text-4xl">
                Manage Applications
              </h1>

              {job && (
                <p className="mt-2 text-slate-300">
                  Review applicants for{" "}
                  <span className="font-semibold text-cyan-300">
                    {job.title || "Untitled Job"}
                  </span>
                </p>
              )}
            </div>

            <button
              onClick={() => navigate("/recruiter/dashboard")}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium transition hover:bg-white/10"
            >
              <ArrowLeft size={18} />
              Recruiter Dashboard
            </button>
          </div>
        </motion.div>

        {/* ================= JOB SUMMARY ================= */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4"
        >
          <StatCard
            title="Total Applicants"
            value={applications.length}
            icon={<Users size={22} />}
          />
          <StatCard
            title="Resume Uploaded"
            value={totalResumes}
            icon={<FileText size={22} />}
          />
          <StatCard
            title="Job Title"
            value={job?.title || "-"}
            icon={<Briefcase size={22} />}
            small
          />
          <StatCard
            title="Company"
            value={job?.companyName || job?.consultancyName || "-"}
            icon={<Building2 size={22} />}
            small
          />
        </motion.div>

        {/* ================= EMPTY STATE ================= */}
        {applications.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-xl backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10">
              <Users className="text-cyan-300" size={34} />
            </div>

            <h2 className="text-2xl font-bold">No Applicants Yet</h2>
            <p className="mt-2 text-slate-400">
              Once candidates apply, their details and resumes will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {applications.map((application, index) => {
              const applicant = application.applicant || {};
              const resumeUrl = applicant.resume
                ? `${API}/${applicant.resume}`
                : null;

              return (
                <motion.div
                  key={application._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
                >
                  {/* TOP */}
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={applicant.profilePic || DEFAULT_AVATAR}
                        alt="Applicant"
                        className="h-16 w-16 rounded-2xl border border-white/10 object-cover"
                        onError={(e) => {
                          e.target.src = DEFAULT_AVATAR;
                        }}
                      />

                      <div>
                        <h2 className="text-xl font-semibold">
                          {applicant.fullName || applicant.name || "No Name"}
                        </h2>
                        <p className="mt-1 text-sm text-cyan-400">
                          {application.status || "Applied"}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 border border-cyan-500/20">
                      Applicant
                    </div>
                  </div>

                  {/* BASIC DETAILS */}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <InfoRow
                      icon={<Mail size={16} />}
                      label="Email"
                      value={applicant.email || "No Email"}
                    />

                    <InfoRow
                      icon={<Phone size={16} />}
                      label="Phone"
                      value={applicant.mobile || applicant.phone || "N/A"}
                    />

                    <InfoRow
                      icon={<MapPin size={16} />}
                      label="Location"
                      value={applicant.city || applicant.location || "N/A"}
                    />

                    <InfoRow
                      icon={<GraduationCap size={16} />}
                      label="Education"
                      value={applicant.education || "N/A"}
                    />

                    <InfoRow
                      icon={<Clock3 size={16} />}
                      label="Experience"
                      value={applicant.experience || "N/A"}
                    />

                    <InfoRow
                      icon={<CalendarDays size={16} />}
                      label="Applied On"
                      value={formatDate(application.createdAt)}
                    />
                  </div>

                  {/* SKILLS */}
                  <div className="mt-5 rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                    <p className="mb-3 text-sm font-semibold text-cyan-400">
                      Skills
                    </p>

                    {Array.isArray(applicant.skills) && applicant.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {applicant.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="rounded-full bg-cyan-400 px-3 py-1 text-sm font-medium text-black"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">No skills added</p>
                    )}
                  </div>

                  {/* RESUME DETAILS */}
                  <div className="mt-5 rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <FileText size={17} className="text-emerald-400" />
                      <p className="text-sm font-semibold text-emerald-400">
                        Resume Details
                      </p>
                    </div>

                    {resumeUrl ? (
                      <>
                        <div className="space-y-2 text-sm text-slate-300">
                          <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 p-3">
                            <span className="text-slate-400">Resume File</span>
                            <span className="max-w-[60%] truncate text-right font-medium text-white">
                              {formatResumeName(applicant.resume)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 p-3">
                            <span className="text-slate-400">Status</span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300 border border-emerald-500/20">
                              <BadgeCheck size={14} />
                              Resume Uploaded
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-semibold transition hover:bg-blue-700"
                          >
                            <Eye size={16} />
                            View Resume
                          </a>

                          <a
                            href={resumeUrl}
                            download
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-semibold transition hover:bg-white/10"
                          >
                            <Download size={16} />
                            Download Resume
                          </a>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-xl bg-white/5 p-4">
                        <p className="text-sm text-slate-400">
                          Resume not uploaded by this applicant.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* PROFILE / SUMMARY */}
                  <div className="mt-5 rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <UserCircle2 size={17} className="text-purple-400" />
                      <p className="text-sm font-semibold text-purple-400">
                        Applicant Summary
                      </p>
                    </div>

                    <p className="text-sm leading-6 text-slate-300">
                      {applicant.profileSummary ||
                        applicant.summary ||
                        "No profile summary available."}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, small = false }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-400">{title}</p>
          <h3
            className={`mt-2 font-bold text-white ${
              small ? "text-lg truncate" : "text-2xl"
            }`}
          >
            {value}
          </h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
          {icon}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-3">
      <div className="mb-2 flex items-center gap-2 text-cyan-300">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-sm text-slate-300 break-words">{value}</p>
    </div>
  );
};

export default ApplicationViewer;