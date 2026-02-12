import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  Bookmark,
  Search,
  ChevronDown,
} from "lucide-react";

const JobSeekerDashboard = () => {
  const [experience, setExperience] = useState(0);
  const [workMode, setWorkMode] = useState([]);
  const [salary, setSalary] = useState([]);
  const [location, setLocation] = useState([]);

  const toggleSelection = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const jobs = [
    {
      id: 1,
      title: "Web Development Trainee",
      company: "Qadir IT Services Private Limited",
      experience: "0-1 Yrs",
      location: "Chennai",
      salary: "0-3 Lakhs",
      type: "Work from office",
      posted: "3+ weeks ago",
    },
    {
      id: 2,
      title: "React JS Developer",
      company: "Posguru",
      experience: "0-2 Yrs",
      location: "Chennai",
      salary: "3-6 Lakhs",
      type: "Remote",
      posted: "1 day ago",
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    return (
      (workMode.length ? workMode.includes(job.type) : true) &&
      (salary.length ? salary.includes(job.salary) : true) &&
      (location.length ? location.includes(job.location) : true)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= HEADER ================= */}
      <div className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-600">JobPortal</h1>

          <div className="relative w-96">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full border rounded-full pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* ================= MAIN LAYOUT ================= */}
      <div className="max-w-7xl mx-auto flex gap-6 mt-6 px-6">

        {/* ================= LEFT FILTER SIDEBAR ================= */}
        <motion.aside
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-80 bg-white rounded-xl shadow p-6 space-y-6 h-fit"
        >
          <h2 className="text-lg font-semibold">All Filters</h2>

          {/* Posted By */}
          <div>
            <p className="font-medium mb-2">Posted By</p>
            <label className="flex gap-2">
              <input type="checkbox" /> Company Jobs
            </label>
            <label className="flex gap-2">
              <input type="checkbox" /> Consultant Jobs
            </label>
          </div>

          {/* Experience Slider */}
          <div>
            <p className="font-medium mb-2">Experience ({experience} Yrs)</p>
            <input
              type="range"
              min="0"
              max="30"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Work Mode */}
          <div>
            <p className="font-medium mb-2">Work Mode</p>
            {["Work from office", "Remote", "Hybrid"].map((mode) => (
              <label key={mode} className="flex gap-2">
                <input
                  type="checkbox"
                  checked={workMode.includes(mode)}
                  onChange={() =>
                    toggleSelection(mode, workMode, setWorkMode)
                  }
                />
                {mode}
              </label>
            ))}
          </div>

          {/* Location */}
          <div>
            <p className="font-medium mb-2">Location</p>
            {["Chennai", "Delhi", "Mumbai", "Kochi"].map((loc) => (
              <label key={loc} className="flex gap-2">
                <input
                  type="checkbox"
                  checked={location.includes(loc)}
                  onChange={() =>
                    toggleSelection(loc, location, setLocation)
                  }
                />
                {loc}
              </label>
            ))}
          </div>

          {/* Salary */}
          <div>
            <p className="font-medium mb-2">Salary</p>
            {["0-3 Lakhs", "3-6 Lakhs", "6-10 Lakhs"].map((sal) => (
              <label key={sal} className="flex gap-2">
                <input
                  type="checkbox"
                  checked={salary.includes(sal)}
                  onChange={() =>
                    toggleSelection(sal, salary, setSalary)
                  }
                />
                {sal}
              </label>
            ))}
          </div>
        </motion.aside>

        {/* ================= JOB LIST ================= */}
        <main className="flex-1 space-y-6">

          <div className="text-gray-500 text-sm">
            Showing {filteredJobs.length} jobs
          </div>

          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600">
                    {job.title}
                  </h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                <Bookmark className="text-gray-400 cursor-pointer hover:text-blue-600" />
              </div>

              <div className="flex gap-6 text-gray-500 text-sm mt-4">
                <div className="flex items-center gap-1">
                  <Briefcase size={16} />
                  {job.experience}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  {job.location}
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                Salary: {job.salary}
              </div>

              <div className="text-xs text-gray-400 mt-2">
                {job.posted}
              </div>

              <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition">
                Apply Now
              </button>
            </motion.div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;


/*import { useState, useEffect } from "react";
import { Search, Filter, Grid, List, X } from "lucide-react";
import LoadingSpinner from "../../components";
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from "../utils/apiPaths";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from "../../context/AuthContent";
import { Navigate } from 'react-router-dom';


const JobSeekerDashboard = () => {
 
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();


  //filter states

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: "",
    type: "",
    minSalary: "",
    maxSalary: ""
  });

  //sidebar collapse states
  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    salary: true,
    categories: true
  });

  //function to fetch jobs from api

  const fetchJobs = async (filterParams = {}) => {

  };

  //fetch jobs when filters change 
  useEffect
}
*/