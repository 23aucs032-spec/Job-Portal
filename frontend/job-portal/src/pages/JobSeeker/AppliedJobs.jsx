/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Eye,
  IndianRupee,
  MapPin,
} from "lucide-react";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const API = "http://localhost:5000";
const DEFAULT_LOGO =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const formatSalary = (min, max) => {
  const minVal = min ?? 0;
  const maxVal = max ?? 0;
  return `₹ ${minVal}-${maxVal} LPA`;
};

const formatExperience = (min, max) => {
  return `${min ?? 0}-${max ?? 0} yrs`;
};

const formatDate = (dateString) => {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Recently";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getLogo = (job) => {
  if (job?.companyLogo?.startsWith("http")) return job.companyLogo;
  if (job?.companyLogo) {
    return `${API}/${job.companyLogo}`.replace(/([^:]\/)\/+/g, "$1");
  }
  return DEFAULT_LOGO;
};

const AppliedJobs = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API}/api/applications/my-applied-jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch applied jobs");
        }

        setAppliedJobs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Applied jobs fetch error:", error);
        setAppliedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [token, navigate]);

  return (
    <div className="relative min-h-screen bg-[#020617] text-white">
      <AnimatedBackground />

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
              <CheckCircle2 size={16} />
              Applied Jobs
            </div>

            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Your Applied Jobs
            </h1>

            <p className="mt-2 text-sm text-slate-400 md:text-base">
              View all jobs you already applied for.
            </p>
          </div>

          <button
            onClick={() => navigate("/jobseeker/dashboard")}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-500 hover:text-cyan-300"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-slate-800 bg-[#0f172a]/95 p-10 text-center">
            <p className="text-slate-400">Loading applied jobs...</p>
          </div>
        ) : appliedJobs.length === 0 ? (
          <div className="rounded-[28px] border border-slate-800 bg-[#0f172a]/95 p-12 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-900">
              <Briefcase size={34} className="text-slate-500" />
            </div>

            <h3 className="text-2xl font-semibold text-white">
              No applied jobs yet
            </h3>

            <p className="mt-3 text-sm text-slate-400">
              Apply for jobs and they will appear here.
            </p>

            <button
              onClick={() => navigate("/jobseeker/dashboard")}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {appliedJobs.map((job, index) => (
              <motion.div
                key={job.applicationId || job._id || index}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -2 }}
                onClick={() => navigate(`/job/${job._id}`)}
                className="cursor-pointer rounded-[28px] border border-slate-800 bg-[#0f172a]/95 p-6 shadow-xl transition hover:border-cyan-500/50 hover:shadow-2xl"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                      <CheckCircle2 size={14} />
                      {job.status || "Applied"}
                    </div>

                    <h2 className="line-clamp-1 text-2xl font-bold text-white md:text-[30px]">
                      {job.title || "Untitled Job"}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-slate-300">
                      <span className="inline-flex items-center gap-2 font-medium text-slate-200">
                        <Building2 size={16} className="text-cyan-400" />
                        {job.companyName || job.consultancyName || "Company"}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-6 text-sm text-slate-400 md:text-base">
                      <span className="inline-flex items-center gap-2">
                        <MapPin size={17} className="text-slate-500" />
                        {job.location || "Location not specified"}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <IndianRupee size={17} className="text-slate-500" />
                        {formatSalary(job.minSalary, job.maxSalary)}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <Briefcase size={17} className="text-slate-500" />
                        {formatExperience(job.minExp, job.maxExp)}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <CalendarDays size={17} className="text-slate-500" />
                        {formatDate(job.appliedAt)}
                      </span>
                    </div>

                    {Array.isArray(job.skills) && job.skills.length > 0 && (
                      <div className="mt-5">
                        <p className="mb-2 text-sm font-semibold text-slate-200">
                          Skills
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 8).map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="rounded-full border border-cyan-800 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row items-center justify-between gap-4 lg:w-45 lg:flex-col lg:items-end">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-slate-700 bg-slate-900">
                      <img
                        src={getLogo(job)}
                        alt="Company Logo"
                        className="h-14 w-14 object-contain"
                        onError={(e) => {
                          e.target.src = DEFAULT_LOGO;
                        }}
                      />
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/job/${job._id}`);
                      }}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-500 hover:text-cyan-300"
                    >
                      <Eye size={16} />
                      View Job
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;