import React, { useState, useEffect } from "react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const API_URL = "http://localhost:5000/api/jobs";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(response.data || []); // Safety fallback
    } catch (error) {
      console.error("Fetch Jobs Error:", error);
      setJobs([]); // fallback to empty array
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (window.confirm("Are you sure you want to delete this job?")) {
        await axios.delete(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJobs(jobs.filter((job) => job._id !== id));
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  return (
    <>
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Manage Jobs</h1>
          <button
            onClick={() => navigate("/recruiter/dashboard")}
            className="px-4 py-2 transition bg-blue-600 rounded-lg hover:bg-blue-500"
          >
            Recruiter Dashboard
          </button>
        </div>

        <div className="flex flex-col max-w-3xl gap-6 mx-auto">
          <AnimatePresence>
            {jobs.map((job) => (
              <motion.div
                key={job._id}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="relative p-6 border border-gray-700 shadow-lg bg-black/60 backdrop-blur-lg rounded-xl"
              >
                <h3 className="mb-1 text-xl font-semibold">{job.title}</h3>
                <p className="mb-2 text-gray-400">{job.companyName}</p>

                <p className="mt-1 text-sm">
                  <strong>Experience:</strong> {job.minExp || 0} - {job.maxExp || 0} yrs
                </p>
                <p className="text-sm">
                  <strong>Salary:</strong> ₹{job.minSalary || 0} - ₹{job.maxSalary || 0}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {job.skills?.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-1 text-sm bg-blue-600 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {job.perks?.map((p) => (
                    <span
                      key={p}
                      className="px-2 py-1 text-sm bg-green-600 rounded"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="absolute flex gap-2 top-4 right-4">
                  <button onClick={() => setSelectedJob(job)} title="Details">
                    <FaInfoCircle className="text-blue-400 transition hover:text-blue-500" />
                  </button>

                  <button
                    onClick={() => navigate(`/edit-job/${job._id}`)}
                    title="Edit"
                  >
                    <FaEdit className="text-green-400 transition hover:text-green-500" />
                  </button>

                  <button onClick={() => handleDelete(job._id)} title="Delete">
                    <FaTrash className="text-red-400 transition hover:text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {jobs.length === 0 && (
          <p className="mt-10 text-center text-gray-400">
            No jobs posted yet.
          </p>
        )}

        {/* Details Modal */}
        <AnimatePresence>
          {selectedJob && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-70"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="w-full max-w-md p-6 text-white border border-gray-600 rounded-lg shadow-lg bg-black/80"
              >
                <h2 className="mb-2 text-xl font-bold">{selectedJob.title}</h2>
                <p>
                  <strong>Company:</strong> {selectedJob.companyName}
                </p>
                <p>
                  <strong>Experience:</strong> {selectedJob.minExp || 0} - {selectedJob.maxExp || 0}
                </p>
                <p>
                  <strong>Salary:</strong> ₹{selectedJob.minSalary || 0} - ₹{selectedJob.maxSalary || 0}
                </p>
                <p>
                  <strong>Skills:</strong> {selectedJob.skills?.join(", ")}
                </p>
                <p>
                  <strong>Perks:</strong> {selectedJob.perks?.join(", ")}
                </p>

                <button
                  className="px-4 py-2 mt-3 transition bg-gray-700 rounded hover:bg-gray-600"
                  onClick={() => setSelectedJob(null)}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ManageJobs;
