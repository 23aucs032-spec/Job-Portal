import { useState } from "react";
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
    minExp: "",
    maxExp: "",
    minSalary: "",
    maxSalary: "",
    skills: [],
    perks: [],
  });

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
    try {
      const res = await fetch("http://localhost:5000/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      alert("Job Posted Successfully!");
      navigate("/recruiter/dashboard"); 
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("Error posting job");
    }
  };

  const inputStyle =
    "w-full bg-slate-900/80 text-white border border-slate-700 p-3 rounded-xl focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition mb-4 backdrop-blur";

  return (
    <>
      <AnimatedBackground />

      <div className="min-h-screen flex justify-center items-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-black/70 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl w-full max-w-3xl border border-slate-800"
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-linear-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
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
            <input
              name="companyName"
              placeholder="Company name"
              className={inputStyle}
              onChange={handleChange}
            />
          ) : (
            <>
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

          {/* Skills */}
          <div className="mb-6">
            <p className="font-semibold mb-2 text-slate-300">
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

            <div className="flex gap-2 flex-wrap mb-2">
              {skillSuggestions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => addSkill(skill)}
                  className="text-sm px-3 py-1 border border-slate-600 rounded-xl text-slate-300 hover:bg-cyan-500 hover:text-black transition"
                >
                  + {skill}
                </button>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap">
              {form.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-cyan-500 text-black px-3 py-1 rounded-full text-sm flex items-center gap-2"
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
            <p className="font-semibold mb-2 text-slate-300">
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

            <div className="flex gap-2 flex-wrap">
              {form.perks.map((perk) => (
                <span
                  key={perk}
                  className="bg-teal-500 text-black px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {perk}
                  <button onClick={() => removePerk(perk)}>✕</button>
                </span>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="mt-8 w-full bg-linear-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 transition py-3 rounded-xl font-semibold shadow-lg text-black"
          >
            Post Job
          </motion.button>
        </motion.div>
      </div>
    </>
  );
};

export default PostJob;
