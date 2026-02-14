import { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const skillSuggestions = [
  "React","Node.js","MongoDB","Express",
  "JavaScript","Python","Java","SQL","AWS","Docker",
];

const perkSuggestions = [
  "Health Insurance",
  "Work From Home",
  "Flexible Hours",
  "Free Meals",
  "Paid Leave",
  "PF",
  "ESI",
  "Gym",
  "Cab Facility",
  "Stock Options",
];

const PostJob = () => {

  const navigate = useNavigate();
  
  const [jobType, setJobType] = useState("company");
  const [skillInput, setSkillInput] = useState("");
  const [perkInput, setPerkInput] = useState("");

const [form, setForm] = useState({
  companyName: "",
  consultancyName: "",
  hiringFor: "",
  title: "",
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

  // NEW
  jobDescription: "",
  responsibilities: [],
  applyBefore: "",
  contactEmail: "",
});


useEffect(() => {
  const fetchCompany = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    setForm((prev) => ({
      ...prev,
      companyName: data.user.companyName || "",
      contactEmail: data.user.email || "",   // 🔥 AUTO EMAIL
    }));
  };

  fetchCompany();
}, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSkill = (skill) => {
    if (!form.skills.includes(skill)) {
      setForm({ ...form, skills: [...form.skills, skill] });
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setForm({
      ...form,
      skills: form.skills.filter((s) => s !== skill),
    });
  };

  const addPerk = (perk) => {
    if (!form.perks.includes(perk)) {
      setForm({ ...form, perks: [...form.perks, perk] });
    }
    setPerkInput("");
  };

  const removePerk = (perk) => {
    setForm({
      ...form,
      perks: form.perks.filter((p) => p !== perk),
    });
  };

const handleSubmit = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) throw new Error("Failed to post job");

    // eslint-disable-next-line no-unused-vars
    const data = await res.json();

    // Optionally, show success toast here
    alert("Job posted successfully!");

    // Redirect to dashboard
    navigate("/recruiter/dashboard");
  } catch (err) {
    console.error("Error posting job:", err);
    alert("Failed to post job. Check console for details.");
  }
};


  const inputStyle =
    "w-full bg-slate-900/80 text-white border border-slate-700 p-3 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition mb-4 backdrop-blur";

  return (
    <>
      <AnimatedBackground />

      <div className="flex items-center justify-center min-h-screen px-4 text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-3xl p-10 border shadow-2xl bg-black/70 backdrop-blur-2xl rounded-3xl border-slate-800"
        >
          <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-linear-to-r from-cyan-400 to-teal-400 bg-clip-text">
            Post a Job
          </h2>

          {/* Type */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setJobType("company")}
              className={`px-4 py-2 rounded-xl ${
                jobType === "company"
                  ? "bg-cyan-500 text-black"
                  : "border border-slate-600 text-slate-300"
              }`}
            >
              Company / Business
            </button>

            <button
              onClick={() => setJobType("consultancy")}
              className={`px-4 py-2 rounded-xl ${
                jobType === "consultancy"
                  ? "bg-cyan-500 text-black"
                  : "border border-slate-600 text-slate-300"
              }`}
            >
              Consultancy
            </button>
          </div>

          {jobType === "company" ? (
            <>
              <input
                name="companyName"
                value={form.companyName}
                placeholder="Company name"
                className={inputStyle}
                onChange={handleChange}
              />
              <input
                name="contactEmail"
                value={form.contactEmail}
                readOnly
                className={inputStyle + " opacity-70"}
              />
              <input
                name="hiringFor"
                placeholder="Company you're hiring for"
                className={inputStyle}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <input
                name="companyName"
                value={form.companyName}
                placeholder="Company name"
                className={inputStyle}
                onChange={handleChange}
              />
              <input
                name="contactEmail"
                value={form.contactEmail}
                readOnly
                className={inputStyle + " opacity-70"}
              />
              <input
                name="consultancyName"
                placeholder="Consultancy name"
                className={inputStyle}
                onChange={handleChange}
              />
              <input
                name="hiringFor"
                placeholder="Company you're hiring for"
                className={inputStyle}
                onChange={handleChange}
              />
            </>
          )}

          <input
            name="title"
            placeholder="Job title"
            className={inputStyle}
            onChange={handleChange}
          />

          {/* NEW FIELDS */}
          <input name="workMode" placeholder="Work mode (Remote / Hybrid / Onsite)" className={inputStyle} onChange={handleChange} />
          <input name="department" placeholder="Department" className={inputStyle} onChange={handleChange} />
          <input name="location" placeholder="Location" className={inputStyle} onChange={handleChange} />
          <input name="companyType" placeholder="Company type (Startup / MNC / Product)" className={inputStyle} onChange={handleChange} />
          <input name="roleCategory" placeholder="Role category" className={inputStyle} onChange={handleChange} />
          <input name="education" placeholder="Education required" className={inputStyle} onChange={handleChange} />
          <input name="industry" placeholder="Industry" className={inputStyle} onChange={handleChange} />

          {/* Skills */}
          <div className="mb-6">
            <p className="mb-2 font-semibold text-slate-300">
              Required Skills
            </p>

            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Type skill and press enter"
              className={inputStyle}
              onKeyDown={(e) => {
                if (e.key === "Enter" && skillInput) {
                  e.preventDefault();
                  addSkill(skillInput);
                }
              }}
            />

            <div className="flex flex-wrap gap-2 mb-2">
              {skillSuggestions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => addSkill(skill)}
                  className="px-3 py-1 text-sm transition border border-slate-600 rounded-xl text-slate-300 hover:bg-cyan-500 hover:text-black"
                >
                  + {skill}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {form.skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-black rounded-full bg-cyan-500"
                >
                  {skill}
                  <button onClick={() => removeSkill(skill)}>✕</button>
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select name="minExp" className={inputStyle} onChange={handleChange}>
              <option value="">Min exp</option>
              <option>0</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>

            <select name="maxExp" className={inputStyle} onChange={handleChange}>
              <option value="">Max exp</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
            </select>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              name="minSalary"
              placeholder="₹ Min salary"
              className={inputStyle}
              onChange={handleChange}
            />
            <input
              name="maxSalary"
              placeholder="₹ Max salary"
              className={inputStyle}
              onChange={handleChange}
            />
          </div>

          {/* Perks */}
          <div className="mb-6">
            <p className="mb-2 font-semibold text-slate-300">
              Perks & Benefits
            </p>

            <select
              className={inputStyle}
              onChange={(e) => addPerk(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Select a benefit
              </option>
              {perkSuggestions.map((perk) => (
                <option key={perk} value={perk}>
                  {perk}
                </option>
              ))}
            </select>

            <input
              value={perkInput}
              onChange={(e) => setPerkInput(e.target.value)}
              placeholder="Or type custom benefit and press enter"
              className={inputStyle}
              onKeyDown={(e) => {
                if (e.key === "Enter" && perkInput) {
                  e.preventDefault();
                  addPerk(perkInput);
                }
              }}
            />

            <div className="flex flex-wrap gap-2">
              {form.perks.map((perk) => (
                <span
                  key={perk}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-black bg-teal-500 rounded-full"
                >
                  {perk}
                  <button onClick={() => removePerk(perk)}>✕</button>
                </span>
              ))}
            </div>
          </div>

          {/* Job Description */}
<textarea
  name="jobDescription"
  placeholder="Job description"
  rows="4"
  className={inputStyle}
  onChange={handleChange}
/>

{/* Responsibilities */}
<textarea
  placeholder="Responsibilities (one per line)"
  rows="4"
  className={inputStyle}
  onChange={(e) =>
    setForm({
      ...form,
      responsibilities: e.target.value.split("\n"),
    })
  }
/>

{/* Apply Before */}
<input
  type="date"
  name="applyBefore"
  className={inputStyle}
  onChange={handleChange}
/>

{/* Contact Email (Read Only) */}



          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="w-full py-3 mt-8 font-semibold text-black transition shadow-lg bg-linear-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 rounded-xl"
          >
            Post Job
          </motion.button>
        </motion.div>
      </div>
    </>
  );
};

export default PostJob;
