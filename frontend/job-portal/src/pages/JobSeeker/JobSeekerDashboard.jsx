import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const JobSeekerDashboard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs/all")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch jobs");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          setJobs([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setJobs([]);
      });
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Full Screen Animated Background */}
      <div className="absolute inset-0 -z-10">
        <AnimatedBackground />
      </div>

      <div className="relative z-10 min-h-screen p-10 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-10 text-center"
        >
          Available Jobs
        </motion.h1>

        {jobs.length === 0 && (
          <p className="text-gray-400 text-center mt-10">
            No jobs available right now.
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {jobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.05 }}
              className="bg-black/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-800 hover:border-green-500 transition"
            >
              <h2 className="text-xl font-semibold mb-2">
                {job.title}
              </h2>

              <p className="text-gray-400 mb-2">
                {job.companyName || job.consultancyName}
              </p>

              <p className="text-sm">
                <strong>Experience:</strong> {job.minExp} - {job.maxExp} yrs
              </p>

              <p className="text-sm">
                <strong>Salary:</strong> ₹{job.minSalary} - ₹{job.maxSalary}
              </p>

              <div className="flex gap-2 flex-wrap mt-3">
                {job.skills?.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-blue-600 px-2 py-1 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <button className="mt-5 w-full px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition font-semibold">
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
