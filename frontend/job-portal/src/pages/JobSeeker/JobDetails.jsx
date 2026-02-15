import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false); // New state for success message
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/jobs/job/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleApply = () => {
    // You can also call API here to mark as applied
    setApplied(true);
    setTimeout(() => setApplied(false), 3000); // Hide after 3 seconds
  };

  if (loading) return <p className="text-white p-10">Loading...</p>;
  if (error) return <p className="text-red-500 p-10">{error}</p>;
  if (!job) return <p className="text-white p-10">No job found</p>;

  return (
    <div className="min-h-screen p-10 bg-black/80 text-white flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl p-8 border border-gray-700 rounded-xl bg-black/70 shadow-lg flex flex-col gap-6"
      >
        <div className="absolute top-6 right-6">
          <button
            onClick={() => navigate("/jobseeker/dashboard")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition"
          >
            Dashboard
          </button>
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
            <p className="text-gray-400 text-lg">{job.companyName}</p>
            <p className="text-gray-400">{job.location}</p>
            <p className="text-gray-500 text-sm mt-1">
              Posted on: {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <img
              src={
                job.companyLogo ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Company Logo"
              className="w-20 h-20 rounded-md object-cover"
            />
            <button className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 mt-2">
              <Bookmark size={20} />
              Save
            </button>
          </div>
        </div>

        {/* JOB STATS */}
        <div className="flex flex-wrap gap-6 mt-4">
          <p>
            <span className="font-semibold">Experience:</span> {job.minExp} - {job.maxExp} yrs
          </p>
          <p>
            <span className="font-semibold">Salary:</span> ₹{job.minSalary} - ₹{job.maxSalary}
          </p>
          <p>
            <span className="font-semibold">Work Mode:</span> {job.workMode}
          </p>
          <p>
            <span className="font-semibold">Department:</span> {job.department}
          </p>
          <p>
            <span className="font-semibold">Role Category:</span> {job.roleCategory}
          </p>
          <p>
            <span className="font-semibold">Education:</span> {job.education}
          </p>
          <p>
            <span className="font-semibold">Industry:</span> {job.industry}
          </p>
          <p>
            <span className="font-semibold">Company Type:</span> {job.companyType}
          </p>
          <p>
            <span className="font-semibold">Job Posting Date:</span>{" "}
            {job.applyBefore ? new Date(job.applyBefore).toLocaleDateString() : "N/A"}
          </p>
          <p>
            <span className="font-semibold">Contact Email:</span> {job.contactEmail}
          </p>
        </div>

        {/* SKILLS */}
        {job.skills && job.skills.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span key={index} className="bg-gray-800 px-3 py-1 rounded text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* JOB DESCRIPTION */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Job Description</h2>
          <p className="text-gray-300 whitespace-pre-line">{job.jobDescription}</p>
        </div>

        {/* RESPONSIBILITIES */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Responsibilities</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {job.responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* APPLY BUTTON */}
        <div className="mt-6 flex flex-col items-start gap-2">
          <button
            onClick={handleApply}
            className="px-6 py-3 bg-green-600 rounded hover:bg-green-700 font-semibold transition"
          >
            Apply Now
          </button>
          {applied && (
            <p className="text-green-400 font-semibold mt-2">
              ✅ Applied successfully!
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default JobDetails;
