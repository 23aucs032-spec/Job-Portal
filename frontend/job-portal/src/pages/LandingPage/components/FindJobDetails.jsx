/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bookmark,
  MapPin,
  Briefcase,
  IndianRupee,
  Star,
  ArrowLeft,
  Building2,
  CalendarDays,
  Users,
  GraduationCap,
  Layers3,
  BadgeCheck,
  Clock3,
  ChevronRight,
} from "lucide-react";

const API = "http://localhost:5000";

const FindJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [similarJobs, setSimilarJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  /* ================= LOAD SAVED JOBS ================= */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    setSavedJobs(stored);
  }, []);

  /* ================= FETCH JOB ================= */
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API}/api/jobs/${id}`);

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.message || `Error: ${res.status}`);
        }

        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError(err.message || "Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id]);

  /* ================= FETCH SIMILAR JOBS ================= */
  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await fetch(`${API}/api/jobs/similar/${job._id}`);

        if (!res.ok) return;

        const data = await res.json();
        setSimilarJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
      }
    };

    if (job?._id) fetchSimilar();
  }, [job]);

  /* ================= ANIMATION VARIANTS ================= */
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const card = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  /* ================= HELPERS ================= */
  const formatDate = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatSalary = (minSalary, maxSalary) => {
    if (!minSalary && !maxSalary) return "Not disclosed";
    if (minSalary && maxSalary) return `₹${minSalary} - ₹${maxSalary} LPA`;
    if (minSalary) return `₹${minSalary} LPA`;
    return `₹${maxSalary} LPA`;
  };

  const formatExperience = (minExp, maxExp) => {
    if (minExp === undefined && maxExp === undefined) return "Not specified";
    if (minExp && maxExp) return `${minExp} - ${maxExp} years`;
    if (minExp) return `${minExp}+ years`;
    if (maxExp) return `Up to ${maxExp} years`;
    return "Not specified";
  };

  const applicantCount = useMemo(() => {
    if (Array.isArray(job?.applicants)) return job.applicants.length;
    if (typeof job?.applicants === "number") return job.applicants;
    return "100+";
  }, [job]);

  const isSaved = (jobId) => savedJobs.includes(jobId);

  /* ================= SAVE JOB ================= */
  const handleSaveJob = async (e, selectedJob) => {
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login to save jobs");
        navigate("/login");
        return;
      }

      const res = await fetch(`${API}/api/saved-jobs/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: selectedJob._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to save job");
        return;
      }

      let updated = [];
      if (isSaved(selectedJob._id)) {
        updated = savedJobs.filter((savedId) => savedId !== selectedJob._id);
      } else {
        updated = [...savedJobs, selectedJob._id];
      }

      setSavedJobs(updated);
      localStorage.setItem("savedJobs", JSON.stringify(updated));

      alert(data.message || "Job saved successfully");
    } catch (error) {
      console.log(error);
      alert("Something went wrong while saving the job");
    }
  };

  /* ================= LOADING / ERROR ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white">
        <div className="max-w-6xl px-4 py-16 mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="w-40 h-10 bg-white/10 rounded-xl" />
            <div className="p-8 border rounded-3xl bg-white/5 border-white/10">
              <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                <div className="flex-1 space-y-4">
                  <div className="w-1/2 h-8 bg-white/10 rounded-lg" />
                  <div className="w-1/3 h-5 bg-white/10 rounded-lg" />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="h-16 rounded-2xl bg-white/10" />
                    <div className="h-16 rounded-2xl bg-white/10" />
                    <div className="h-16 rounded-2xl bg-white/10" />
                  </div>
                </div>
                <div className="w-20 h-20 rounded-2xl bg-white/10" />
              </div>
            </div>
            <div className="h-56 border rounded-3xl bg-white/5 border-white/10" />
            <div className="h-48 border rounded-3xl bg-white/5 border-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] text-white">
        <div className="max-w-4xl px-4 py-20 mx-auto text-center">
          <div className="p-8 border rounded-3xl bg-red-500/10 border-red-500/20">
            <h2 className="text-2xl font-bold text-red-300">
              Failed to load job
            </h2>
            <p className="mt-3 text-red-200">{error}</p>
            <button
              onClick={() => navigate("/find-jobs")}
              className="px-5 py-3 mt-6 font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#020617] text-white">
        <div className="max-w-4xl px-4 py-20 mx-auto text-center">
          <div className="p-8 border rounded-3xl bg-white/5 border-white/10">
            <h2 className="text-2xl font-bold">No job found</h2>
            <button
              onClick={() => navigate("/find-jobs")}
              className="px-5 py-3 mt-6 font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-[#020617]/90 backdrop-blur-md">
        <div className="max-w-6xl px-4 py-4 mx-auto">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <button
                onClick={() => navigate("/find-jobs")}
                className="inline-flex items-center gap-2 px-4 py-2 mb-3 text-sm border rounded-xl bg-white/5 border-white/10 text-slate-300 hover:border-blue-500/30 hover:text-blue-400"
              >
                <ArrowLeft size={16} />
                Back to Jobs
              </button>

              <h1 className="text-2xl font-bold md:text-3xl">Job Details</h1>
              <p className="mt-1 text-sm text-slate-400">
                View complete role details, company information, and similar
                openings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => handleSaveJob(e, job)}
                className={`inline-flex items-center gap-2 px-4 py-2 border rounded-xl transition ${
                  isSaved(job._id)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white/5 border-white/10 text-slate-300 hover:border-blue-500/30 hover:text-blue-400"
                }`}
              >
                <Bookmark
                  size={16}
                  fill={isSaved(job._id) ? "currentColor" : "none"}
                />
                {isSaved(job._id) ? "Saved" : "Save Job"}
              </button>

              <button
                onClick={() => navigate("/jobseeker/dashboard")}
                className="px-4 py-2 text-sm border rounded-xl bg-white/5 border-white/10 text-slate-300 hover:border-white/20"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <motion.div
        className="max-w-6xl px-4 py-8 mx-auto"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* ================= LEFT SECTION ================= */}
          <div className="space-y-6">
            {/* HERO CARD */}
            <motion.div
              variants={card}
              className="p-6 border shadow-lg rounded-3xl bg-gradient-to-br from-[#0f172a] to-[#111827] border-white/10"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold md:text-3xl">
                      {job.title || "Untitled Job"}
                    </h2>

                    <span className="px-3 py-1 text-xs font-medium text-green-300 border rounded-full bg-green-500/10 border-green-500/20">
                      Actively Hiring
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-slate-300">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} />
                      <span className="font-medium">
                        {job.companyName || job.consultancyName || "Unknown Company"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400" />
                      <span>{job.rating || "3.9"}</span>
                      <span className="text-slate-500">
                        ({job.reviews || "4704"} Reviews)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 mt-6 sm:grid-cols-2 xl:grid-cols-3">
                    <div className="flex items-center gap-3 p-3 border rounded-2xl bg-white/5 border-white/10">
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Experience</p>
                        <p className="text-sm font-medium text-white">
                          {formatExperience(job.minExp, job.maxExp)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-2xl bg-white/5 border-white/10">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <IndianRupee size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Salary</p>
                        <p className="text-sm font-medium text-white">
                          {formatSalary(job.minSalary, job.maxSalary)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-2xl bg-white/5 border-white/10">
                      <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Location</p>
                        <p className="text-sm font-medium text-white">
                          {job.location || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-5 mt-5 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      Posted: {formatDate(job.createdAt)}
                    </div>

                    <div className="flex items-center gap-2">
                      <BadgeCheck size={16} />
                      Openings: {job.openings || 1}
                    </div>

                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      Applicants: {applicantCount}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">
                    <button
                      onClick={() => navigate("/signup")}
                      className="px-5 py-3 font-medium text-blue-400 transition border rounded-xl border-blue-500/40 bg-blue-500/10 hover:bg-blue-500 hover:text-white"
                    >
                      Register to Apply
                    </button>

                    <button
                      onClick={() => navigate("/login")}
                      className="px-5 py-3 font-medium text-white transition bg-blue-600 rounded-xl hover:bg-blue-700"
                    >
                      Login to Apply
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <img
                    src={
                      job.companyLogo ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    alt={job.companyName || "Company logo"}
                    className="object-cover w-20 h-20 p-2 bg-white rounded-2xl"
                  />

                  <div className="px-3 py-1 text-xs font-medium text-slate-300 border rounded-full bg-white/5 border-white/10">
                    {job.workMode || "Work mode not specified"}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* JOB DESCRIPTION */}
            <motion.div
              variants={card}
              className="p-6 border shadow-lg rounded-3xl bg-[#0f172a] border-white/10"
            >
              <h3 className="text-xl font-semibold">Job Description</h3>
              <p className="mt-4 leading-7 whitespace-pre-line text-slate-300">
                {job.jobDescription || "No job description available."}
              </p>
            </motion.div>

            {/* DETAILS GRID */}
            <motion.div
              variants={card}
              className="p-6 border shadow-lg rounded-3xl bg-[#0f172a] border-white/10"
            >
              <h3 className="text-xl font-semibold">Role Details</h3>

              <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
                <div className="p-4 border rounded-2xl bg-white/5 border-white/10">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Clock3 size={16} />
                    Work Mode
                  </div>
                  <p className="font-medium text-white">
                    {job.workMode || "N/A"}
                  </p>
                </div>

                <div className="p-4 border rounded-2xl bg-white/5 border-white/10">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Layers3 size={16} />
                    Department
                  </div>
                  <p className="font-medium text-white">
                    {job.department || "N/A"}
                  </p>
                </div>

                <div className="p-4 border rounded-2xl bg-white/5 border-white/10">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <GraduationCap size={16} />
                    Education
                  </div>
                  <p className="font-medium text-white">
                    {job.education || "N/A"}
                  </p>
                </div>

                <div className="p-4 border rounded-2xl bg-white/5 border-white/10">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Building2 size={16} />
                    Industry
                  </div>
                  <p className="font-medium text-white">
                    {job.industry || "N/A"}
                  </p>
                </div>

                <div className="p-4 border rounded-2xl bg-white/5 border-white/10">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <BadgeCheck size={16} />
                    Company Type
                  </div>
                  <p className="font-medium text-white">
                    {job.companyType || "N/A"}
                  </p>
                </div>

                <div className="p-4 border rounded-2xl bg-white/5 border-white/10">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <CalendarDays size={16} />
                    Apply Before
                  </div>
                  <p className="font-medium text-white">
                    {formatDate(job.applyBefore)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* SKILLS */}
            {Array.isArray(job.skills) && job.skills.length > 0 && (
              <motion.div
                variants={card}
                className="p-6 border shadow-lg rounded-3xl bg-[#0f172a] border-white/10"
              >
                <h3 className="text-xl font-semibold">Required Skills</h3>

                <div className="flex flex-wrap gap-2 mt-5">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 text-sm font-medium border rounded-full bg-blue-500/10 text-blue-300 border-blue-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* RESPONSIBILITIES */}
            {Array.isArray(job.responsibilities) &&
              job.responsibilities.length > 0 && (
                <motion.div
                  variants={card}
                  className="p-6 border shadow-lg rounded-3xl bg-[#0f172a] border-white/10"
                >
                  <h3 className="text-xl font-semibold">Responsibilities</h3>

                  <div className="mt-5 space-y-3">
                    {job.responsibilities.map((responsibility, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 text-slate-300"
                      >
                        <ChevronRight
                          size={18}
                          className="mt-0.5 text-blue-400 shrink-0"
                        />
                        <p>{responsibility}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            {/* ABOUT COMPANY */}
            <motion.div
              variants={card}
              className="p-6 border shadow-lg rounded-3xl bg-[#0f172a] border-white/10"
            >
              <h3 className="text-xl font-semibold">About Company</h3>
              <p className="mt-4 leading-7 text-slate-300">
                {job.companyDescription ||
                  "Company description not available."}
              </p>
            </motion.div>

            {/* SIMILAR JOBS */}
            <motion.div
              variants={card}
              className="p-6 border shadow-lg rounded-3xl bg-[#0f172a] border-white/10"
            >
              <h3 className="text-xl font-semibold">Similar Jobs</h3>

              <div className="mt-6 space-y-4">
                {similarJobs.length === 0 && (
                  <p className="text-sm text-slate-400">
                    No similar jobs found.
                  </p>
                )}

                {similarJobs.map((item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{ y: -3, scale: 1.01 }}
                    onClick={() => navigate(`/find-job/${item._id}`)}
                    className="p-5 transition border cursor-pointer rounded-2xl bg-white/5 border-white/10 hover:border-blue-500/30"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-blue-400">
                          {item.title || "Untitled Job"}
                        </h4>

                        <p className="mt-1 text-sm text-slate-300">
                          {item.companyName || "Unknown Company"}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-400">
                          <span>🧳 {formatExperience(item.minExp, item.maxExp)}</span>
                          <span>📍 {item.location || "N/A"}</span>
                          <span>
                            💰 {formatSalary(item.minSalary, item.maxSalary)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <img
                          src={
                            item.companyLogo ||
                            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                          }
                          alt={item.companyName || "Company logo"}
                          className="object-cover w-14 h-14 p-1 bg-white rounded-xl"
                        />

                        <button
                          onClick={(e) => handleSaveJob(e, item)}
                          className={`flex items-center gap-2 px-3 py-2 text-xs border rounded-xl transition ${
                            isSaved(item._id)
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white/5 border-white/10 text-slate-300 hover:text-blue-400 hover:border-blue-500/30"
                          }`}
                        >
                          <Bookmark
                            size={14}
                            fill={isSaved(item._id) ? "currentColor" : "none"}
                          />
                          {isSaved(item._id) ? "Saved" : "Save"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <div className="space-y-6">
            <motion.div
              variants={card}
              className="sticky p-6 border shadow-lg top-28 rounded-3xl bg-[#0f172a] border-white/10"
            >
              <h3 className="text-lg font-semibold">Quick Overview</h3>

              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-2xl bg-white/5">
                  <p className="text-xs text-slate-400">Company</p>
                  <p className="mt-1 font-medium text-white">
                    {job.companyName || job.consultancyName || "N/A"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5">
                  <p className="text-xs text-slate-400">Role Category</p>
                  <p className="mt-1 font-medium text-white">
                    {job.roleCategory || "N/A"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5">
                  <p className="text-xs text-slate-400">Contact Email</p>
                  <p className="mt-1 font-medium break-all text-white">
                    {job.contactEmail || "N/A"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5">
                  <p className="text-xs text-slate-400">Hiring For</p>
                  <p className="mt-1 font-medium text-white">
                    {job.hiringFor || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 mt-6">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3 font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700"
                >
                  Login to Apply
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="w-full py-3 font-medium text-blue-400 transition border rounded-xl border-blue-500/30 bg-blue-500/10 hover:bg-blue-500 hover:text-white"
                >
                  Create Account
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FindJobDetails;