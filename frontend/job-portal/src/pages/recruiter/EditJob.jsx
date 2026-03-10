/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";
import {
  Briefcase,
  MapPin,
  Building,
  DollarSign,
  Users,
  Calendar,
  Mail,
} from "lucide-react";

const API = "http://localhost:5000";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [skillInput, setSkillInput] = useState("");
  const [perkInput, setPerkInput] = useState("");

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
    skills: [],
    perks: [],
    jobDescription: "",
    responsibilities: [],
    applyBefore: "",
    contactEmail: "",
  });

  /* ================= FETCH JOB ================= */

  useEffect(() => {
    if (!token) return;

    const fetchJob = async () => {
      try {
        const res = await fetch(`${API}/api/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        setJobData({
          ...data,
          skills: data.skills || [],
          perks: data.perks || [],
          responsibilities: data.responsibilities || [],
          applyBefore: data.applyBefore
            ? data.applyBefore.split("T")[0]
            : "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Fetch Job Error:", err);
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, token]);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setJobData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= SKILLS ================= */

  const addSkill = () => {
    if (!skillInput) return;

    if (!jobData.skills.includes(skillInput)) {
      setJobData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput],
      }));
    }

    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setJobData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  /* ================= PERKS ================= */

  const addPerk = () => {
    if (!perkInput) return;

    if (!jobData.perks.includes(perkInput)) {
      setJobData((prev) => ({
        ...prev,
        perks: [...prev.perks, perkInput],
      }));
    }

    setPerkInput("");
  };

  const removePerk = (perk) => {
    setJobData((prev) => ({
      ...prev,
      perks: prev.perks.filter((p) => p !== perk),
    }));
  };

  /* ================= RESPONSIBILITIES ================= */

  const handleResponsibilities = (e) => {
    const list = e.target.value.split("\n");

    setJobData((prev) => ({
      ...prev,
      responsibilities: list,
    }));
  };

  /* ================= UPDATE JOB ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Job updated successfully!");

      navigate("/manage-jobs");
    } catch (err) {
      console.error("Update Job Error:", err);
      alert("Failed to update job");
    }
  };

  const inputStyle =
    "w-full bg-slate-900 border border-slate-700 p-3 rounded-xl focus:outline-none focus:border-cyan-400 mb-4";

  if (loading) {
    return (
      <div className="text-center text-white mt-20">Loading job...</div>
    );
  }

  return (
    <>
      <AnimatedBackground />

      <div className="flex justify-center px-4 py-10 text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl p-10 bg-black/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800"
        >
          <h1 className="text-3xl font-bold mb-8 text-center text-transparent bg-linear-to-r from-cyan-400 to-teal-400 bg-clip-text">
            Edit Job
          </h1>

          <form onSubmit={handleSubmit}>
            {/* JOB INFO */}

            <h3 className="flex items-center gap-2 text-xl mb-4">
              <Briefcase /> Job Info
            </h3>

            <input
              name="title"
              value={jobData.title}
              onChange={handleChange}
              placeholder="Job Title"
              className={inputStyle}
            />

            <input
              name="location"
              value={jobData.location}
              onChange={handleChange}
              placeholder="Location"
              className={inputStyle}
            />

            <select
              name="workMode"
              value={jobData.workMode}
              onChange={handleChange}
              className={inputStyle}
            >
              <option value="">Work Mode</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>Onsite</option>
            </select>

            {/* EXPERIENCE */}

            <h3 className="flex items-center gap-2 text-xl mt-8 mb-4">
              <Users /> Experience
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="minExp"
                value={jobData.minExp}
                onChange={handleChange}
                placeholder="Min Experience"
                className={inputStyle}
              />

              <input
                name="maxExp"
                value={jobData.maxExp}
                onChange={handleChange}
                placeholder="Max Experience"
                className={inputStyle}
              />
            </div>

            {/* SALARY */}

            <h3 className="flex items-center gap-2 text-xl mt-8 mb-4">
              <DollarSign /> Salary
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="minSalary"
                value={jobData.minSalary}
                onChange={handleChange}
                placeholder="Min Salary"
                className={inputStyle}
              />

              <input
                name="maxSalary"
                value={jobData.maxSalary}
                onChange={handleChange}
                placeholder="Max Salary"
                className={inputStyle}
              />
            </div>

            {/* SKILLS */}

            <h3 className="text-xl mt-8 mb-4">Skills</h3>

            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add Skill"
              className={inputStyle}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />

            <div className="flex flex-wrap gap-2 mb-4">
              {jobData.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-cyan-500 text-black px-3 py-1 rounded-full flex gap-2 items-center"
                >
                  {skill}
                  <button onClick={() => removeSkill(skill)}>✕</button>
                </span>
              ))}
            </div>

            {/* PERKS */}

            <h3 className="text-xl mt-8 mb-4">Perks</h3>

            <input
              value={perkInput}
              onChange={(e) => setPerkInput(e.target.value)}
              placeholder="Add Perk"
              className={inputStyle}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addPerk();
                }
              }}
            />

            <div className="flex flex-wrap gap-2 mb-4">
              {jobData.perks.map((perk) => (
                <span
                  key={perk}
                  className="bg-green-500 text-black px-3 py-1 rounded-full flex gap-2 items-center"
                >
                  {perk}
                  <button onClick={() => removePerk(perk)}>✕</button>
                </span>
              ))}
            </div>

            {/* DESCRIPTION */}

            <h3 className="text-xl mt-8 mb-4">Job Description</h3>

            <textarea
              name="jobDescription"
              value={jobData.jobDescription}
              onChange={handleChange}
              rows="4"
              placeholder="Job Description"
              className={inputStyle}
            />

            <textarea
              value={jobData.responsibilities.join("\n")}
              onChange={handleResponsibilities}
              rows="4"
              placeholder="Responsibilities (one per line)"
              className={inputStyle}
            />

            {/* APPLY BEFORE */}

            <h3 className="flex items-center gap-2 text-xl mt-8 mb-4">
              <Calendar /> Application
            </h3>

            <input
              type="date"
              name="applyBefore"
              value={jobData.applyBefore}
              onChange={handleChange}
              className={inputStyle}
            />

            <input
              name="contactEmail"
              value={jobData.contactEmail}
              onChange={handleChange}
              placeholder="Contact Email"
              className={inputStyle}
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 mt-6 bg-linear-to-r from-cyan-500 to-teal-500 text-black font-bold rounded-xl"
            >
              Update Job
            </motion.button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default EditJob;