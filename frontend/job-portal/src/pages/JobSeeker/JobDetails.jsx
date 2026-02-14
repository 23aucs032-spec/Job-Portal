import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/jobs/${id}`)
      .then((res) => res.json())
      .then((data) => setJob(data))
      .catch(() => alert("Job not found"));
  }, [id]);

  if (!job) return <p className="p-10 text-white">Loading...</p>;

  return (
    <div className="min-h-screen p-10 text-white bg-black/80">
      <button
        className="px-4 py-2 mb-6 bg-gray-700 rounded hover:bg-gray-600"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1 className="mb-2 text-3xl font-bold">{job.title}</h1>
      <p className="mb-4 text-gray-300">{job.companyName} • {job.location}</p>

      <div className="mb-4">
        <h2 className="font-semibold">Job Details:</h2>
        <p>Experience: {job.minExp}-{job.maxExp} yrs</p>
        <p>Salary: ₹{job.minSalary} - ₹{job.maxSalary}</p>
        <p>Work Mode: {job.workMode || "Any"}</p>
        <p>Department: {job.department || "Any"}</p>
        <p>Role Category: {job.roleCategory || "Any"}</p>
        <p>Education: {job.education || "Any"}</p>
        <p>Industry: {job.industry || "Any"}</p>
      </div>

      <div className="mb-6">
        <h2 className="font-semibold">Company Details:</h2>
        <p>Name: {job.companyName}</p>
        <p>Type: {job.companyType || "N/A"}</p>
        <p>Website: {job.companyWebsite || "N/A"}</p>
        <img
          src={job.companyLogo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
          alt={job.companyName}
          className="w-24 h-24 mt-2"
        />
      </div>

      <button
        className="px-6 py-3 bg-green-600 rounded hover:bg-green-700"
        onClick={() => alert("Application submitted!")}
      >
        Apply for Job
      </button>
    </div>
  );
};

export default JobDetails;
