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
} from "lucide-react";

const API = "http://localhost:5000";

const ApplicationViewer = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/recruiter/login");
        return;
      }

      /* FETCH JOB DETAILS */

      const jobRes = await fetch(`${API}/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!jobRes.ok) throw new Error("Failed to fetch job");

      const jobData = await jobRes.json();
      setJob(jobData);

      /* FETCH APPLICANTS */

      const res = await fetch(
        `${API}/api/applications/job/${jobId}/applicants`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to fetch applicants");

      const data = await res.json();

      if (Array.isArray(data)) {
        const mapped = data.map((app) => app.applicant || {});
        setApplicants(mapped);
      } else {
        setApplicants([]);
      }
    } catch (err) {
      console.error("Applicants fetch error:", err);
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  /* ================= LOADING ================= */

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-8 py-6 text-lg font-semibold border shadow-xl rounded-2xl bg-black/50 backdrop-blur-xl border-slate-700 text-cyan-400"
        >
          Loading Applicants...
        </motion.div>
      </div>
    );

  /* ================= UI ================= */

  return (
    <div className="min-h-screen px-6 py-10 text-white bg-slate-950">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}

        <div className="flex flex-col gap-4 mb-10 md:flex-row md:items-center md:justify-between">
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
            className="flex items-center gap-2 px-5 py-3 font-semibold transition bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            <ArrowLeft size={18} />
            Recruiter Dashboard
          </button>
        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 gap-4 mb-10 md:grid-cols-3">
          <StatCard title="Total Applicants" value={applicants.length} />
          <StatCard title="Job Title" value={job?.title || "-"} />
          <StatCard title="Company" value={job?.companyName || "-"} />
        </div>

        {/* APPLICANTS */}

        {applicants.length === 0 ? (
          <div className="p-10 text-center border shadow-xl rounded-3xl bg-black/50 backdrop-blur-xl border-slate-800">
            <h2 className="text-2xl font-bold">No Applicants Yet</h2>
            <p className="mt-2 text-gray-400">
              Once candidates apply, they will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {applicants.map((applicant) => (
              <motion.div
                key={applicant._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="p-6 border shadow-xl rounded-3xl bg-black/50 backdrop-blur-xl border-slate-800"
              >
                {/* NAME */}

                <div className="flex items-center gap-3 mb-3">
                  <User className="text-cyan-400" />
                  <h2 className="text-xl font-semibold">
                    {applicant.fullName || "No Name"}
                  </h2>
                </div>

                {/* EMAIL */}

                <div className="flex items-center gap-2 text-gray-300">
                  <Mail size={16} />
                  {applicant.email || "No Email"}
                </div>

                {/* MOBILE */}

                <div className="flex items-center gap-2 mt-2 text-gray-300">
                  <Phone size={16} />
                  {applicant.mobile || "N/A"}
                </div>

                {/* CITY */}

                <div className="flex items-center gap-2 mt-2 text-gray-300">
                  <MapPin size={16} />
                  {applicant.city || "N/A"}
                </div>

                {/* SKILLS */}

                {applicant.skills && applicant.skills.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-semibold text-cyan-400">
                      Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {applicant.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm text-black rounded-full bg-cyan-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* RESUME */}

                {applicant.resume && (
                  <a
                    href={`${API}/${applicant.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 mt-5 font-semibold transition bg-blue-600 rounded-lg hover:bg-blue-700 w-fit"
                  >
                    <FileText size={16} />
                    View Resume
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value }) => {
  return (
    <div className="p-6 border shadow-lg rounded-2xl bg-black/40 backdrop-blur-xl border-slate-800">
      <p className="text-sm text-gray-400">{title}</p>
      <h3 className="mt-2 text-xl font-bold">{value}</h3>
    </div>
  );
};

export default ApplicationViewer;