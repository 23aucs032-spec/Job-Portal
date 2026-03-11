/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  MapPin,
  Briefcase,
  IndianRupee,
  ArrowLeft,
  CalendarDays,
  Building2,
  Mail,
  GraduationCap,
  Layers3,
  Clock3,
  BadgeCheck,
  Star,
} from "lucide-react";

const API = "http://localhost:5000";

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

const formatPostedDate = (value) => {
  if (!value) return "Recently posted";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently posted";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Posted today";
  if (diffDays === 1) return "Posted 1 day ago";
  if (diffDays < 7) return `Posted ${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Posted ${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  return `Posted on ${formatDate(value)}`;
};

const formatSalary = (min, max) => {
  const minVal = min ?? 0;
  const maxVal = max ?? 0;
  return `₹${minVal} - ₹${maxVal} LPA`;
};

const formatExperience = (min, max) => {
  return `${min ?? 0} - ${max ?? 0} yrs`;
};

const getLogo = (logo) => {
  if (!logo) {
    return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
  }
  if (logo.startsWith("http")) return logo;
  return `${API}/${logo}`.replace(/([^:]\/)\/+/g, "$1");
};

const decodeTokenUserId = (token) => {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.id || null;
  } catch {
    return null;
  }
};

const stripHtml = (html) => {
  if (!html) return "";
  return String(html).replace(/<[^>]+>/g, "");
};

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [applying, setApplying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  /* ================= FETCH JOB ================= */

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        setJob(null);
        setApplied(false);

        const res = await fetch(`${API}/api/jobs/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const contentType = res.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          throw new Error(`Invalid response from server (${res.status})`);
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || `Error: ${res.status}`);
        }

        setJob(data);

        if (token && Array.isArray(data.applicants) && data.applicants.length > 0) {
          const userId = decodeTokenUserId(token);

          if (userId) {
            const applicantIds = data.applicants
              .map((item) => {
                if (typeof item === "string") return item;
                if (item?._id) return String(item._id);
                return null;
              })
              .filter(Boolean);

            if (applicantIds.includes(String(userId))) {
              setApplied(true);
            }
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, token]);

  /* ================= FETCH SIMILAR JOBS ================= */

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        setSimilarLoading(true);

        const res = await fetch(`${API}/api/jobs/similar/${id}`);
        const contentType = res.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          setSimilarJobs([]);
          return;
        }

        const data = await res.json();
        setSimilarJobs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
        setSimilarJobs([]);
      } finally {
        setSimilarLoading(false);
      }
    };

    fetchSimilar();
  }, [id]);

  /* ================= FETCH SAVED JOBS ================= */

  useEffect(() => {
    const fetchSaved = async () => {
      if (!token) {
        setSaved(false);
        return;
      }

      try {
        const res = await fetch(`${API}/api/saved-jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        const ids = Array.isArray(data)
          ? data.map((item) => item.jobId?._id || item.jobId).filter(Boolean)
          : [];

        setSaved(ids.includes(id));
      } catch {
        setSaved(false);
      }
    };

    fetchSaved();
  }, [id, token]);

  /* ================= APPLY ================= */

  const handleApply = async () => {
    try {
      if (!token) {
        alert("You must login first!");
        navigate("/login");
        return;
      }

      if (applied || applying) return;

      setApplying(true);

      const res = await fetch(`${API}/api/applications/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId: id }),
      });

      const contentType = res.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error("Invalid response from server");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to apply");
      }

      setApplied(true);
      setToast(data.message || "Applied successfully!");

      setTimeout(() => {
        navigate("/applied-jobs");
      }, 1000);
    } catch (err) {
      alert(err.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  /* ================= SAVE JOB ================= */

  const handleSaveJob = async (e, targetJob) => {
    if (e) e.stopPropagation();

    try {
      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      if (!targetJob?._id) {
        alert("Invalid job");
        return;
      }

      setSaving(true);

      const res = await fetch(`${API}/api/saved-jobs/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: targetJob._id,
        }),
      });

      const contentType = res.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error("Invalid response from server");
      }

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "Job already saved") {
          if (targetJob._id === id) setSaved(true);
          setToast("Job already saved");
          return;
        }
        throw new Error(data.message || "Failed to save");
      }

      if (targetJob._id === id) setSaved(true);
      setToast(data.message || "Job saved successfully");
    } catch (error) {
      alert(error.message || "Unable to save job");
    } finally {
      setSaving(false);
    }
  };

  /* ================= DERIVED ================= */

  const companyRating = useMemo(() => {
    if (!job) return 0;
    return job.companyRating ?? job.rating ?? 3.9;
  }, [job]);

  const companyReviews = useMemo(() => {
    if (!job) return 0;
    return job.reviewCount ?? job.reviews ?? 2338;
  }, [job]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-40 rounded-xl bg-slate-800" />
            <div className="rounded-3xl border border-slate-800 bg-[#0f172a] p-8">
              <div className="mb-6 h-10 w-2/3 rounded-lg bg-slate-800" />
              <div className="mb-4 h-6 w-1/3 rounded-lg bg-slate-800" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-20 rounded-2xl bg-slate-800" />
                <div className="h-20 rounded-2xl bg-slate-800" />
                <div className="h-20 rounded-2xl bg-slate-800" />
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-[#0f172a] p-8">
              <div className="mb-4 h-8 w-1/4 rounded-lg bg-slate-800" />
              <div className="space-y-3">
                <div className="h-4 rounded bg-slate-800" />
                <div className="h-4 rounded bg-slate-800" />
                <div className="h-4 w-4/5 rounded bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-900/40 bg-red-950/30 p-8 text-center">
          <h2 className="text-2xl font-bold text-red-300">Failed to load job</h2>
          <p className="mt-3 text-slate-300">{error}</p>
          <button
            onClick={() => navigate("/jobseeker/dashboard")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#020617] px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-[#0f172a] p-8 text-center">
          <h2 className="text-2xl font-bold">No job found</h2>
          <button
            onClick={() => navigate("/jobseeker/dashboard")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <motion.div
        className="mx-auto max-w-7xl px-4 py-8 md:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-2xl"
            >
              ✅ {toast}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/jobseeker/dashboard")}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-[#0f172a] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-500 hover:text-cyan-300"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <button
            onClick={(e) => handleSaveJob(e, job)}
            disabled={saving}
            className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
              saved
                ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                : "border-slate-700 bg-[#0f172a] text-slate-200 hover:border-cyan-500 hover:text-cyan-300"
            }`}
          >
            <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved" : saving ? "Saving..." : "Save Job"}
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[30px] border border-slate-800 bg-[#0f172a]/95 p-6 shadow-lg md:p-8"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
                    {job.title}
                  </h1>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-300">
                    <span className="inline-flex items-center gap-2 font-medium text-slate-100">
                      <Building2 size={16} className="text-cyan-400" />
                      {job.companyName || job.consultancyName || "Company"}
                    </span>

                    <span className="inline-flex items-center gap-1 text-amber-400">
                      <Star size={15} fill="currentColor" />
                      <span className="text-slate-200">{companyRating}</span>
                    </span>

                    <span className="text-slate-400">{companyReviews} Reviews</span>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <InfoPill
                      icon={<Briefcase size={16} />}
                      label="Experience"
                      value={formatExperience(job.minExp, job.maxExp)}
                    />
                    <InfoPill
                      icon={<IndianRupee size={16} />}
                      label="Salary"
                      value={formatSalary(job.minSalary, job.maxSalary)}
                    />
                    <InfoPill
                      icon={<MapPin size={16} />}
                      label="Location"
                      value={job.location || "Not specified"}
                    />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Tag text={job.workMode || "Walk-in"} tone="orange" />
                    <Tag text={formatPostedDate(job.createdAt)} tone="slate" />
                    <Tag text={job.companyType || "Company"} tone="blue" />
                  </div>

                  <div className="mt-7 flex flex-wrap gap-4">
                    {applied ? (
                      <button
                        disabled
                        className="rounded-2xl border border-emerald-700 bg-emerald-500/10 px-6 py-3 font-semibold text-emerald-300"
                      >
                        Already Applied
                      </button>
                    ) : (
                      <button
                        onClick={handleApply}
                        disabled={applying}
                        className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
                      >
                        {applying ? "Applying..." : "Apply Now"}
                      </button>
                    )}

                    <button
                      onClick={() => navigate("/jobseeker/dashboard")}
                      className="rounded-2xl border border-slate-700 bg-slate-900/60 px-6 py-3 font-semibold text-slate-200 transition hover:border-cyan-500 hover:text-cyan-300"
                    >
                      Browse More Jobs
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-slate-700 bg-slate-900">
                    <img
                      src={getLogo(job.companyLogo)}
                      alt="Company logo"
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
              className="rounded-[30px] border border-slate-800 bg-[#0f172a]/95 p-6 shadow-lg md:p-8"
            >
              <SectionTitle title="Job Description" />
              <p className="whitespace-pre-line text-[15px] leading-8 text-slate-300">
                {stripHtml(job.jobDescription) || "No description available."}
              </p>

              {job.responsibilities?.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-3 text-lg font-semibold text-white">Responsibilities</h3>
                  <ul className="space-y-2 text-slate-300">
                    {job.responsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <BadgeCheck size={18} className="mt-0.5 shrink-0 text-cyan-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.skills?.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-3 text-lg font-semibold text-white">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full border border-cyan-800 bg-cyan-500/10 px-3 py-1.5 text-sm font-medium text-cyan-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="rounded-[30px] border border-slate-800 bg-[#0f172a]/95 p-6 shadow-lg md:p-8"
            >
              <SectionTitle title="Job Details" />
              <div className="grid gap-4 md:grid-cols-2">
                <DetailCard icon={<Clock3 size={18} />} label="Work Mode" value={job.workMode} />
                <DetailCard icon={<Layers3 size={18} />} label="Department" value={job.department} />
                <DetailCard
                  icon={<Briefcase size={18} />}
                  label="Role Category"
                  value={job.roleCategory}
                />
                <DetailCard
                  icon={<GraduationCap size={18} />}
                  label="Education"
                  value={job.education}
                />
                <DetailCard
                  icon={<Building2 size={18} />}
                  label="Industry"
                  value={job.industry}
                />
                <DetailCard
                  icon={<Building2 size={18} />}
                  label="Company Type"
                  value={job.companyType}
                />
                <DetailCard
                  icon={<Mail size={18} />}
                  label="Contact Email"
                  value={job.contactEmail}
                />
                <DetailCard
                  icon={<CalendarDays size={18} />}
                  label="Apply Before"
                  value={job.applyBefore ? formatDate(job.applyBefore) : "N/A"}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="rounded-[30px] border border-slate-800 bg-[#0f172a]/95 p-6 shadow-lg md:p-8"
            >
              <SectionTitle title="About Company" />
              <p className="text-[15px] leading-8 text-slate-300">
                {job.companyDescription || "Company description not available."}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="rounded-[30px] border border-slate-800 bg-[#0f172a]/95 p-6 shadow-lg md:p-8"
            >
              <SectionTitle title="Similar Jobs" />

              {similarLoading ? (
                <p className="text-slate-400">Loading similar jobs...</p>
              ) : similarJobs.length === 0 ? (
                <p className="text-slate-400">No similar jobs found</p>
              ) : (
                <div className="space-y-4">
                  {similarJobs.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => navigate(`/find-job/${item._id}`)}
                      className="cursor-pointer rounded-3xl border border-slate-800 bg-slate-950/60 p-5 transition hover:border-cyan-500/50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl font-semibold text-cyan-300">{item.title}</h3>
                          <p className="mt-1 text-sm text-slate-300">
                            {item.companyName || item.consultancyName || "Company"}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-5 text-sm text-slate-400">
                            <span>🧳 {formatExperience(item.minExp, item.maxExp)}</span>
                            <span>📍 {item.location || "Not specified"}</span>
                            <span>💰 {formatSalary(item.minSalary, item.maxSalary)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
                            <img
                              src={getLogo(item.companyLogo)}
                              alt="logo"
                              className="h-10 w-10 object-contain"
                            />
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveJob(e, item);
                            }}
                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300"
                          >
                            <Bookmark size={16} />
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[30px] border border-slate-800 bg-[#0f172a]/95 p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-white">Quick Summary</h3>
              <div className="mt-5 space-y-4">
                <QuickRow label="Company" value={job.companyName || job.consultancyName} />
                <QuickRow label="Location" value={job.location} />
                <QuickRow label="Salary" value={formatSalary(job.minSalary, job.maxSalary)} />
                <QuickRow label="Experience" value={formatExperience(job.minExp, job.maxExp)} />
                <QuickRow label="Work Mode" value={job.workMode || "N/A"} />
                <QuickRow label="Industry" value={job.industry || "N/A"} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[30px] border border-slate-800 bg-[#0f172a]/95 p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-white">Actions</h3>
              <div className="mt-5 flex flex-col gap-3">
                <button
                  onClick={applied ? () => navigate("/applied-jobs") : handleApply}
                  disabled={applying}
                  className="rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {applied ? "View Applied Jobs" : applying ? "Applying..." : "Apply Now"}
                </button>

                <button
                  onClick={(e) => handleSaveJob(e, job)}
                  disabled={saving}
                  className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 font-semibold text-slate-200 transition hover:border-cyan-500 hover:text-cyan-300"
                >
                  {saved ? "Saved" : saving ? "Saving..." : "Save Job"}
                </button>

                <button
                  onClick={() => navigate("/saved-jobs")}
                  className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 font-semibold text-slate-200 transition hover:border-cyan-500 hover:text-cyan-300"
                >
                  View Saved Jobs
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const SectionTitle = ({ title }) => {
  return <h2 className="mb-5 text-2xl font-bold text-white">{title}</h2>;
};

const InfoPill = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="flex items-center gap-2 text-cyan-300">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
};

const Tag = ({ text, tone = "slate" }) => {
  const styles = {
    orange: "bg-orange-500/10 text-orange-300",
    blue: "bg-cyan-500/10 text-cyan-300",
    slate: "bg-slate-800 text-slate-300",
  };

  return (
    <span className={`rounded-full px-3 py-1.5 text-sm font-medium ${styles[tone]}`}>
      {text}
    </span>
  );
};

const DetailCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="flex items-center gap-2 text-cyan-300">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-2 text-sm text-slate-300">{value || "N/A"}</p>
    </div>
  );
};

const QuickRow = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3 text-sm last:border-b-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-medium text-white">{value || "N/A"}</span>
    </div>
  );
};

export default JobDetails;