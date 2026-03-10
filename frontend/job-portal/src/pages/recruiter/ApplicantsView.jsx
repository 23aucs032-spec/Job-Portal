/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Briefcase,
  ArrowLeft,
  GraduationCap,
  Clock3,
} from "lucide-react";

const API = "http://localhost:5000";
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const ApplicationViewer = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/recruiter/login");
        return;
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl border border-slate-700 bg-black/50 px-8 py-6 text-lg font-semibold text-cyan-400 shadow-xl backdrop-blur-xl"
        >
          Loading Applicants...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Applications</h1>
            {job && (
              <p className="mt-2 text-cyan-400">
                Job: {job.title || "Untitled Job"}
              </p>
            )}
          </div>

          <button
            onClick={() => navigate("/recruiter/dashboard")}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Recruiter Dashboard
          </button>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard title="Total Applicants" value={applications.length} />
          <StatCard title="Job Title" value={job?.title || "-"} />
          <StatCard title="Company" value={job?.companyName || "-"} />
        </div>

        {applications.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-black/50 p-10 text-center shadow-xl backdrop-blur-xl">
            <h2 className="text-2xl font-bold">No Applicants Yet</h2>
            <p className="mt-2 text-gray-400">
              Once candidates apply, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {applications.map((application) => {
              const applicant = application.applicant || {};

              return (
                <motion.div
                  key={application._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-3xl border border-slate-800 bg-black/50 p-6 shadow-xl backdrop-blur-xl"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <img
                      src={applicant.profilePic || DEFAULT_AVATAR}
                      alt="Applicant"
                      className="h-16 w-16 rounded-full border border-slate-700 object-cover"
                      onError={(e) => {
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />

                    <div>
                      <h2 className="text-xl font-semibold">
                        {applicant.fullName || applicant.name || "No Name"}
                      </h2>
                      <p className="text-sm text-cyan-400">
                        {application.status || "Applied"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      {applicant.email || "No Email"}
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      {applicant.mobile || applicant.phone || "N/A"}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      {applicant.city || "N/A"}
                    </div>

                    <div className="flex items-center gap-2">
                      <GraduationCap size={16} />
                      {applicant.education || "N/A"}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3 size={16} />
                      {applicant.experience || "N/A"}
                    </div>
                  </div>

                  {Array.isArray(applicant.skills) && applicant.skills.length > 0 && (
                    <div className="mt-5">
                      <p className="mb-2 text-sm font-semibold text-cyan-400">
                        Skills
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {applicant.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-cyan-400 px-3 py-1 text-sm text-black"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {applicant.resume && (
                    <a
                      href={`${API}/${applicant.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold transition hover:bg-blue-700"
                    >
                      <FileText size={16} />
                      View Resume
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-black/40 p-6 shadow-lg backdrop-blur-xl">
      <p className="text-sm text-gray-400">{title}</p>
      <h3 className="mt-2 text-xl font-bold">{value}</h3>
    </div>
  );
};

export default ApplicationViewer;