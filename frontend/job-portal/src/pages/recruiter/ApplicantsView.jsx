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
  Trophy,
  Percent,
  List,
} from "lucide-react";

const API = "http://localhost:5000";
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const STATUS_OPTIONS = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Hired",
];

const ApplicationViewer = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [shortlistedApplications, setShortlistedApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [totalApplicants, setTotalApplicants] = useState(0);

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

  /* ================= SAFE FETCH JSON ================= */
  const fetchJson = async (url, options = {}) => {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type") || "";

    let data = null;

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      throw new Error(
        `Invalid server response (${res.status}). Expected JSON but got: ${text.slice(
          0,
          150
        )}`
      );
    }

    if (!res.ok) {
      throw new Error(data?.message || `Request failed with status ${res.status}`);
    }

    return data;
  };

  /* ================= HELPERS ================= */
  const normalizeFilePath = (value) => {
    if (!value) return "";

    if (typeof value === "string") return value.trim();

    if (typeof value === "object") {
      if (typeof value.url === "string") return value.url.trim();
      if (typeof value.path === "string") return value.path.trim();
      if (typeof value.filePath === "string") return value.filePath.trim();
      if (typeof value.resume === "string") return value.resume.trim();
      if (typeof value.location === "string") return value.location.trim();
      if (typeof value.filename === "string") return value.filename.trim();
      if (typeof value.src === "string") return value.src.trim();
      if (typeof value.resumeUrl === "string") return value.resumeUrl.trim();
      if (typeof value.profilePic === "string") return value.profilePic.trim();
    }

    return "";
  };

  const buildFileUrl = (value) => {
    const filePath = normalizeFilePath(value);

    if (!filePath) return null;

    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }

    return `${API}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  const getImageUrl = (filePath) => buildFileUrl(filePath) || "";

  const getResumePath = (application) =>
    normalizeFilePath(
      application?.applicant?.resumeUrl ||
        application?.applicant?.resume ||
        application?.applicant?.profile?.resume ||
        application?.resume ||
        ""
    );

  const getResumeUrl = (application) =>
    buildFileUrl(
      application?.applicant?.resumeUrl ||
        application?.applicant?.resume ||
        application?.applicant?.profile?.resume ||
        application?.resume ||
        ""
    );

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

  const formatResumeName = (resumeValue) => {
    const resumePath = normalizeFilePath(resumeValue);

    if (!resumePath) return "Resume";

    const fileName = resumePath.split("/").pop();
    return fileName || "Resume";
  };

  const formatValueForDisplay = (value, fallback = "N/A") => {
    if (value === null || value === undefined || value === "") return fallback;

    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return fallback;

      return value
        .map((item) => {
          if (item === null || item === undefined || item === "") return "";
          if (typeof item === "string" || typeof item === "number") {
            return String(item);
          }
          if (typeof item === "object") {
            return (
              item.name ||
              item.title ||
              item.label ||
              item.degree ||
              item.specialization ||
              item.value ||
              JSON.stringify(item)
            );
          }
          return "";
        })
        .filter(Boolean)
        .join(", ");
    }

    if (typeof value === "object") {
      return (
        value.name ||
        value.title ||
        value.label ||
        value.degree ||
        value.specialization ||
        value.value ||
        JSON.stringify(value)
      );
    }

    return fallback;
  };

  const getEducationText = (education) => {
    if (!education) return "N/A";
    if (typeof education === "string") return education;

    if (Array.isArray(education)) {
      return (
        education
          .map((item) => {
            if (typeof item === "string") return item;

            if (typeof item === "object" && item !== null) {
              return [
                item.degree,
                item.specialization,
                item.institute,
                item.instituteLocation,
                item.startYear && item.endYear
                  ? `${item.startYear} - ${item.endYear}`
                  : item.startYear || item.endYear,
                item.percentage ? `${item.percentage}%` : "",
              ]
                .filter(Boolean)
                .join(" | ");
            }

            return "";
          })
          .filter(Boolean)
          .join(", ") || "N/A"
      );
    }

    if (typeof education === "object") {
      const parts = [
        education.degree,
        education.specialization,
        education.institute,
        education.instituteLocation,
        education.startYear && education.endYear
          ? `${education.startYear} - ${education.endYear}`
          : education.startYear || education.endYear,
        education.percentage ? `${education.percentage}%` : "",
      ].filter(Boolean);

      if (parts.length > 0) return parts.join(" | ");

      const fallbackParts = [
        education.school12Name
          ? `12th: ${education.school12Name}${
              education.school12Percentage
                ? ` (${education.school12Percentage}%)`
                : ""
            }`
          : "",
        education.school10Name
          ? `10th: ${education.school10Name}${
              education.school10Percentage
                ? ` (${education.school10Percentage}%)`
                : ""
            }`
          : "",
      ].filter(Boolean);

      return fallbackParts.join(" | ") || "N/A";
    }

    return "N/A";
  };

  const getExperienceText = (experience) => {
    if (!experience) return "N/A";

    if (typeof experience === "string" || typeof experience === "number") {
      return String(experience);
    }

    if (Array.isArray(experience)) {
      return (
        experience
          .map((item) => {
            if (typeof item === "string" || typeof item === "number") {
              return String(item);
            }

            if (typeof item === "object" && item !== null) {
              return [
                item.role || item.position || item.title,
                item.company || item.organization,
                item.startDate && item.endDate
                  ? `${item.startDate} - ${item.endDate}`
                  : item.startDate || item.endDate,
                item.years ? `${item.years} years` : "",
              ]
                .filter(Boolean)
                .join(" | ");
            }

            return "";
          })
          .filter(Boolean)
          .join(", ") || "N/A"
      );
    }

    if (typeof experience === "object") {
      return (
        [
          experience.role || experience.position || experience.title,
          experience.company || experience.organization,
          experience.startDate && experience.endDate
            ? `${experience.startDate} - ${experience.endDate}`
            : experience.startDate || experience.endDate,
          experience.years ? `${experience.years} years` : "",
        ]
          .filter(Boolean)
          .join(" | ") || "N/A"
      );
    }

    return "N/A";
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Under Review":
        return "border border-amber-500/20 bg-amber-500/15 text-amber-300";
      case "Shortlisted":
        return "border border-blue-500/20 bg-blue-500/15 text-blue-300";
      case "Rejected":
        return "border border-red-500/20 bg-red-500/15 text-red-300";
      case "Hired":
        return "border border-emerald-500/20 bg-emerald-500/15 text-emerald-300";
      default:
        return "border border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
    }
  };

  const getScreeningClasses = (result) => {
    switch (result) {
      case "Selected":
        return "border border-emerald-500/20 bg-emerald-500/15 text-emerald-300";
      case "Processing":
        return "border border-amber-500/20 bg-amber-500/15 text-amber-300";
      case "Rejected":
        return "border border-red-500/20 bg-red-500/15 text-red-300";
      default:
        return "border border-slate-500/20 bg-slate-500/15 text-slate-300";
    }
  };

  /* ================= FETCH DATA ================= */
  const fetchApplicants = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/recruiter/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const recruiterData = await fetchJson(`${API}/api/recruiter/profile`, {
        headers,
      });
      setRecruiter(recruiterData);

      const applicantData = await fetchJson(
        `${API}/api/applications/job/${jobId}/applicants`,
        { headers }
      );

      const normalizedJob = applicantData?.job || null;

      const normalizedApplications = Array.isArray(applicantData?.applicants)
        ? applicantData.applicants
        : Array.isArray(applicantData?.applications)
        ? applicantData.applications
        : Array.isArray(applicantData)
        ? applicantData
        : [];

      const normalizedShortlisted = Array.isArray(
        applicantData?.shortlistedApplicants
      )
        ? applicantData.shortlistedApplicants
        : normalizedApplications.slice(0, 10);

      setJob(normalizedJob);
      setApplications(normalizedApplications);
      setShortlistedApplications(normalizedShortlisted);
      setTotalApplicants(
        Number(applicantData?.totalApplicants || normalizedApplications.length)
      );
    } catch (err) {
      console.error("Applicants fetch error:", err);
      setApplications([]);
      setShortlistedApplications([]);
      setJob(null);
      setTotalApplicants(0);
      alert(err.message || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  /* ================= STATUS UPDATE ================= */
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/recruiter/login");
        return;
      }

      setUpdatingId(applicationId);

      const response = await fetchJson(
        `${API}/api/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const updatedApplication = response?.application;

      setApplications((prev) =>
        prev.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                ...(updatedApplication || {}),
                status: updatedApplication?.status || status,
              }
            : application
        )
      );

      setShortlistedApplications((prev) =>
        prev.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                ...(updatedApplication || {}),
                status: updatedApplication?.status || status,
              }
            : application
        )
      );

      if (response?.mailWarning) {
        alert(response.mailWarning);
      } else {
        alert(response?.message || "Application status updated successfully");
      }
    } catch (error) {
      console.error("Status update error:", error);
      alert(error.message || "Failed to update application status");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= OTHER HELPERS ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const totalResumes = useMemo(() => {
    return applications.filter((application) => !!getResumePath(application)).length;
  }, [applications]);

  const totalShortlisted = useMemo(() => {
    return applications.filter(
      (application) =>
        application?.status === "Shortlisted" ||
        application?.screeningResult === "Selected"
    ).length;
  }, [applications]);

  const averageScore = useMemo(() => {
    if (!applications.length) return 0;

    const total = applications.reduce(
      (sum, application) => sum + Number(application?.screeningScore || 0),
      0
    );

    return Math.round(total / applications.length);
  }, [applications]);

  const recruiterName = recruiter?.fullName || recruiter?.name || "Recruiter";
  const companyName =
    recruiter?.companyName || job?.companyName || job?.consultancyName || "Company";
  const logoUrl = buildFileUrl(recruiter?.logo);

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
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020617]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-8">
              <div
                onClick={() => navigate("/")}
                className="flex cursor-pointer items-center gap-3"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
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
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => navigate("/post-job")}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                >
                  Post Job
                </button>

                <button
                  onClick={() => navigate("/manage-jobs")}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                >
                  Manage Jobs
                </button>

                <button
                  onClick={() => navigate(`/applicants/${jobId}`)}
                  className="rounded-xl border border-cyan-500/20 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-300"
                >
                  Applicants
                </button>
              </nav>
            </div>

            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-xl backdrop-blur-xl hover:border-cyan-400/30"
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Company Logo"
                    className="h-11 w-11 rounded-full border border-white/20 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500/15">
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
                    className="absolute right-0 z-30 mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220]/95 shadow-2xl backdrop-blur-xl"
                  >
                    <button
                      onClick={() => navigate("/recruiter/profile")}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/10"
                    >
                      <UserCircle2 size={18} />
                      Profile
                    </button>

                    <button
                      onClick={() => navigate("/recruiter/dashboard")}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/10"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </button>

                    <button
                      onClick={() => navigate("/post-job")}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/10"
                    >
                      <PlusCircle size={18} />
                      Post Job
                    </button>

                    <button
                      onClick={() => navigate("/manage-jobs")}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/10"
                    >
                      <Settings size={18} />
                      Manage Jobs
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-red-500/20"
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

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 rounded-3xl border border-white/10 bg-linear-to-r from-[#0f172a] via-[#111827] to-[#0f172a] p-6 shadow-2xl"
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

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate(`/applicants/${jobId}/all`)}
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/15 px-5 py-3 font-medium text-cyan-300 transition hover:bg-cyan-500/20"
              >
                <List size={18} />
                View All Applicants
              </button>

              <button
                onClick={() => navigate("/recruiter/dashboard")}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium transition hover:bg-white/10"
              >
                <ArrowLeft size={18} />
                Recruiter Dashboard
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4"
        >
          <StatCard
            title="Total Applicants"
            value={totalApplicants}
            icon={<Users size={22} />}
          />
          <StatCard
            title="Resume Uploaded"
            value={totalResumes}
            icon={<FileText size={22} />}
          />
          <StatCard
            title="Shortlisted"
            value={totalShortlisted}
            icon={<Trophy size={22} />}
          />
          <StatCard
            title="Average Match"
            value={`${averageScore}%`}
            icon={<Percent size={22} />}
            small
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Top 10 Shortlisted Applicants
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Applicants are ranked by resume-job match percentage.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
              <Trophy size={16} />
              Showing {shortlistedApplications.length} shortlisted candidates
            </div>
          </div>
        </motion.div>

        {shortlistedApplications.length === 0 ? (
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
            {shortlistedApplications.map((application, index) => {
              const applicant = application?.applicant || {};
              const resumePath = getResumePath(application);
              const resumeUrl = getResumeUrl(application);
              const currentStatus = application?.status || "Applied";
              const currentScreeningResult =
                application?.screeningResult || "Not Screened";
              const currentScore = Number(application?.screeningScore || 0);
              const isUpdating = updatingId === application?._id;

              return (
                <motion.div
                  key={application?._id || index}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={getImageUrl(applicant.profilePic) || DEFAULT_AVATAR}
                        alt="Applicant"
                        className="h-16 w-16 rounded-2xl border border-white/10 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_AVATAR;
                        }}
                      />

                      <div>
                        <h2 className="text-xl font-semibold">
                          {formatValueForDisplay(
                            applicant.fullName || applicant.name,
                            "No Name"
                          )}
                        </h2>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <p
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                              currentStatus
                            )}`}
                          >
                            {currentStatus}
                          </p>

                          <p
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getScreeningClasses(
                              currentScreeningResult
                            )}`}
                          >
                            {currentScreeningResult}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-300">
                      Top Candidate
                    </div>
                  </div>

                  <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-3">
                      <div className="mb-2 flex items-center gap-2 text-cyan-300">
                        <Percent size={16} />
                        <span className="text-sm font-medium">Match Score</span>
                      </div>
                      <p className="text-lg font-bold text-white">
                        {currentScore}%
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-3">
                      <div className="mb-2 flex items-center gap-2 text-cyan-300">
                        <BadgeCheck size={16} />
                        <span className="text-sm font-medium">AI Result</span>
                      </div>
                      <p className="text-sm font-semibold text-white">
                        {currentScreeningResult}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <InfoRow
                      icon={<Mail size={16} />}
                      label="Email"
                      value={applicant.email}
                      fallback="No Email"
                    />

                    <InfoRow
                      icon={<Phone size={16} />}
                      label="Phone"
                      value={applicant.mobile || applicant.phone}
                    />

                    <InfoRow
                      icon={<MapPin size={16} />}
                      label="Location"
                      value={applicant.city || applicant.location}
                    />

                    <InfoRow
                      icon={<GraduationCap size={16} />}
                      label="Education"
                      value={getEducationText(applicant.education)}
                    />

                    <InfoRow
                      icon={<Clock3 size={16} />}
                      label="Experience"
                      value={getExperienceText(applicant.experience)}
                    />

                    <InfoRow
                      icon={<CalendarDays size={16} />}
                      label="Applied On"
                      value={formatDate(application.appliedAt || application.createdAt)}
                    />
                  </div>

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
                            {formatValueForDisplay(skill, "Skill")}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">No skills added</p>
                    )}
                  </div>

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
                              {formatResumeName(resumePath)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 p-3">
                            <span className="text-slate-400">Status</span>
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
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

                  <div className="mt-5 rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <UserCircle2 size={17} className="text-purple-400" />
                      <p className="text-sm font-semibold text-purple-400">
                        Applicant Summary
                      </p>
                    </div>

                    <p className="text-sm leading-6 text-slate-300">
                      {formatValueForDisplay(
                        applicant.profileSummary || applicant.summary,
                        "No profile summary available."
                      )}
                    </p>
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Settings size={17} className="text-amber-400" />
                      <p className="text-sm font-semibold text-amber-400">
                        Update Status
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <select
                        value={currentStatus}
                        disabled={isUpdating}
                        onChange={(e) =>
                          updateApplicationStatus(application._id, e.target.value)
                        }
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 disabled:opacity-60"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="bg-[#0f172a] text-white"
                          >
                            {status}
                          </option>
                        ))}
                      </select>

                      {isUpdating && (
                        <span className="text-sm text-slate-400">
                          Updating status...
                        </span>
                      )}
                    </div>
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
  const displayValue =
    value === null || value === undefined || value === "" ? "0" : String(value);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-400">{title}</p>
          <h3
            className={`mt-2 font-bold text-white ${
              small ? "truncate text-lg" : "text-2xl"
            }`}
          >
            {displayValue}
          </h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
          {icon}
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value, fallback = "N/A" }) => {
  const displayValue = (() => {
    if (value === null || value === undefined || value === "") return fallback;

    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }

    if (Array.isArray(value)) {
      return (
        value
          .map((item) =>
            typeof item === "string" || typeof item === "number"
              ? String(item)
              : item?.name || item?.title || item?.degree || JSON.stringify(item)
          )
          .filter(Boolean)
          .join(", ") || fallback
      );
    }

    if (typeof value === "object") {
      return (
        value.name ||
        value.title ||
        value.degree ||
        value.specialization ||
        JSON.stringify(value)
      );
    }

    return fallback;
  })();

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-3">
      <div className="mb-2 flex items-center gap-2 text-cyan-300">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="break-words text-sm text-slate-300">{displayValue}</p>
    </div>
  );
};

export default ApplicationViewer;