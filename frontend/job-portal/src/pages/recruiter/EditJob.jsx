/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
  Users,
  Calendar,
  Mail,
  ChevronDown,
  LogOut,
  UserCircle2,
  LayoutDashboard,
  PlusCircle,
  Settings,
  BadgeCheck,
  FileText,
  Clock3,
  Save,
  ArrowLeft,
  X,
} from "lucide-react";

const API = "http://localhost:5000";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [perkInput, setPerkInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [recruiter, setRecruiter] = useState(null);

  const dropdownRef = useRef(null);

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

  /* ================= CLOSE DROPDOWN ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= FETCH RECRUITER ================= */
  useEffect(() => {
    const fetchRecruiter = async () => {
      if (!token) {
        navigate("/recruiter/login");
        return;
      }

      try {
        const res = await fetch(`${API}/api/recruiter/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch recruiter profile");
        }

        setRecruiter(data);
      } catch (err) {
        console.error("Recruiter fetch error:", err);
      }
    };

    fetchRecruiter();
  }, [navigate, token]);

  /* ================= FETCH JOB ================= */
  useEffect(() => {
    if (!token) {
      navigate("/recruiter/login");
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const res = await fetch(`${API}/api/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch job");
        }

        setJobData({
          title: data?.title || "",
          companyName: data?.companyName || "",
          consultancyName: data?.consultancyName || "",
          hiringFor: data?.hiringFor || "",
          workMode: data?.workMode || "",
          department: data?.department || "",
          location: data?.location || "",
          companyType: data?.companyType || "",
          roleCategory: data?.roleCategory || "",
          education: data?.education || "",
          industry: data?.industry || "",
          minExp: data?.minExp ?? "",
          maxExp: data?.maxExp ?? "",
          minSalary: data?.minSalary ?? "",
          maxSalary: data?.maxSalary ?? "",
          skills: Array.isArray(data?.skills) ? data.skills : [],
          perks: Array.isArray(data?.perks) ? data.perks : [],
          jobDescription: data?.jobDescription || "",
          responsibilities: Array.isArray(data?.responsibilities)
            ? data.responsibilities
            : [],
          applyBefore: data?.applyBefore ? data.applyBefore.split("T")[0] : "",
          contactEmail: data?.contactEmail || "",
        });
      } catch (err) {
        console.error("Fetch Job Error:", err);
        setErrorMessage(err.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, token, navigate]);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

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
    const cleaned = skillInput.trim();
    if (!cleaned) return;

    if (!jobData.skills.includes(cleaned)) {
      setJobData((prev) => ({
        ...prev,
        skills: [...prev.skills, cleaned],
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
    const cleaned = perkInput.trim();
    if (!cleaned) return;

    if (!jobData.perks.includes(cleaned)) {
      setJobData((prev) => ({
        ...prev,
        perks: [...prev.perks, cleaned],
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
    const list = e.target.value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    setJobData((prev) => ({
      ...prev,
      responsibilities: list,
    }));
  };

  /* ================= UPDATE JOB ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/recruiter/login");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...jobData,
        minExp: Number(jobData.minExp),
        maxExp: Number(jobData.maxExp),
        minSalary: Number(jobData.minSalary),
        maxSalary: Number(jobData.maxSalary),
      };

      const res = await fetch(`${API}/api/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update job");

      alert("Job updated successfully!");
      navigate("/manage-jobs");
    } catch (err) {
      console.error("Update Job Error:", err);
      alert(err.message || "Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle =
    "w-full bg-[#0f172a] border border-white/10 p-3 rounded-xl focus:outline-none focus:border-cyan-400 text-white placeholder:text-slate-400";

  const recruiterName =
    recruiter?.fullName || recruiter?.name || "Recruiter";
  const companyName = recruiter?.companyName || "Company Name";

  const logoUrl =
    recruiter?.logo && recruiter.logo.startsWith("http")
      ? recruiter.logo
      : recruiter?.logo
      ? `${API}${recruiter.logo}`
      : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="px-8 py-10 text-lg border shadow-2xl bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
            Loading job...
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#020617] text-white">
        <div className="max-w-3xl px-4 py-20 mx-auto">
          <div className="p-8 text-center border rounded-3xl bg-red-500/10 border-red-500/20">
            <h2 className="text-2xl font-bold text-red-300">Failed to load job</h2>
            <p className="mt-3 text-red-200">{errorMessage}</p>
            <button
              onClick={() => navigate("/manage-jobs")}
              className="px-6 py-3 mt-6 font-medium text-white bg-cyan-600 rounded-xl hover:bg-cyan-700"
            >
              Back to Manage Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* ================= NAVBAR / HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#020617]/95 backdrop-blur-md">
        <div className="max-w-7xl px-4 py-4 mx-auto md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-8">
              <div
                onClick={() => navigate("/")}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-cyan-500/15 text-cyan-300">
                  <Briefcase size={22} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Job Portal</h1>
                  <p className="text-xs text-slate-400">Edit Job</p>
                </div>
              </div>

              <nav className="hidden gap-2 md:flex">
                <button
                  onClick={() => navigate("/recruiter/dashboard")}
                  className="px-4 py-2 text-sm font-medium transition rounded-xl text-slate-300 hover:bg-white/5"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => navigate("/post-job")}
                  className="px-4 py-2 text-sm font-medium transition rounded-xl text-slate-300 hover:bg-white/5"
                >
                  Post Job
                </button>

                <button
                  onClick={() => navigate("/manage-jobs")}
                  className="px-4 py-2 text-sm font-medium rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/20"
                >
                  Manage Jobs
                </button>

                <button
                  onClick={() => navigate("/recruiter/profile")}
                  className="px-4 py-2 text-sm font-medium transition rounded-xl text-slate-300 hover:bg-white/5"
                >
                  Profile
                </button>
              </nav>
            </div>

            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-3 px-4 py-3 border shadow-xl rounded-2xl bg-white/5 backdrop-blur-xl border-white/10 hover:border-cyan-400/30"
              >
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Company Logo"
                    className="object-cover w-11 h-11 border rounded-full border-white/20"
                  />
                ) : (
                  <div className="flex items-center justify-center w-11 h-11 rounded-full bg-cyan-500/15">
                    <UserCircle2 className="text-cyan-300" size={22} />
                  </div>
                )}

                <div className="text-left">
                  <p className="text-sm font-semibold">{recruiterName}</p>
                  <p className="text-xs text-slate-400">{companyName}</p>
                </div>

                <ChevronDown size={18} className="text-slate-300" />
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 z-30 w-56 mt-3 overflow-hidden border shadow-2xl rounded-2xl bg-[#0B1220]/95 backdrop-blur-xl border-white/10"
                  >
                    <button
                      onClick={() => navigate("/recruiter/profile")}
                      className="flex items-center w-full gap-3 px-4 py-3 text-left transition hover:bg-white/10"
                    >
                      <UserCircle2 size={18} />
                      Profile
                    </button>

                    <button
                      onClick={() => navigate("/recruiter/dashboard")}
                      className="flex items-center w-full gap-3 px-4 py-3 text-left transition hover:bg-white/10"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full gap-3 px-4 py-3 text-left transition hover:bg-red-500/20"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl px-4 py-8 mx-auto md:px-8">
        {/* ================= HERO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="p-6 mb-8 border shadow-2xl rounded-3xl bg-linear-to-r from-[#0f172a] via-[#111827] to-[#0f172a] border-white/10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-medium border rounded-full bg-cyan-500/10 text-cyan-300 border-cyan-500/20">
                <Settings size={13} />
                Job Update Panel
              </div>

              <h2 className="text-2xl font-bold md:text-3xl">Edit Job Details</h2>
              <p className="mt-2 max-w-2xl text-slate-300">
                Update the role, salary, skills, perks, and description to keep
                your job listing accurate and attractive.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/manage-jobs")}
                className="inline-flex items-center gap-2 px-5 py-3 font-medium transition border rounded-2xl border-white/10 bg-white/5 hover:bg-white/10"
              >
                <ArrowLeft size={18} />
                Back to Manage Jobs
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          {/* ================= FORM PANEL ================= */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-6 border shadow-2xl bg-white/5 backdrop-blur-2xl rounded-3xl border-white/10 md:p-8"
          >
            <h1 className="mb-8 text-3xl font-bold text-center text-transparent bg-linear-to-r from-cyan-400 to-teal-400 bg-clip-text">
              Edit Job
            </h1>

            <form onSubmit={handleSubmit}>
              {/* JOB INFO */}
              <h3 className="flex items-center gap-2 mb-4 text-xl">
                <Briefcase /> Job Info
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  name="title"
                  value={jobData.title}
                  onChange={handleChange}
                  placeholder="Job Title"
                  className={inputStyle}
                />

                <input
                  name="companyName"
                  value={jobData.companyName}
                  onChange={handleChange}
                  placeholder="Company Name"
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
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>

                <input
                  name="department"
                  value={jobData.department}
                  onChange={handleChange}
                  placeholder="Department"
                  className={inputStyle}
                />

                <input
                  name="roleCategory"
                  value={jobData.roleCategory}
                  onChange={handleChange}
                  placeholder="Role Category"
                  className={inputStyle}
                />

                <input
                  name="education"
                  value={jobData.education}
                  onChange={handleChange}
                  placeholder="Education"
                  className={inputStyle}
                />

                <input
                  name="industry"
                  value={jobData.industry}
                  onChange={handleChange}
                  placeholder="Industry"
                  className={inputStyle}
                />
              </div>

              {/* EXPERIENCE */}
              <h3 className="flex items-center gap-2 mt-8 mb-4 text-xl">
                <Users /> Experience
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  name="minExp"
                  value={jobData.minExp}
                  onChange={handleChange}
                  placeholder="Min Experience"
                  type="number"
                  className={inputStyle}
                />

                <input
                  name="maxExp"
                  value={jobData.maxExp}
                  onChange={handleChange}
                  placeholder="Max Experience"
                  type="number"
                  className={inputStyle}
                />
              </div>

              {/* SALARY */}
              <h3 className="flex items-center gap-2 mt-8 mb-4 text-xl">
                <DollarSign /> Salary
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  name="minSalary"
                  value={jobData.minSalary}
                  onChange={handleChange}
                  placeholder="Min Salary"
                  type="number"
                  className={inputStyle}
                />

                <input
                  name="maxSalary"
                  value={jobData.maxSalary}
                  onChange={handleChange}
                  placeholder="Max Salary"
                  type="number"
                  className={inputStyle}
                />
              </div>

              {/* SKILLS */}
              <h3 className="mt-8 mb-4 text-xl">Skills</h3>

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
                    className="bg-cyan-500 text-black px-3 py-1 rounded-full flex gap-2 items-center font-medium"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              {/* PERKS */}
              <h3 className="mt-8 mb-4 text-xl">Perks</h3>

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
                    className="bg-green-500 text-black px-3 py-1 rounded-full flex gap-2 items-center font-medium"
                  >
                    {perk}
                    <button
                      type="button"
                      onClick={() => removePerk(perk)}
                      className="hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>

              {/* DESCRIPTION */}
              <h3 className="mt-8 mb-4 text-xl">Job Description</h3>

              <textarea
                name="jobDescription"
                value={jobData.jobDescription}
                onChange={handleChange}
                rows="5"
                placeholder="Job Description"
                className={inputStyle}
              />

              <textarea
                value={jobData.responsibilities.join("\n")}
                onChange={handleResponsibilities}
                rows="5"
                placeholder="Responsibilities (one per line)"
                className={inputStyle}
              />

              {/* APPLICATION */}
              <h3 className="flex items-center gap-2 mt-8 mb-4 text-xl">
                <Calendar /> Application
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={saving}
                className="w-full py-3 mt-6 font-bold text-black rounded-xl bg-linear-to-r from-cyan-500 to-teal-500 disabled:opacity-60"
              >
                <span className="inline-flex items-center gap-2">
                  <Save size={18} />
                  {saving ? "Updating..." : "Update Job"}
                </span>
              </motion.button>
            </form>
          </motion.div>

          {/* ================= SUMMARY SIDEBAR ================= */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 border shadow-2xl rounded-3xl bg-white/5 border-white/10"
            >
              <h3 className="mb-5 text-xl font-semibold">Quick Summary</h3>

              <div className="grid gap-3">
                <MiniStat
                  title="Skills"
                  value={jobData.skills.length}
                  color="cyan"
                />
                <MiniStat
                  title="Perks"
                  value={jobData.perks.length}
                  color="emerald"
                />
                <MiniStat
                  title="Responsibilities"
                  value={jobData.responsibilities.length}
                  color="purple"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 border shadow-2xl rounded-3xl bg-white/5 border-white/10"
            >
              <h3 className="mb-4 text-xl font-semibold">Tips</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="p-3 rounded-2xl bg-[#0f172a] border border-white/10">
                  Keep salary and experience ranges realistic.
                </div>
                <div className="p-3 rounded-2xl bg-[#0f172a] border border-white/10">
                  Add only relevant skills to improve candidate matching.
                </div>
                <div className="p-3 rounded-2xl bg-[#0f172a] border border-white/10">
                  Use a clear description and responsibilities list.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SnapshotRow = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#0f172a] border border-white/10">
      <div className="mt-0.5 text-cyan-300">{icon}</div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm text-white wrap-break-word">{value}</p>
      </div>
    </div>
  );
};

const MiniStat = ({ title, value, color = "cyan" }) => {
  const colorMap = {
    cyan: "bg-cyan-500/15 text-cyan-300",
    emerald: "bg-emerald-500/15 text-emerald-300",
    purple: "bg-purple-500/15 text-purple-300",
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-[#0f172a]">
      <span className="text-sm text-slate-300">{title}</span>
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorMap[color]}`}>
        {value}
      </span>
    </div>
  );
};

export default EditJob;