/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Trash2, Eye, ArrowLeft } from "lucide-react";

const API = "http://localhost:5000";

const SavedJobs = () => {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  /* ================= LOAD SAVED JOBS ================= */
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch(`${API}/api/saved-jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = res.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error(`Invalid response from server: ${text.slice(0, 120)}`);
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch saved jobs");
        }

        const jobs = Array.isArray(data)
          ? data
              .map((item) => item?.job || item?.jobId || null)
              .filter((job) => job && job._id)
          : [];

        setSavedJobs(jobs);
      } catch (error) {
        console.log(error);
        setErrorMessage(error.message || "Unable to load saved jobs");
        setSavedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [navigate]);

  /* ================= REMOVE JOB ================= */
  const removeJob = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${API}/api/saved-jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data?.message || "Failed to remove saved job");
      }

      setSavedJobs((prev) => prev.filter((job) => job?._id !== id));
    } catch (error) {
      console.log(error);
      alert(error.message || "Unable to remove saved job");
    }
  };

  /* ================= HELPERS ================= */
  const getLogo = (logo) => {
    if (!logo) {
      return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    }

    if (logo.startsWith("http")) return logo;

    return `${API}/${logo}`.replace(/([^:]\/)\/+/g, "$1");
  };

  /* ================= ANIMATION VARIANTS ================= */
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const card = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 text-white bg-black md:p-10"
    >
      <div className="max-w-5xl mx-auto">
        {/* TOP BAR */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
          <motion.h2
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-2 text-3xl font-semibold text-center md:text-left"
          >
            <Bookmark size={28} />
            Saved Jobs
          </motion.h2>

          <button
            onClick={() => navigate("/jobseeker/dashboard")}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm transition border rounded-xl border-white/15 bg-white/10 hover:bg-white/20"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-20 text-center">
            <div className="inline-block px-6 py-4 border rounded-2xl border-white/10 bg-white/5">
              Loading saved jobs...
            </div>
          </div>
        )}

        {/* ERROR */}
        {!loading && errorMessage && (
          <div className="p-4 mb-6 border rounded-2xl border-red-500/20 bg-red-500/10 text-red-200">
            {errorMessage}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !errorMessage && savedJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <p className="text-lg text-gray-400">No saved jobs yet</p>

            <button
              onClick={() => navigate("/jobseeker/dashboard")}
              className="px-5 py-2 mt-6 font-medium text-black transition rounded-xl bg-cyan-400 hover:bg-cyan-300"
            >
              Browse Jobs
            </button>
          </motion.div>
        )}

        {/* JOB LIST */}
        {!loading && !errorMessage && savedJobs.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
          >
            <AnimatePresence>
              {savedJobs.map((job) => (
                <motion.div
                  key={job._id}
                  variants={card}
                  whileHover={{
                    scale: 1.02,
                    borderColor: "#3b82f6",
                  }}
                  exit={{ opacity: 0, y: 20 }}
                  className="p-6 border border-gray-700 rounded-xl bg-[#111] shadow-lg transition"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* LEFT SIDE */}
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-blue-400">
                        {job.title || "Untitled Job"}
                      </h3>

                      <p className="text-gray-300">
                        {job.companyName || job.consultancyName || "Company"}
                      </p>

                      <p className="text-sm text-gray-400">
                        📍 {job.location || "Location not specified"}
                      </p>
                    </div>

                    {/* COMPANY LOGO */}
                    <img
                      src={getLogo(job.companyLogo)}
                      className="object-contain p-1 bg-white rounded-lg w-14 h-14"
                      alt="logo"
                    />
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex gap-4 mt-5">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(`/find-job/${job._id}`)}
                      className="flex items-center gap-2 px-4 py-1 bg-blue-600 rounded"
                    >
                      <Eye size={16} />
                      View
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeJob(job._id)}
                      className="flex items-center gap-2 px-4 py-1 bg-red-600 rounded"
                    >
                      <Trash2 size={16} />
                      Remove
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SavedJobs;