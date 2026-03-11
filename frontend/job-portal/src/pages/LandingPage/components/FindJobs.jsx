/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Bookmark,
  MapPin,
  Briefcase,
  IndianRupee,
  Building2,
  Search,
  Filter,
  ArrowRight,
  SlidersHorizontal,
  X,
} from "lucide-react";

const API = "http://localhost:5000";
const JOBS_PER_PAGE = 6;

const FindJobs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  const keyword = params.get("keyword") || "";
  const jobLocation = params.get("location") || "";
  const experience = params.get("experience") || "";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState({
    keyword: keyword,
    location: jobLocation,
    experience: experience,
    workMode: "",
    minSalary: "",
  });

  /* ================= ANIMATION VARIANTS ================= */

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const card = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35 },
    },
  };

  /* ================= LOAD SAVED JOBS ================= */

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    setSavedJobs(stored);
  }, []);

  /* ================= FETCH JOBS ================= */

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setApiError("");

        const res = await axios.get(`${API}/api/jobs/search`, {
          params: {
            keyword,
            location: jobLocation,
            experience,
          },
        });

        setJobs(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error(
          "Job fetch error:",
          error.response?.data || error.message
        );

        setJobs([]);
        setApiError(
          error.response?.data?.message ||
            "Unable to fetch jobs. Please check backend route or server."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [keyword, jobLocation, experience]);

  /* ================= HELPERS ================= */

  const handleJobClick = (id) => {
    if (!id) return;
    navigate(`/find-job/${id}`);
  };

  const formatSalary = (minSalary, maxSalary) => {
    if (!minSalary && !maxSalary) return "Not disclosed";
    if (minSalary && maxSalary) return `${minSalary} - ${maxSalary} LPA`;
    if (minSalary) return `${minSalary} LPA`;
    return `${maxSalary} LPA`;
  };

  const formatExperience = (minExp, maxExp) => {
    if (minExp === undefined && maxExp === undefined) {
      return "Not specified";
    }
    if (minExp && maxExp) return `${minExp} - ${maxExp} years`;
    if (minExp) return `${minExp}+ years`;
    if (maxExp) return `Up to ${maxExp} years`;
    return "Not specified";
  };

  const isJobSaved = (jobId) => savedJobs.some((id) => id === jobId);

  const toggleSaveJob = (e, jobId) => {
    e.stopPropagation();
    if (!jobId) return;

    let updated = [];

    if (isJobSaved(jobId)) {
      updated = savedJobs.filter((id) => id !== jobId);
    } else {
      updated = [...savedJobs, jobId];
    }

    setSavedJobs(updated);
    localStorage.setItem("savedJobs", JSON.stringify(updated));
  };

  const clearFilters = () => {
    setFilters({
      keyword: keyword,
      location: jobLocation,
      experience: experience,
      workMode: "",
      minSalary: "",
    });
    setCurrentPage(1);
  };

  /* ================= FRONTEND FILTERING ================= */

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesKeyword =
        !filters.keyword ||
        job.title?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        job.companyName
          ?.toLowerCase()
          .includes(filters.keyword.toLowerCase()) ||
        job.skills?.some((skill) =>
          skill.toLowerCase().includes(filters.keyword.toLowerCase())
        );

      const matchesLocation =
        !filters.location ||
        job.location?.toLowerCase().includes(filters.location.toLowerCase());

      const matchesExperience =
        !filters.experience ||
        (() => {
          const expNum = Number(filters.experience);
          if (Number.isNaN(expNum)) return true;
          return job.minExp <= expNum && job.maxExp >= expNum;
        })();

      const matchesWorkMode =
        !filters.workMode ||
        job.workMode?.toLowerCase() === filters.workMode.toLowerCase();

      const matchesSalary =
        !filters.minSalary ||
        Number(job.maxSalary || 0) >= Number(filters.minSalary);

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesExperience &&
        matchesWorkMode &&
        matchesSalary
      );
    });
  }, [jobs, filters]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(start, start + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const filterChips = [
    filters.keyword ? `Keyword: ${filters.keyword}` : null,
    filters.location ? `Location: ${filters.location}` : null,
    filters.experience ? `Experience: ${filters.experience}` : null,
    filters.workMode ? `Mode: ${filters.workMode}` : null,
    filters.minSalary ? `Min Salary: ${filters.minSalary} LPA` : null,
  ].filter(Boolean);

  /* ================= SKELETON ================= */

  const SkeletonCard = () => (
    <div className="p-6 border border-white/10 rounded-3xl bg-white/5 animate-pulse">
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="w-16 h-16 bg-gray-700 rounded-2xl" />
          <div className="flex-1">
            <div className="w-40 h-6 mb-3 bg-gray-700 rounded" />
            <div className="w-28 h-4 mb-4 bg-gray-800 rounded" />
            <div className="w-full h-4 mb-2 bg-gray-800 rounded" />
            <div className="w-5/6 h-4 bg-gray-800 rounded" />
            <div className="grid grid-cols-1 gap-3 mt-5 sm:grid-cols-3">
              <div className="h-16 bg-gray-800 rounded-2xl" />
              <div className="h-16 bg-gray-800 rounded-2xl" />
              <div className="h-16 bg-gray-800 rounded-2xl" />
            </div>
          </div>
        </div>
        <div className="w-32 h-10 bg-gray-700 rounded-xl" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* ================= TOP HEADER ================= */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-[#020617]/90 backdrop-blur-md">
        <div className="max-w-7xl px-4 py-5 mx-auto md:px-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-medium text-blue-300 border rounded-full bg-blue-500/10 border-blue-500/20">
                  <Search size={14} />
                  Professional Job Search
                </div>

                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Find Your Dream Job
                </h1>

                <p className="mt-2 text-sm text-slate-400 md:text-base">
                  Search and explore opportunities based on your skills,
                  location, and experience.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="flex items-center gap-2 px-4 py-2 border md:hidden rounded-xl bg-white/5 border-white/10 text-slate-300"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </button>

                <div className="flex items-center gap-3 px-4 py-3 border bg-white/5 border-white/10 rounded-2xl">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Results</p>
                    <h3 className="text-lg font-semibold">
                      {loading ? "Loading..." : `${filteredJobs.length} Jobs`}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {filterChips.length > 0 ? (
                filterChips.map((chip, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-sm border rounded-full bg-blue-500/10 text-blue-300 border-blue-500/20"
                  >
                    {chip}
                  </span>
                ))
              ) : (
                <span className="px-3 py-1.5 text-sm border rounded-full bg-white/5 text-slate-400 border-white/10">
                  No filters applied
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN LAYOUT ================= */}
      <div className="max-w-7xl px-4 py-8 mx-auto md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[280px_1fr]">
          {/* ================= LEFT FILTER SIDEBAR ================= */}
          <aside
            className={`${
              showMobileFilters ? "block" : "hidden"
            } md:block rounded-3xl border border-white/10 bg-[#0f172a] p-5 h-fit sticky top-28`}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Filter size={18} />
                Filters
              </h2>

              <button
                onClick={clearFilters}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Clear
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm text-slate-300">
                  Keyword
                </label>
                <input
                  type="text"
                  value={filters.keyword}
                  onChange={(e) =>
                    setFilters({ ...filters, keyword: e.target.value })
                  }
                  className="w-full px-4 py-3 text-white border outline-none rounded-xl bg-white/5 border-white/10 placeholder:text-slate-500 focus:border-blue-500"
                  placeholder="e.g. React Developer"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-slate-300">
                  Location
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                  className="w-full px-4 py-3 text-white border outline-none rounded-xl bg-white/5 border-white/10 placeholder:text-slate-500 focus:border-blue-500"
                  placeholder="e.g. Chennai"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-slate-300">
                  Experience
                </label>
                <input
                  type="number"
                  value={filters.experience}
                  onChange={(e) =>
                    setFilters({ ...filters, experience: e.target.value })
                  }
                  className="w-full px-4 py-3 text-white border outline-none rounded-xl bg-white/5 border-white/10 placeholder:text-slate-500 focus:border-blue-500"
                  placeholder="e.g. 2"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-slate-300">
                  Work Mode
                </label>
                <select
                  value={filters.workMode}
                  onChange={(e) =>
                    setFilters({ ...filters, workMode: e.target.value })
                  }
                  className="w-full px-4 py-3 text-white border outline-none rounded-xl bg-white/5 border-white/10 focus:border-blue-500"
                >
                  <option value="" className="text-black">
                    All
                  </option>
                  <option value="Remote" className="text-black">
                    Remote
                  </option>
                  <option value="Hybrid" className="text-black">
                    Hybrid
                  </option>
                  <option value="Onsite" className="text-black">
                    Onsite
                  </option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm text-slate-300">
                  Minimum Salary (LPA)
                </label>
                <input
                  type="number"
                  value={filters.minSalary}
                  onChange={(e) =>
                    setFilters({ ...filters, minSalary: e.target.value })
                  }
                  className="w-full px-4 py-3 text-white border outline-none rounded-xl bg-white/5 border-white/10 placeholder:text-slate-500 focus:border-blue-500"
                  placeholder="e.g. 6"
                />
              </div>

              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 font-medium text-white bg-blue-600 md:hidden rounded-xl hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* ================= RIGHT CONTENT ================= */}
          <motion.div variants={container} initial="hidden" animate="show">
            {apiError && (
              <div className="p-4 mb-5 text-sm border rounded-2xl bg-red-500/10 border-red-500/20 text-red-300">
                <p className="font-semibold">Backend Error:</p>
                <p>{apiError}</p>
                <p className="mt-2 text-red-200">
                  Most likely fix: place <code>/search</code> route before{" "}
                  <code>/:id</code> in backend routes.
                </p>
              </div>
            )}

            {loading ? (
              <div className="space-y-5">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="py-20 text-center border rounded-3xl bg-white/5 border-white/10">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-5 rounded-full bg-white/5">
                  <Search className="text-slate-400" size={32} />
                </div>
                <h2 className="text-2xl font-semibold">No jobs found</h2>
                <p className="max-w-xl mx-auto mt-3 text-slate-400">
                  Try changing your keyword, location, or experience filters.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {paginatedJobs.map((job, index) => {
                    const skills = Array.isArray(job.skills) ? job.skills : [];

                    return (
                      <motion.div
                        key={job._id || index}
                        variants={card}
                        whileHover={{ y: -4, scale: 1.01 }}
                        onClick={() => handleJobClick(job._id)}
                        className="group cursor-pointer rounded-3xl border border-white/10 bg-linear-to-br from-[#0f172a] to-[#111827] p-6 shadow-lg transition-all duration-300 hover:border-blue-500/40 hover:shadow-blue-500/10"
                      >
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                          {/* LEFT */}
                          <div className="flex flex-col flex-1 gap-4">
                            <div className="flex items-start gap-4">
                              <img
                                src={
                                  job.companyLogo ||
                                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                }
                                alt={job.companyName || "Company Logo"}
                                className="object-cover w-16 h-16 p-2 bg-white rounded-2xl"
                              />

                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3">
                                  <h2 className="text-xl font-bold text-white transition-colors duration-300 md:text-2xl group-hover:text-blue-400">
                                    {job.title || "Untitled Job"}
                                  </h2>

                                  <span className="px-3 py-1 text-xs font-medium text-green-300 border rounded-full bg-green-500/10 border-green-500/20">
                                    Actively Hiring
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 mt-2 text-slate-300">
                                  <Building2 size={16} />
                                  <p className="font-medium">
                                    {job.companyName || "Unknown Company"}
                                  </p>
                                </div>

                                <p className="mt-2 text-sm leading-6 text-slate-400 line-clamp-2">
                                  {job.jobDescription ||
                                    "No description available for this role."}
                                </p>
                              </div>
                            </div>

                            {/* META */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                              <div className="flex items-center gap-3 p-3 border rounded-2xl bg-white/5 border-white/10">
                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                                  <Briefcase size={18} />
                                </div>
                                <div>
                                  <p className="text-xs text-slate-400">
                                    Experience
                                  </p>
                                  <p className="text-sm font-medium text-white">
                                    {formatExperience(job.minExp, job.maxExp)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 p-3 border rounded-2xl bg-white/5 border-white/10">
                                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                                  <MapPin size={18} />
                                </div>
                                <div>
                                  <p className="text-xs text-slate-400">
                                    Location
                                  </p>
                                  <p className="text-sm font-medium text-white">
                                    {job.location || "Not specified"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 p-3 border rounded-2xl bg-white/5 border-white/10">
                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                                  <IndianRupee size={18} />
                                </div>
                                <div>
                                  <p className="text-xs text-slate-400">
                                    Salary
                                  </p>
                                  <p className="text-sm font-medium text-white">
                                    {formatSalary(
                                      job.minSalary,
                                      job.maxSalary
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* SKILLS */}
                            {skills.length > 0 && (
                              <div>
                                <p className="mb-3 text-sm font-medium text-slate-300">
                                  Required Skills
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {skills.slice(0, 8).map((skill, skillIndex) => (
                                    <span
                                      key={skillIndex}
                                      className="px-3 py-1.5 text-xs font-medium border rounded-full bg-blue-500/10 text-blue-300 border-blue-500/20"
                                    >
                                      {skill}
                                    </span>
                                  ))}

                                  {skills.length > 8 && (
                                    <span className="px-3 py-1.5 text-xs font-medium border rounded-full bg-white/5 text-slate-300 border-white/10">
                                      +{skills.length - 8} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* RIGHT */}
                          <div className="flex flex-row items-center justify-between gap-4 lg:w-45 lg:flex-col lg:items-end">
                            <button
                              onClick={(e) => toggleSaveJob(e, job._id)}
                              className={`flex items-center gap-2 px-4 py-2 text-sm transition border rounded-xl ${
                                isJobSaved(job._id)
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white/5 border-white/10 text-slate-300 hover:border-blue-500/30 hover:text-blue-400"
                              }`}
                            >
                              <Bookmark
                                size={16}
                                fill={isJobSaved(job._id) ? "currentColor" : "none"}
                              />
                              {isJobSaved(job._id) ? "Saved" : "Save"}
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJobClick(job._id);
                              }}
                              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700"
                            >
                              View Details
                              <ArrowRight size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* ================= PAGINATION ================= */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      className="px-4 py-2 border rounded-xl bg-white/5 border-white/10 text-slate-300 disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-xl border ${
                            currentPage === page
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "bg-white/5 border-white/10 text-slate-300"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      className="px-4 py-2 border rounded-xl bg-white/5 border-white/10 text-slate-300 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FindJobs;