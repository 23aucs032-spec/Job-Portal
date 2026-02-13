import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const jobs = [
  { id: 1, title: "Frontend Developer", company: "Tech Corp" },
  { id: 2, title: "Backend Developer", company: "Innovate LLC" },
  { id: 3, title: "UI/UX Designer", company: "Creative Inc" },
];

export default function JobSeekerDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {jobs.map((job, index) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.15 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-xl font-semibold">{job.title}</h2>
          <p className="mt-2 text-gray-600">{job.company}</p>
          <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Apply Now
          </button>
        </motion.div>
      ))}
    </div>
  );
}
