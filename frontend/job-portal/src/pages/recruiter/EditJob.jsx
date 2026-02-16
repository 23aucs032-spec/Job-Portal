import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [jobData, setJobData] = useState({
    title: "",
    companyName: "",
    consultancyName: "",
    hiringFor: "",
    workMode: "",
    department: "",
    location: "",
    companyType: "",
    roleCategory: "",
    education: "",
    industry: "",
    minExp: "",
    maxExp: "",
    minSalary: "",
    maxSalary: "",
    skills: "",
    perks: "",
    jobDescription: "",
    responsibilities: "",
    applyBefore: "",
    contactEmail: "",
  });

  // Fetch single job details
  useEffect(() => {
  if (!token) return;

  fetch(`http://localhost:5000/api/jobs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      setJobData({
        title: data.title || "",
        companyName: data.companyName || "",
        consultancyName: data.consultancyName || "",
        hiringFor: data.hiringFor || "",
        workMode: data.workMode || "",
        department: data.department || "",
        location: data.location || "",
        companyType: data.companyType || "",
        roleCategory: data.roleCategory || "",
        education: data.education || "",
        industry: data.industry || "",
        minExp: data.minExp || "",
        maxExp: data.maxExp || "",
        minSalary: data.minSalary || "",
        maxSalary: data.maxSalary || "",
        skills: data.skills?.join(", ") || "",
        perks: data.perks?.join(", ") || "",
        jobDescription: data.jobDescription || "",
        responsibilities: data.responsibilities?.join("\n") || "",
        applyBefore: data.applyBefore ? data.applyBefore.split("T")[0] : "",
        contactEmail: data.contactEmail || "",
      });
    })
    .catch((err) => console.error("Error fetching job:", err));
}, [id, token]);


  // Handle input change
  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  // Handle update submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedJob = {
      ...jobData,
      skills: jobData.skills.split(",").map((s) => s.trim()),
      perks: jobData.perks.split(",").map((p) => p.trim()),
      responsibilities: jobData.responsibilities
        .split("\n")
        .map((r) => r.trim())
        .filter((r) => r.length > 0),
    };

    fetch(`http://localhost:5000/api/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(updatedJob),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Job updated successfully!");
        navigate("/manage-jobs");
      })
      .catch((err) => console.error("Error updating job:", err));
  };

  return (
    <>
      <AnimatedBackground />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl p-8 border border-gray-800 shadow-xl bg-black/70 backdrop-blur-lg rounded-2xl"
        >
          <h2 className="mb-6 text-3xl font-bold text-center">Edit Job</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <input type="text" name="title" value={jobData.title} onChange={handleChange} placeholder="Job Title" className="w-full p-3 bg-gray-800 border border-gray-700 rounded" required />
            <input type="text" name="companyName" value={jobData.companyName} onChange={handleChange} placeholder="Company Name" className="w-full p-3 bg-gray-800 border border-gray-700 rounded" />
            <input type="text" name="consultancyName" value={jobData.consultancyName} onChange={handleChange} placeholder="Consultancy Name" className="w-full p-3 bg-gray-800 border border-gray-700 rounded" />
            <input type="text" name="hiringFor" value={jobData.hiringFor} onChange={handleChange} placeholder="Hiring For" className="w-full p-3 bg-gray-800 border border-gray-700 rounded" />

            {/* Work Info */}
            <input type="text" name="workMode" value={jobData.workMode} onChange={handleChange} placeholder="Work Mode (Remote / Hybrid / Onsite)" className="w-full p-3 bg-gray-800 border border-gray-700 rounded" />
            <input type="text" name="department" value={jobData.department} onChange={handleChange} placeholder="Department" className="w-full p-3 bg-gray-800 border border-gray-700 rounded" />
            <input type="text" name="location" value={jobData.location} onChange={handleChange} placeholder="Location" className="w-full p-3 bg-gray-800 border border-gray-700 rounded" />
            <input type="text" name="companyType" value={jobData.companyType} onChange={handleChange} placeholder="Company Type" className="w-full p-3 bg-gray-800 border border-gray-700 rounded" />
            <input type="text" name="roleCategory" value={jobData.roleCategory} onChange={handleChange} placeholder="Role Category" className="w-full p-3 bg-gray-800 border border-gray-700 rounded" />
            <input type="text" name="education" value={jobData.education} onChange={handleChange} placeholder="Education Required" className="w-full p-3 bg-gray-800 border border-gray-700 rounded" />
            <input type="text" name="industry" value={jobData.industry} onChange={handleChange} placeholder="Industry" className="w-full p-3 bg-gray-800 border border-gray-700 rounded" />

            {/* Experience & Salary */}
            <div className="grid grid-cols-2 gap-4">
              <input type="number" name="minExp" value={jobData.minExp} onChange={handleChange} placeholder="Min Experience" className="p-3 bg-gray-800 border border-gray-700 rounded" />
              <input type="number" name="maxExp" value={jobData.maxExp} onChange={handleChange} placeholder="Max Experience" className="p-3 bg-gray-800 border border-gray-700 rounded" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" name="minSalary" value={jobData.minSalary} onChange={handleChange} placeholder="Min Salary" className="p-3 bg-gray-800 border border-gray-700 rounded" />
              <input type="number" name="maxSalary" value={jobData.maxSalary} onChange={handleChange} placeholder="Max Salary" className="p-3 bg-gray-800 border border-gray-700 rounded" />
            </div>

            {/* Skills & Perks */}
            <input type="text" name="skills" value={jobData.skills} onChange={handleChange} placeholder="Skills (comma separated)" className="w-full p-3 bg-gray-800 border border-gray-700 rounded" />
            <input type="text" name="perks" value={jobData.perks} onChange={handleChange} placeholder="Perks (comma separated)" className="w-full p-3 bg-gray-800 border border-gray-700 rounded" />

            {/* Job Description */}
            <textarea name="jobDescription" value={jobData.jobDescription} onChange={handleChange} placeholder="Job Description" rows={4} className="w-full p-3 bg-gray-800 border border-gray-700 rounded" />
            <textarea name="responsibilities" value={jobData.responsibilities} onChange={handleChange} placeholder="Responsibilities (one per line)" rows={4} className="w-full p-3 bg-gray-800 border border-gray-700 rounded" />

            {/* Apply Before & Contact */}
            <input type="date" name="applyBefore" value={jobData.applyBefore} onChange={handleChange} className="w-full p-3 bg-gray-800 border border-gray-700 rounded" />
            <input type="email" name="contactEmail" value={jobData.contactEmail} onChange={handleChange} placeholder="Contact Email" className="w-full p-3 bg-gray-800 border border-gray-700 rounded" />

            <button type="submit" className="w-full py-3 font-semibold bg-blue-600 rounded hover:bg-blue-700">Update Job</button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default EditJob;
