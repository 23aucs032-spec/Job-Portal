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
    minExp: "",
    maxExp: "",
    minSalary: "",
    maxSalary: "",
    skills: "",
    perks: "",
  });

  // Fetch single job details
  useEffect(() => {
    fetch(`http://localhost:5000/api/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setJobData({
          ...data,
          minSalary: data.minSalary?.toString().replace(/,/g, "") || "",
          maxSalary: data.maxSalary?.toString().replace(/,/g, "") || "",
          skills: data.skills?.join(", ") || "",
          perks: data.perks?.join(", ") || "",
        });
      })
      .catch((err) => console.error("Error fetching job:", err));
  }, [id, token]);

  // Handle Input Change
  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Update Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedJob = {
      ...jobData,
      skills: jobData.skills.split(",").map((s) => s.trim()),
      perks: jobData.perks.split(",").map((p) => p.trim()),
    };

    fetch(`http://localhost:5000/api/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedJob),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Job updated successfully!");
        navigate("/manage-jobs"); // ✅ changed here
      })
      .catch((err) => console.error("Error updating job:", err));
  };

  return (
    <>
      <AnimatedBackground />

      <div className="min-h-screen flex items-center justify-center text-white relative z-10 p-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/70 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-gray-800 w-full max-w-2xl"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">
            Edit Job
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="title"
              value={jobData.title}
              onChange={handleChange}
              placeholder="Job Title"
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
              required
            />

            <input
              type="text"
              name="companyName"
              value={jobData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
            />

            <input
              type="text"
              name="consultancyName"
              value={jobData.consultancyName}
              onChange={handleChange}
              placeholder="Consultancy Name"
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="minExp"
                value={jobData.minExp}
                onChange={handleChange}
                placeholder="Min Experience"
                className="p-3 rounded bg-gray-800 border border-gray-700"
              />

              <input
                type="number"
                name="maxExp"
                value={jobData.maxExp}
                onChange={handleChange}
                placeholder="Max Experience"
                className="p-3 rounded bg-gray-800 border border-gray-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="minSalary"
                value={jobData.minSalary}
                onChange={handleChange}
                placeholder="Min Salary"
                className="p-3 rounded bg-gray-800 border border-gray-700"
              />

              <input
                type="number"
                name="maxSalary"
                value={jobData.maxSalary}
                onChange={handleChange}
                placeholder="Max Salary"
                className="p-3 rounded bg-gray-800 border border-gray-700"
              />
            </div>

            <input
              type="text"
              name="skills"
              value={jobData.skills}
              onChange={handleChange}
              placeholder="Skills (comma separated)"
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
            />

            <input
              type="text"
              name="perks"
              value={jobData.perks}
              onChange={handleChange}
              placeholder="Perks (comma separated)"
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold"
            >
              Update Job
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default EditJob;
