import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs posted by this recruiter
  useEffect(() => {
  const fetchMyJobs = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch jobs");

      const data = await res.json();
      setJobs(data); // ← Newly posted job will appear here
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchMyJobs();
}, [navigate]);


  return (
    <>
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen p-10 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-4xl font-bold text-center"
        >
          Recruiter Dashboard
        </motion.h1>

        {/* Top Navigation Cards */}
        <div className="grid gap-8 mb-12 md:grid-cols-3">
          {[
            { title: "Post a Job", path: "/post-job" },
            { title: "Manage Jobs", path: "/manage-jobs" },
            { title: "View Applicants", path: "/applicants" },
          ].map((item, index) => (
            <motion.div
              key={index}
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="p-8 text-center border border-gray-800 shadow-xl cursor-pointer bg-black/70 backdrop-blur-lg rounded-2xl hover:border-cyan-400"
            >
              <h2 className="text-xl font-semibold">{item.title}</h2>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 text-lg text-center"
        >
          Total Jobs Posted:{" "}
          <span className="font-bold text-cyan-400">{jobs.length}</span>
        </motion.div>

        {/* Job List */}
        {loading ? (
          <p className="text-center text-gray-400">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="mt-10 text-center text-gray-400">
            No jobs posted yet. Click "Post a Job" above to add one.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <motion.div
                key={job._id}
                whileHover={{ scale: 1.02 }}
                className="p-6 border border-gray-700 shadow-lg bg-black/60 backdrop-blur-lg rounded-xl"
              >
                <h3 className="mb-1 text-xl font-semibold">{job.title}</h3>
                <p className="mb-2 text-gray-400">
                  {job.companyName || job.consultancyName}
                </p>

                <p className="mb-1">
                  Experience: {job.minExp || 0} - {job.maxExp || 0} yrs
                </p>
                <p className="mb-2">
                  Salary: ₹{job.minSalary || 0} - ₹{job.maxSalary || 0}
                </p>

                <div className="flex flex-wrap gap-2 mb-2">
                  {job.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-sm rounded bg-cyan-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {job.perks?.map((perk, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-sm bg-green-600 rounded"
                    >
                      {perk}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default RecruiterDashboard;
