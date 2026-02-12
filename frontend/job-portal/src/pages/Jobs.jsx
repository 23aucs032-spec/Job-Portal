import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import { isAuthenticated } from "../utils/auth";

const Jobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 🔐 Protect route
  useEffect(() => {
    const user = isAuthenticated();
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  // 📦 Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get("http://localhost:5000/api/jobs");
      setJobs(res.data);
    };
    fetchJobs();
  }, []);

  // 📂 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    };
    fetchCategories();
  }, []);

  const filteredJobs =
    selectedCategory === "All"
      ? jobs
      : jobs.filter((job) => job.category === selectedCategory);

  return (
    <div className="min-h-screen px-6 py-10 bg-[#f9f6f1]">
      <h2 className="mb-6 text-3xl font-bold text-black">
        Available Jobs
      </h2>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-4 py-2 rounded-full border ${
            selectedCategory === "All"
              ? "bg-black text-white"
              : "bg-white text-black"
          }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === cat.name
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default Jobs;
