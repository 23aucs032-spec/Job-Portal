import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DepartmentFilter from "../Filters/DepartmentFilter";
import LocationFilter from "../Filters/LocationFilter";
import CompanyTypeFilter from "../Filters/CompanyTypeFilter";
import RoleCategoryFilter from "../Filters/RoleCategoryFilter";
import EducationFilter from "../Filters/EducationFilter";
import IndustryFilter from "../Filters/IndustryFilter";
import KmsFilter from "../Filters/KmsFilter";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  User,
  LogOut,
  Briefcase,
  Home,
} from "lucide-react";

// FILTER BLOCK
const FilterBlock = ({
  title,
  stateKey,
  options,
  filters,
  toggleFilter,
  collapse,
  toggleCollapse,
}) => (
  <div className="mb-6">
    <div
      className="flex items-center justify-between mb-2 cursor-pointer"
      onClick={() => toggleCollapse(stateKey)}
    >
      <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
      {collapse[stateKey] ? (
        <ChevronUp size={16} />
      ) : (
        <ChevronDown size={16} />
      )}
    </div>

    {collapse[stateKey] && (
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-white"
          >
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
  const [profileOpen, setProfileOpen] = useState(false);

  // USER DATA
  const user =
    JSON.parse(localStorage.getItem("user")) || {
      name: "Job Seeker",
      profilePic:
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    };

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
    kms: 0,          // ✅ ADD THIS
    lat: null,       // ✅ ADD THIS
    lng: null,       // ✅ ADD THIS

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
    kms: true, // ✅ ADD THIS
  });

  // LOAD ALL JOBS FIRST
useEffect(() => {

  fetch("http://localhost:5000/api/jobs")

    .then((res) => res.json())

    .then((data) => {

      if (Array.isArray(data)) {

        setFilteredJobs(data);

      } else {

        setFilteredJobs([]);

      }

    })

    .catch(() => setFilteredJobs([]));

}, []);

useEffect(() => {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setFilters((prev) => ({
        ...prev,
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }));
    },
    // eslint-disable-next-line no-unused-vars
    (err) => {
      console.log("Location permission denied");
    }
  );
}, []);


useEffect(() => {
  const cleanedFilters = {
    ...filters,
    salary: filters.salary.map((range) =>
      range.replace(" LPA", "")
    ),
  };

  const fetchFilteredJobs = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/jobs/filter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cleanedFilters),
        }
      );

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setFilteredJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Filter error:", error);
      setFilteredJobs([]);
    }
  };

  fetchFilteredJobs();
}, [filters]);

    /* SAVE JOB */

const handleSaveJob = async (e, job) => {

  e.stopPropagation();

  try {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const res = await fetch(
      "http://localhost:5000/api/saved-jobs/save",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: job._id,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to save job");
    }

    alert("Job Saved Successfully");

  } catch (error) {

    console.error("Save Job Error:", error);
    alert("Unable to save job");

  }

};


const toggleFilter = (type, value) => {

  let updated = [];

  if (filters[type].includes(value)) {

    updated = filters[type].filter((v) => v !== value);

  }

  else {

    updated = [...filters[type], value];

  }

  setFilters({

    ...filters,

    [type]: updated,

  });

};

  const toggleCollapse = (key) => {
    setCollapse({
      ...collapse,
      [key]: !collapse[key],
    });
  };

  const handleJobClick = (id) => {
    navigate(`/job/${id}`);
  };

  // LOGOUT → HOME PAGE
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="relative min-h-screen text-white">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <AnimatedBackground />
      </div>


      {/* HEADER */}

      <div className="flex items-center justify-between px-10 py-4 border-b border-gray-800 bg-black/70 backdrop-blur-md">


        {/* LEFT LOGO */}

        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold text-blue-400 cursor-pointer"
        >
          Job Portal
        </h1>



        {/* RIGHT SECTION */}

        <div className="flex items-center gap-6">


          {/* HOME BUTTON */}

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-300 transition hover:text-blue-400"
          >
            <Home size={18} />
            Home
          </button>

{/* PROFILE */}
<div className="relative">

  {/* PROFILE BUTTON */}
  <motion.div
    whileHover={{
      scale: 1.05,
      borderColor: "#3B82F6",
      boxShadow: "0px 0px 12px rgba(59,130,246,0.4)"
    }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 300 }}
    onClick={() => setProfileOpen(!profileOpen)}
    className="flex items-center gap-3 px-3 py-2 transition-all border border-blue-900 rounded-lg cursor-pointer bg-black/60"
  >

    <motion.img
      whileHover={{ scale: 1.1 }}
      src={user.profilePic}
      className="border border-blue-900 rounded-full w-9 h-9"
    />

    <p className="text-sm font-semibold">
      {user.fullName}
    </p>

    <motion.div
      animate={{ rotate: profileOpen ? 180 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <ChevronDown size={16} />
    </motion.div>

  </motion.div>


  {/* DROPDOWN */}
  <AnimatePresence>
    {profileOpen && (

      <motion.div
        initial={{ opacity: 0, y: -15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="absolute right-0 mt-3 overflow-hidden bg-black border border-gray-700 shadow-xl w-52 rounded-xl"
      >

        {/* PROFILE BUTTON */}
        <motion.button
          whileHover={{
            scale: 1.05,
            x: 8,
            backgroundColor: "#1E293B"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={() => navigate("/profile")}
          className="flex items-center w-full gap-2 px-4 py-3 text-white"
        >
          <User size={16} />
          Profile
        </motion.button>

        {/* SAVED JOBS */}
        <motion.button
          whileHover={{
            scale: 1.05,
            x: 8,
            backgroundColor: "#1E293B"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={() => navigate("/saved-jobs")}
          className="flex items-center w-full gap-2 px-4 py-3 text-white"
        >
          <Briefcase size={16} />
          Saved Jobs
        </motion.button>

        {/* LOGOUT */}
        <motion.button
          whileHover={{
            scale: 1.05,
            x: 8,
            backgroundColor: "#DC2626"
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={handleLogout}
          className="flex items-center w-full gap-2 px-4 py-3 text-white"
        >
          <LogOut size={16} />
          Logout
        </motion.button>

      </motion.div>

    )}
  </AnimatePresence>

</div>


        </div>


      </div>


      {/* MAIN CONTAINER */}
      <div className="flex mx-auto max-w-350">


        {/* SIDEBAR */}
        <div className="min-h-screen p-6 border-r border-gray-800 w-72 bg-black/80">

          <h2 className="mb-1 text-xl font-bold">
            All Filters
          </h2>

          <p className="mb-5 text-sm text-blue-400">
  Applied ({
    // eslint-disable-next-line no-unused-vars
    Object.entries(filters).reduce((count, [key, value]) => {
      // Number filter
      if (typeof value === "number") {
        return value > 0 ? count + 1 : count;
      }
      // Array filter
      if (Array.isArray(value)) {
        return value.length > 0 ? count + 1 : count;
      }
      // Other types (null, string, etc.)
      return count;
    }, 0)
  })
</p>


{/* EXPERIENCE FILTER */}
<div className="mb-6">

  {/* HEADER */}
  <div
    className="flex items-center justify-between mb-4 cursor-pointer"
    onClick={() => toggleCollapse("experience")}
  >
    <h3 className="text-sm font-semibold text-gray-200">
      Experience
    </h3>

    {collapse.experience ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    )}
  </div>


  {/* SLIDER */}
  {collapse.experience && (

    <div className="px-2">

      {/* Bubble + Slider container */}
      <div className="relative w-full">

        {/* Bubble */}
        <div
          className="absolute -top-7"
          style={{
            left: `calc(${filters.experience / 30 * 100}% - 14px)`
          }}
        >
          <div className="relative">

            {/* Circle */}
            <div className="flex items-center justify-center text-xs text-white bg-blue-600 rounded-full w-7 h-7">

              {filters.experience}

            </div>

            {/* Triangle */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-blue-600 mx-auto -mt-1"></div>

          </div>
        </div>


        {/* Slider */}
        <input
          type="range"
          min="0"
          max="30"
          value={filters.experience}
          onChange={(e) =>
            setFilters({
              ...filters,
              experience: Number(e.target.value),
            })
          }
          className="w-full appearance-none bg-transparent cursor-pointer
          [&::-webkit-slider-runnable-track]:h-1
          [&::-webkit-slider-runnable-track]:bg-gray-600
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:bg-blue-600
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:-mt-1.5"
        />

      </div>


      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-400">

        <span>0 Yrs</span>

        <span>30 Yrs</span>

      </div>


      <hr className="mt-4 border-gray-700" />

    </div>

  )}

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

         <DepartmentFilter
 filters={filters}
 setFilters={setFilters}
/>

          <LocationFilter

filters={filters}

setFilters={setFilters}

/>

<FilterBlock
  title="Salary (LPA)"
  stateKey="salary"
  options={[
    "0-3 LPA",
    "3-6 LPA",
    "6-10 LPA",
    "10-15 LPA",
    "15-25 LPA",
    "25-50 LPA",
  ]}
  filters={filters}
  toggleFilter={toggleFilter}
  collapse={collapse}
  toggleCollapse={toggleCollapse}
/>

<CompanyTypeFilter
  selected={filters.companyType}
  setSelected={(value) =>
    setFilters({ ...filters, companyType: value })
  }
/>

<KmsFilter
  filters={filters}
  setFilters={setFilters}
  collapse={collapse}
  toggleCollapse={toggleCollapse}
/>

<RoleCategoryFilter
  selected={filters.roleCategory}
  setSelected={(value) =>
    setFilters({ ...filters, roleCategory: value })
  }
/>

<EducationFilter
  selected={filters.education}
  setSelected={(value) =>
    setFilters((prev) => ({
      ...prev,
      education: value,
    }))
  }
/>

<IndustryFilter
  selected={filters.industry}
  setSelected={(value) =>
    setFilters({
      ...filters,
      industry: value,
    })
  }
/>


          <p className="mt-6 text-sm text-gray-400">
            Total Jobs: {filteredJobs.length}
          </p>

        </div>



        {/* RIGHT SECTION */}
        <div className="flex-1 px-10 py-8">

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-3xl font-bold text-center"
          >
            Available Jobs
          </motion.h1>


          <div className="flex flex-col gap-5 mx-auto max-w-225">

            {Array.isArray(filteredJobs) && filteredJobs.map((job, i) => (

              <motion.div
                key={job._id}
                onClick={() => handleJobClick(job._id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="transition border border-gray-700 cursor-pointer bg-black/80 rounded-xl p-7 hover:border-blue-500 hover:shadow-lg"
              >

                <div className="flex justify-between">

                  {/* LEFT */}
                  <div>

                    <h2 className="text-lg font-semibold text-blue-400">
                      {job.title}
                    </h2>

                    <p className="mt-1 text-sm text-gray-300">
                      {job.companyName}
                    </p>

                    <div className="flex gap-6 mt-2 text-xs text-gray-400">
                      <span>
                        🧳 {job.minExp}-{job.maxExp} yrs
                      </span>

<span>
  📍 {Array.isArray(job.location?.coordinates)
        ? `Lat: ${job.location.coordinates[1]}, Lng: ${job.location.coordinates[0]}`
        : job.location}
</span>

                      <span>
                        💰 {job.minSalary}-{job.maxSalary} LPA
                      </span>
                    </div>


                    {/* SKILLS */}
                    {job.skills && (

                      <div className="flex flex-wrap gap-2 mt-3">

                        {job.skills.map((skill, index) => (

                          <span
                            key={index}
                            className="px-2 py-1 text-xs text-blue-400 border rounded bg-blue-500/10 border-b-cyan-700"
                          >
                            {skill}
                          </span>

                        ))}

                      </div>

                    )}


                    <p className="mt-2 text-xs text-gray-400 line-clamp-2">
                      {job.description}
                    </p>

                  </div>



                  {/* RIGHT */}
                  <div className="flex flex-col items-center gap-3">

                    <img
                      src={
                        job.companyLogo ||
                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }
                      className="p-1 bg-white rounded w-14 h-14"
                    />


                    <button
                      onClick={(e) => {
                        handleSaveJob(e, job)
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
