import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";
import { Bookmark, ChevronDown, ChevronUp } from "lucide-react";

/* ================================
   FILTER BLOCK (MUST BE OUTSIDE)
================================ */
const FilterBlock = ({
  title,
  stateKey,
  options,
  filters,
  toggleFilter,
  collapse,
  toggleCollapse,
}) => (
  <div className="mb-5">
    <div
      className="flex justify-between cursor-pointer"
      onClick={() => toggleCollapse(stateKey)}
    >
      <h3 className="font-semibold">{title}</h3>
      {collapse[stateKey] ? <ChevronUp /> : <ChevronDown />}
    </div>

    {collapse[stateKey] && (
      <div className="mt-2 space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters[stateKey].includes(opt)}
              onChange={() => toggleFilter(stateKey, opt)}
            />
            {opt}
          </label>
        ))}
      </div>
    )}
  </div>
);

/* ================================
   MAIN COMPONENT
================================ */
const JobSeekerDashboard = () => {
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

  // LOAD ALL JOBS
  useEffect(() => {
    fetch("http://localhost:5000/api/jobs/all")
      .then((res) => res.json())
      .then((data) => setFilteredJobs(data));
  }, []);

  // APPLY FILTERS
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

  const toggleCollapse = (key) => {
    setCollapse({ ...collapse, [key]: !collapse[key] });
  };

  return (
    <div className="relative min-h-screen text-white">
      <div className="absolute inset-0 -z-10">
        <AnimatedBackground />
      </div>

      <div className="flex">
        {/* LEFT FILTER PANEL */}
        <div className="w-1/4 bg-black/80 p-6 overflow-y-auto h-screen border-r border-gray-800">
          <h2 className="text-2xl font-bold mb-2">All Filters</h2>
          <p className="text-blue-400 text-sm mb-4">
            Applied ({Object.values(filters).flat().length - 1})
          </p>

          {/* EXPERIENCE */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">
              Experience: {filters.experience} Yrs
            </h3>
            <input
              type="range"
              min="0"
              max="30"
              value={filters.experience}
              onChange={(e) =>
                setFilters({ ...filters, experience: Number(e.target.value) })
              }
              className="w-full"
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
            options={[
              "Software Developer",
              "Digital Marketing",
              "BD / Pre Sales",
              "UI/UX",
            ]}
            filters={filters}
            toggleFilter={toggleFilter}
            collapse={collapse}
            toggleCollapse={toggleCollapse}
          />

          <FilterBlock
            title="Education"
            stateKey="education"
            options={[
              "Any Graduate",
              "Any Postgraduate",
              "B.Sc",
              "B.Tech",
            ]}
            filters={filters}
            toggleFilter={toggleFilter}
            collapse={collapse}
            toggleCollapse={toggleCollapse}
          />

          <FilterBlock
            title="Industry"
            stateKey="industry"
            options={[
              "IT Services",
              "Software Product",
              "Advertising",
              "Consulting",
            ]}
            filters={filters}
            toggleFilter={toggleFilter}
            collapse={collapse}
            toggleCollapse={toggleCollapse}
          />

          <p className="mt-6 text-gray-400">
            Total Jobs: {filteredJobs.length}
          </p>
        </div>

        {/* RIGHT JOB LIST */}
        <div className="w-3/4 p-10">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-8 text-center"
          >
            Available Jobs
          </motion.h1>

          <div className="flex flex-col gap-6">
            {filteredJobs.map((job, i) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-black/70 p-6 rounded-xl flex justify-between border border-gray-800 hover:border-blue-500"
              >
                <div>
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  <p className="text-sm text-gray-300">
                    {job.companyName} • {job.location}
                  </p>
                  <p className="mt-1">
                    Experience: {job.minExp}-{job.maxExp} yrs
                  </p>
                  <p>
                    Salary: ₹{job.minSalary} - ₹{job.maxSalary}
                  </p>

                  <button className="mt-4 bg-green-600 px-4 py-2 rounded hover:bg-green-700">
                    Apply Now
                  </button>
                </div>

                <div className="text-right">
                  <img
                    src={
                      job.companyLogo ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                    className="w-12 h-12 ml-auto"
                    alt=""
                  />
                  <button className="flex items-center gap-2 mt-4 text-gray-400 hover:text-yellow-400">
                    <Bookmark size={18} />
                    Save
                  </button>
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
