/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  ChevronDown,
  Download,
  Eye,
  LayoutDashboard,
  List,
  LogOut,
  Mail,
  MapPin,
  Phone,
  PlusCircle,
  Settings,
  UserCircle2,
  Users,
  Percent,
  BadgeCheck,
} from "lucide-react";

const API = "http://localhost:5000";
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const AllApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const normalizeFilePath = (value) => {
    if (!value) return "";

    if (typeof value === "string") return value.trim();

    if (typeof value === "object") {
      if (typeof value.url === "string") return value.url.trim();
      if (typeof value.path === "string") return value.path.trim();
      if (typeof value.filePath === "string") return value.filePath.trim();
      if (typeof value.resume === "string") return value.resume.trim();
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

  const getResumeUrl = (application) =>
    buildFileUrl(
      application?.applicant?.resumeUrl ||
        application?.applicant?.resume ||
        application?.resume ||
        ""
    );

  const getImageUrl = (value) => buildFileUrl(value) || "";

  const fetchAllApplicants = async () => {
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

      const data = await fetchJson(
        `${API}/api/applications/job/${jobId}/all-applicants`,
        { headers }
      );

      setJob(data?.job || null);
      setApplicants(Array.isArray(data?.applicants) ? data.applicants : []);
    } catch (error) {
      console.error("All applicants fetch error:", error);
      alert(error.message || "Failed to load all applicants");
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllApplicants();
  }, [jobId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const recruiterName = recruiter?.fullName || recruiter?.name || "Recruiter";
  const companyName =
    recruiter?.companyName || job?.companyName || job?.consultancyName || "Company";
  const logoUrl = buildFileUrl(recruiter?.logo);

  const averageScore = useMemo(() => {
    if (!applicants.length) return 0;
    const total = applicants.reduce(
      (sum, item) => sum + Number(item?.screeningScore || 0),
      0
    );
    return Math.round(total / applicants.length);
  }, [applicants]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617] px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl border border-white/10 bg-white/5 px-8 py-6 text-lg font-semibold text-cyan-400 shadow-xl backdrop-blur-xl"
        >
          Loading All Applicants...
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
                  <p className="text-xs text-slate-400">All Applicants</p>
                </div>
              </div>
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
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                <List size={13} />
                Full Applicants List
              </div>
              <h1 className="mt-3 text-3xl font-bold">
                All Applicants
              </h1>
              <p className="mt-2 text-slate-300">
                {job?.title || "Job"} • {applicants.length} applicants • Average match{" "}
                <span className="font-semibold text-cyan-300">{averageScore}%</span>
              </p>
            </div>

            <button
              onClick={() => navigate(`/applicants/${jobId}`)}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium transition hover:bg-white/10"
            >
              <ArrowLeft size={18} />
              Back to Shortlisted
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-300">
              <thead className="bg-white/5 text-slate-200">
                <tr>
                  <th className="px-4 py-4">Applicant</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Phone</th>
                  <th className="px-4 py-4">Location</th>
                  <th className="px-4 py-4">Score</th>
                  <th className="px-4 py-4">Result</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Resume</th>
                </tr>
              </thead>
              <tbody>
                {applicants.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-10 text-center text-slate-400">
                      No applicants found.
                    </td>
                  </tr>
                ) : (
                  applicants.map((item) => {
                    const applicant = item?.applicant || {};
                    const resumeUrl = getResumeUrl(item);

                    return (
                      <tr
                        key={item?._id}
                        className="border-t border-white/10 hover:bg-white/5"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                getImageUrl(applicant?.profilePic) || DEFAULT_AVATAR
                              }
                              alt="Applicant"
                              className="h-10 w-10 rounded-xl border border-white/10 object-cover"
                              onError={(e) => {
                                e.currentTarget.src = DEFAULT_AVATAR;
                              }}
                            />
                            <div>
                              <p className="font-semibold text-white">
                                {applicant?.fullName || applicant?.name || "No Name"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="inline-flex items-center gap-2">
                            <Mail size={14} />
                            {applicant?.email || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="inline-flex items-center gap-2">
                            <Phone size={14} />
                            {applicant?.mobile || applicant?.phone || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="inline-flex items-center gap-2">
                            <MapPin size={14} />
                            {applicant?.city || applicant?.location || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-bold text-cyan-300">
                          {Number(item?.screeningScore || 0)}%
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                            {item?.screeningResult || "Not Screened"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                            {item?.status || "Applied"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {resumeUrl ? (
                            <div className="flex flex-wrap gap-2">
                              <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 font-medium text-white transition hover:bg-blue-700"
                              >
                                <Eye size={14} />
                                View
                              </a>
                              <a
                                href={resumeUrl}
                                download
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-medium text-white transition hover:bg-white/10"
                              >
                                <Download size={14} />
                                Download
                              </a>
                            </div>
                          ) : (
                            <span className="text-slate-400">No Resume</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllApplicants;