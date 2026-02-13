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

      setJobs(response.data);
    } catch (error) {
      console.error("Fetch Jobs Error:", error);
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
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Jobs</h1>

          <button
            onClick={() => navigate("/recruiter/dashboard")}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
          >
            Recruiter Dashboard
          </button>
        </div>

        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          <AnimatePresence>
            {jobs.map((job) => (
              <motion.div
                key={job._id}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-black/60 backdrop-blur-lg p-6 rounded-xl border border-gray-700 shadow-lg relative"
              >
                <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                <p className="text-gray-400 mb-2">{job.companyName}</p>

                <p className="mt-1 text-sm">
                  <strong>Experience:</strong> {job.minExp} - {job.maxExp} yrs
                </p>
                <p className="text-sm">
                  <strong>Salary:</strong> ₹{job.minSalary} - ₹{job.maxSalary}
                </p>

                <div className="flex gap-2 flex-wrap mt-3">
                  {job.skills.map((s) => (
                    <span
                      key={s}
                      className="bg-blue-600 px-2 py-1 rounded text-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 flex-wrap mt-2">
                  {job.perks.map((p) => (
                    <span
                      key={p}
                      className="bg-green-600 px-2 py-1 rounded text-sm"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setSelectedJob(job)}
                    title="Details"
                  >
                    <FaInfoCircle className="text-blue-400 hover:text-blue-500 transition" />
                  </button>

                  {/* ✅ EDIT NOW NAVIGATES TO EditJob PAGE */}
                  <button
                    onClick={() => navigate(`/edit-job/${job._id}`)}
                    title="Edit"
                  >
                    <FaEdit className="text-green-400 hover:text-green-500 transition" />
                  </button>

                  <button
                    onClick={() => handleDelete(job._id)}
                    title="Delete"
                  >
                    <FaTrash className="text-red-400 hover:text-red-500 transition" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {jobs.length === 0 && (
          <p className="text-gray-400 mt-10 text-center">
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
              className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-black/80 p-6 rounded-lg max-w-md w-full text-white border border-gray-600 shadow-lg"
              >
                <h2 className="text-xl font-bold mb-2">
                  {selectedJob.title}
                </h2>
                <p>
                  <strong>Company:</strong> {selectedJob.companyName}
                </p>
                <p>
                  <strong>Experience:</strong> {selectedJob.minExp} - {selectedJob.maxExp}
                </p>
                <p>
                  <strong>Salary:</strong> ₹{selectedJob.minSalary} - ₹{selectedJob.maxSalary}
                </p>
                <p>
                  <strong>Skills:</strong> {selectedJob.skills.join(", ")}
                </p>
                <p>
                  <strong>Perks:</strong> {selectedJob.perks.join(", ")}
                </p>

                <button
                  className="px-4 py-2 bg-gray-700 rounded mt-3 hover:bg-gray-600 transition"
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
