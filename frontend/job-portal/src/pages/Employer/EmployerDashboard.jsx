import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const jobs = [
  { id: 1, title: "Frontend Developer", applicants: 12 },
  { id: 2, title: "Backend Developer", applicants: 8 },
  { id: 3, title: "UI/UX Designer", applicants: 5 },
];

export default function EmployerDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {jobs.map((job, index) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-xl font-semibold">{job.title}</h2>
          <p className="mt-2 text-gray-600">
            Applicants: <span className="font-bold">{job.applicants}</span>
          </p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            View Applicants
          </button>
        </motion.div>
      ))}
    </div>
  );
}
