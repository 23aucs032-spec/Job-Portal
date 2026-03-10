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
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const API = "http://localhost:5000";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const hasFetchedRef = useRef(false);

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
        error?.response?.data?.message || error?.message || "Failed to fetch jobs";

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
    fetchJobs();
  }, []);

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
        error?.response?.data?.message || error?.message || "Failed to delete job";

      if (status === 401) {
        handleUnauthorized();
        return;
      }

      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const totalSkills = jobs.reduce((sum, job) => sum + (job.skills?.length || 0), 0);
    const totalPerks = jobs.reduce((sum, job) => sum + (job.perks?.length || 0), 0);

    return { totalJobs, totalSkills, totalPerks };
  }, [jobs]);

  const formatSalary = (min, max) => {
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

  return (
    <>
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen px-4 py-8 text-white md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">Manage Jobs</h1>
              <p className="mt-2 text-slate-300">
                View, edit, and manage all jobs posted by your company.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/post-job")}
                className="px-5 py-3 font-semibold text-black transition rounded-2xl bg-cyan-400 hover:bg-cyan-300"
              >
                + Post New Job
              </button>

              <button
                onClick={() => navigate("/recruiter/dashboard")}
                className="px-5 py-3 transition border rounded-2xl border-white/15 bg-white/10 hover:bg-white/20"
              >
                ← Recruiter Dashboard
              </button>
            </div>
          </motion.div>

          {/* Error */}
          {!loading && errorMessage && (
            <div className="p-4 mb-6 border rounded-2xl bg-red-500/10 border-red-400/20 text-red-200">
              <div className="flex items-center justify-between gap-4">
                <span>{errorMessage}</span>
                <button
                  onClick={fetchJobs}
                  className="px-4 py-2 text-sm transition rounded-xl bg-white/10 hover:bg-white/20"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Top Stats */}
          {!loading && !errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3"
            >
              <StatCard
                title="Total Jobs"
                value={stats.totalJobs}
                icon={<FaBriefcase />}
              />
              <StatCard
                title="Total Skills Tagged"
                value={stats.totalSkills}
                icon={<FaInfoCircle />}
              />
              <StatCard
                title="Total Perks Added"
                value={stats.totalPerks}
                icon={<FaMoneyBillWave />}
              />
            </motion.div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="px-8 py-6 text-lg border shadow-2xl rounded-3xl bg-black/50 border-white/10 backdrop-blur-xl">
                Loading jobs...
              </div>
            </div>
          )}

          {/* Jobs Grid */}
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
                    className="relative overflow-hidden border shadow-2xl rounded-3xl border-white/10 bg-black/55 backdrop-blur-2xl"
                  >
                    <div className="p-6 md:p-7">
                      {/* Top row */}
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

                      {/* Info boxes */}
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

                      {/* Extra details */}
                      <div className="grid grid-cols-1 gap-4 mt-5 sm:grid-cols-2">
                        <DetailRow label="Work Mode" value={job.workMode || "-"} />
                        <DetailRow label="Department" value={job.department || "-"} />
                        <DetailRow label="Industry" value={job.industry || "-"} />
                        <DetailRow label="Education" value={job.education || "-"} />
                      </div>

                      {/* Description preview */}
                      <div className="p-4 mt-5 border rounded-2xl border-white/10 bg-white/5">
                        <p className="mb-2 text-sm font-semibold text-cyan-300">
                          Job Description
                        </p>
                        <p className="text-sm leading-6 text-slate-300 line-clamp-3">
                          {stripHtml(job.jobDescription) || "No description available."}
                        </p>
                      </div>

                      {/* Skills */}
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

                      {/* Perks */}
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

                    <div className="h-1 bg-linear-to-r from-cyan-400 to-teal-400" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !errorMessage && jobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl p-10 mx-auto text-center border shadow-2xl rounded-3xl border-white/10 bg-black/55 backdrop-blur-2xl"
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

        {/* Details Modal */}
        <AnimatePresence>
          {selectedJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 18 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 18 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0B1220]/95 p-6 text-white shadow-2xl"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">
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
                    className="px-4 py-2 transition rounded-xl bg-white/10 hover:bg-white/20"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                  <ModalInfo label="Location" value={selectedJob.location} />
                  <ModalInfo label="Work Mode" value={selectedJob.workMode} />
                  <ModalInfo
                    label="Experience"
                    value={formatExperience(selectedJob.minExp, selectedJob.maxExp)}
                  />
                  <ModalInfo
                    label="Salary"
                    value={formatSalary(selectedJob.minSalary, selectedJob.maxSalary)}
                  />
                  <ModalInfo label="Department" value={selectedJob.department} />
                  <ModalInfo label="Company Type" value={selectedJob.companyType} />
                  <ModalInfo label="Role Category" value={selectedJob.roleCategory} />
                  <ModalInfo label="Industry" value={selectedJob.industry} />
                  <ModalInfo label="Education" value={selectedJob.education} />
                  <ModalInfo
                    label="Apply Before"
                    value={formatDate(selectedJob.applyBefore)}
                  />
                  <ModalInfo label="Contact Email" value={selectedJob.contactEmail} />
                  <ModalInfo label="Hiring For" value={selectedJob.hiringFor} />
                </div>

                <SectionBlock title="Skills">
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills?.length > 0 ? (
                      selectedJob.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm font-medium text-black rounded-full bg-cyan-400"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-slate-400">No skills added</p>
                    )}
                  </div>
                </SectionBlock>

                <SectionBlock title="Perks & Benefits">
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.perks?.length > 0 ? (
                      selectedJob.perks.map((perk, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm font-medium text-black rounded-full bg-emerald-400"
                        >
                          {perk}
                        </span>
                      ))
                    ) : (
                      <p className="text-slate-400">No perks added</p>
                    )}
                  </div>
                </SectionBlock>

                <SectionBlock title="Responsibilities">
                  {selectedJob.responsibilities?.length > 0 ? (
                    <ul className="pl-5 space-y-2 list-disc text-slate-300">
                      {selectedJob.responsibilities.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400">No responsibilities added</p>
                  )}
                </SectionBlock>

                <SectionBlock title="Job Description">
                  <div className="leading-7 text-slate-300">
                    {selectedJob.jobDescription ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedJob.jobDescription,
                        }}
                      />
                    ) : (
                      <p>No description available</p>
                    )}
                  </div>
                </SectionBlock>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="p-5 border shadow-2xl rounded-3xl border-white/10 bg-black/55 backdrop-blur-2xl">
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
      <span className="text-sm font-medium text-right text-white">{value || "-"}</span>
    </div>
  );
};

const ModalInfo = ({ label, value }) => {
  return (
    <div className="p-4 border rounded-2xl border-white/10 bg-white/5">
      <p className="mb-1 text-sm text-slate-400">{label}</p>
      <p className="font-medium text-white">{value || "-"}</p>
    </div>
  );
};

const SectionBlock = ({ title, children }) => {
  return (
    <div className="p-5 mt-5 border rounded-2xl border-white/10 bg-white/5">
      <h3 className="mb-3 text-lg font-semibold text-cyan-300">{title}</h3>
      {children}
    </div>
  );
};

const stripHtml = (html) => {
  if (!html) return "";
  return String(html).replace(/<[^>]+>/g, "");
};

export default ManageJobs;