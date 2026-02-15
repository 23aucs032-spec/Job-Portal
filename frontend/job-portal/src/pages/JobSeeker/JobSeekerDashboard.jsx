import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";
import { Bookmark, ChevronDown, ChevronUp } from "lucide-react";

// FILTER BLOCK
const FilterBlock = ({ title, stateKey, options, filters, toggleFilter, collapse, toggleCollapse }) => (
  <div className="mb-6">
    <div className="flex justify-between items-center cursor-pointer mb-2" onClick={() => toggleCollapse(stateKey)}>
      <h3 className="font-semibold text-sm text-gray-200">{title}</h3>
      {collapse[stateKey] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </div>
    {collapse[stateKey] && (
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white">
            <input
              type="checkbox"
              checked={filters[stateKey].includes(opt)}
              onChange={() => toggleFilter(stateKey, opt)}
              className="accent-blue-500"
            />
            {opt}
          </label>
        ))}
      </div>
    )}
  </div>
);

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    experience: 0,
    workMode: [],
    department: [],
    location: [],
    salary: [],
    companyType: [],
    roleCategory: [],
    education: [],
    industry: [],
  });
  const [collapse, setCollapse] = useState({
    workMode: true,
    department: true,
    location: true,
    salary: true,
    companyType: true,
    roleCategory: true,
    education: true,
    industry: true,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs/all")
      .then((res) => res.json())
      .then((data) => setFilteredJobs(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs/filter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    })
      .then((res) => res.json())
      .then((data) => setFilteredJobs(data));
  }, [filters]);

  const toggleFilter = (type, value) => {
    const updated = filters[type].includes(value)
      ? filters[type].filter((v) => v !== value)
      : [...filters[type], value];
    setFilters({ ...filters, [type]: updated });
  };

  const toggleCollapse = (key) => setCollapse({ ...collapse, [key]: !collapse[key] });

  const handleJobClick = (id) => navigate(`/job/${id}`);

  return (
    <div className="relative min-h-screen text-white">
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <AnimatedBackground />
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex max-w-350 mx-auto">
        {/* SIDEBAR */}
        <div className="w-72 min-h-screen border-r border-gray-800 bg-black/80 p-6">
          <h2 className="text-xl font-bold mb-1">All Filters</h2>
          <p className="text-blue-400 text-sm mb-5">Applied ({Object.values(filters).flat().length - 1})</p>

          {/* EXPERIENCE */}
          <div className="mb-7">
            <h3 className="font-semibold text-sm mb-2">Experience: {filters.experience} Yrs</h3>
            <input
              type="range"
              min="0"
              max="30"
              value={filters.experience}
              onChange={(e) => setFilters({ ...filters, experience: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          <FilterBlock
            title="Work mode"
            stateKey="workMode"
            options={["office", "remote", "hybrid"]}
            filters={filters}
            toggleFilter={toggleFilter}
            collapse={collapse}
            toggleCollapse={toggleCollapse}
          />

          <FilterBlock
            title="Department"
            stateKey="department"
            options={["Engineering", "Sales", "Marketing", "Design"]}
            filters={filters}
            toggleFilter={toggleFilter}
            collapse={collapse}
            toggleCollapse={toggleCollapse}
          />

          <FilterBlock
            title="Location"
            stateKey="location"
            options={["Delhi", "Mumbai", "Chennai", "Bangalore"]}
            filters={filters}
            toggleFilter={toggleFilter}
            collapse={collapse}
            toggleCollapse={toggleCollapse}
          />

          <FilterBlock
            title="Salary"
            stateKey="salary"
            options={["0-3", "3-6", "6-10", "10-15"]}
            filters={filters}
            toggleFilter={toggleFilter}
            collapse={collapse}
            toggleCollapse={toggleCollapse}
          />

          <FilterBlock
            title="Company type"
            stateKey="companyType"
            options={["Startup", "Corporate", "Foreign MNC", "Indian MNC"]}
            filters={filters}
            toggleFilter={toggleFilter}
            collapse={collapse}
            toggleCollapse={toggleCollapse}
          />

          <FilterBlock
            title="Role category"
            stateKey="roleCategory"
            options={["Software Developer", "Digital Marketing", "BD / Pre Sales", "UI/UX"]}
            filters={filters}
            toggleFilter={toggleFilter}
            collapse={collapse}
            toggleCollapse={toggleCollapse}
          />

          <FilterBlock
            title="Education"
            stateKey="education"
            options={["Any Graduate", "Any Postgraduate", "B.Sc", "B.Tech"]}
            filters={filters}
            toggleFilter={toggleFilter}
            collapse={collapse}
            toggleCollapse={toggleCollapse}
          />

          <FilterBlock
            title="Industry"
            stateKey="industry"
            options={["IT Services", "Software Product", "Advertising", "Consulting"]}
            filters={filters}
            toggleFilter={toggleFilter}
            collapse={collapse}
            toggleCollapse={toggleCollapse}
          />

          <p className="text-gray-400 text-sm mt-6">Total Jobs: {filteredJobs.length}</p>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex-1 px-10 py-8">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-8 text-center">
            Available Jobs
          </motion.h1>

          <div className="flex flex-col gap-5 max-w-225 mx-auto">
            {filteredJobs.map((job, i) => (
              <motion.div
                key={job._id}
                onClick={() => handleJobClick(job._id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-black/80 border border-gray-700 rounded-xl p-7 cursor-pointer hover:border-blue-500 hover:shadow-lg transition"
              >
                <div className="flex justify-between">
                  {/* LEFT */}
                  <div>
                    <h2 className="text-lg font-semibold text-blue-400">{job.title}</h2>
                    <p className="text-gray-300 text-sm mt-1">{job.companyName}</p>
                    <div className="flex gap-6 text-xs text-gray-400 mt-2">
                      <span>🧳 {job.minExp}-{job.maxExp} yrs</span>
                      <span>📍 {job.location}</span>
                      <span>💰 ₹{job.minSalary}-{job.maxSalary}</span>
                    </div>

                    {/* SKILLS */}
                    {job.skills && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills.map((skill, index) => (
                          <span key={index} className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-b-cyan-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">{job.description}</p>
                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                      className="w-14 h-14 bg-white rounded p-1"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("Saved Job");
                      }}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-400"
                    >
                      <Bookmark size={16} />
                      Save
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
