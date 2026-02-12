import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  return (
    <>
      <AnimatedBackground />

      <div className="min-h-screen p-10 text-white relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-10"
        >
          Company Dashboard
        </motion.h1>

        {/* Top cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
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
              className="bg-black/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-800 cursor-pointer hover:border-blue-500"
            >
              <h2 className="text-xl font-semibold">{item.title}</h2>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 text-lg"
        >
          Total Jobs Posted:{" "}
          <span className="text-blue-400 font-bold">
            {jobs.length}
          </span>
        </motion.div>

        {/* Job List */}
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <motion.div
              key={job._id}
              whileHover={{ scale: 1.02 }}
              className="bg-black/60 backdrop-blur-lg p-6 rounded-xl border border-gray-700 shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-1">
                {job.title}
              </h3>

              <p className="text-gray-400">
                {job.companyName || job.consultancyName}
              </p>

              <p className="mt-2">
                Experience: {job.minExp} - {job.maxExp} yrs
              </p>

              <p>
                Salary: ₹{job.minSalary} - ₹{job.maxSalary}
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
            </motion.div>
          ))}
        </div>

        {jobs.length === 0 && (
          <p className="text-gray-400 mt-10">
            No jobs posted yet.
          </p>
        )}
      </div>
    </>
  );
};

export default RecruiterDashboard;
