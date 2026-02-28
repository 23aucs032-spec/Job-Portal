import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recruiter, setRecruiter] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user) {
        navigate("/login");
        return;
      }

      setRecruiter(user);

      try {
        const res = await fetch(
          `http://localhost:5000/api/jobs/recruiter/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error(err);
        alert("Error fetching jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <AnimatedBackground />

      <div className="relative z-10 min-h-screen p-10 text-white">

        {/* Top Right Profile */}
        <div className="absolute top-6 right-10" ref={dropdownRef}>
          <motion.div
            className="flex items-center gap-2 cursor-pointer bg-black/60 backdrop-blur-lg px-4 py-2 rounded-full border border-gray-700"
            onClick={() => setDropdownOpen((prev) => !prev)}
            whileHover={{ scale: 1.05 }}
          >
            {/* Company Logo */}
            <img
              src={recruiter.logo || "/default-logo.png"}
              alt="Company Logo"
              className="w-10 h-10 rounded-full object-cover border border-gray-500"
            />
            {/* Company / Recruiter Name */}
            <span className="font-semibold">{recruiter.name || recruiter.companyName || "Recruiter"}</span>
          </motion.div>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mt-2 w-40 bg-black/80 backdrop-blur-lg border border-gray-700 rounded-lg overflow-hidden shadow-lg"
              >
                <button
                  onClick={() => navigate("/recruiter/profile")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 transition"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 transition"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Welcome Header */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-4xl font-bold text-center"
        >
          Welcome, {recruiter.name || recruiter.companyName || "Recruiter"}!
        </motion.h1>

        {/* Top Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          {[
            { title: "Post a Job", path: "/post-job" },
            { title: "Manage Jobs", path: "/manage-jobs" },
          ].map((item, index) => (
            <motion.div
              key={index}
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="h-40 flex items-center justify-center text-center border border-gray-800 shadow-xl cursor-pointer bg-black/70 backdrop-blur-lg rounded-2xl hover:border-cyan-400"
            >
              <h2 className="text-2xl font-semibold">{item.title}</h2>
            </motion.div>
          ))}
        </div>

        {/* Total Jobs */}
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
            You haven't posted any jobs yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <motion.div
                key={job._id}
                whileHover={{ scale: 1.02 }}
                className="p-6 border border-gray-700 shadow-lg bg-black/60 backdrop-blur-lg rounded-xl relative"
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
                  {job.skills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-sm rounded bg-cyan-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {job.perks?.map((perk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-sm bg-green-600 rounded"
                    >
                      {perk}
                    </span>
                  ))}
                </div>

                {/* ONLY View Applicants */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => navigate(`/applicants/${job._id}`)}
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                  >
                    View Applicants
                  </button>
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