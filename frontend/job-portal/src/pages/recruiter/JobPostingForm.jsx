/* eslint-disable react-hooks/refs */
/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  FileText,
  GraduationCap,
  Lightbulb,
  Mail,
  MapPin,
  Sparkles,
  Target,
  Users,
  Wand2,
  X,
  CheckCircle2,
} from "lucide-react";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const API = "http://localhost:5000";

const skillSuggestions = [
  "React",
  "Node.js",
  "MongoDB",
  "Express",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "SQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Redux",
  "Next.js",
  "REST API",
  "GraphQL",
  "Git",
  "GitHub",
  "Postman",
  "Jest",
  "C++",
  "C",
  "Spring Boot",
  "Hibernate",
  "PHP",
  "Laravel",
  "Firebase",
  "Machine Learning",
  "Data Structures",
  "Algorithms",
  "Linux",
  "DevOps",
  "Figma",
  "UI/UX",
  "Communication",
  "Problem Solving",
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
  "Performance Bonus",
  "Internet Reimbursement",
  "Learning Budget",
  "Relocation Assistance",
  "Stock Options",
  "Wellness Program",
];

const industryOptions = [
  "Accounting / Auditing",
  "Advertising / PR / Events",
  "Agriculture / Agro Chemicals",
  "Animation / Gaming / VFX",
  "Architecture / Interior Design",
  "Automobile",
  "Auto Components",
  "Aviation",
  "Banking",
  "Biotechnology",
  "BPM / BPO / Call Center",
  "Building Material",
  "Chemicals",
  "Construction / Engineering",
  "Consulting",
  "Consumer Durables",
  "Courier / Logistics / Supply Chain",
  "Defence / Aerospace",
  "E-commerce",
  "Education / Training",
  "Electrical Equipment",
  "Electronics",
  "Energy / Power",
  "Entertainment / Media",
  "FMCG",
  "Food Processing",
  "Food / Beverage",
  "Gems / Jewellery",
  "Government / Public Sector",
  "Healthcare",
  "Hospital / Medical Services",
  "Hospitality / Hotels",
  "HR / Staffing / Recruitment",
  "Industrial Equipment / Machinery",
  "Information Technology",
  "Insurance",
  "Internet / SaaS",
  "Investment Banking",
  "Iron / Steel",
  "KPO / Research / Analytics",
  "Law / Legal Services",
  "Leather",
  "Management Consulting",
  "Manufacturing",
  "Marine / Shipping",
  "Medical Devices",
  "Mining",
  "NGO / Social Services",
  "Oil / Gas / Petroleum",
  "Packaging",
  "Paper / Forest Products",
  "Pharmaceuticals",
  "Plastics / Rubber",
  "Printing / Publishing",
  "Real Estate",
  "Retail",
  "Semiconductors",
  "Security Services",
  "Sports / Fitness",
  "Telecom",
  "Textile / Apparel",
  "Tourism / Travel",
  "Transportation",
  "Waste Management",
  "Web Development",
  "Software Product",
  "IT Services / Consulting",
  "EdTech",
  "FinTech",
  "HealthTech",
  "AgriTech",
  "RetailTech",
  "TravelTech",
  "AI / Machine Learning",
  "Data Science",
  "Cyber Security",
  "Cloud Computing",
  "Blockchain",
  "AR / VR",
  "Robotics",
  "Embedded Systems",
  "IoT",
  "Consumer Internet",
  "Beauty / Personal Care",
  "Luxury Goods",
  "Furniture / Furnishing",
  "Pet Care",
  "Events / Exhibitions",
  "Broadcasting",
  "Music / Film Production",
  "Digital Marketing",
  "Content / Publishing",
  "Mobility",
  "Renewable Energy",
  "Climate Tech",
  "Space Tech",
  "Procurement",
  "Import / Export",
  "Warehousing",
  "Seminar / Training Services",
  "Laundry / Home Services",
  "Professional Services",
  "Other",
];

const educationOptions = [
  "Any Graduate",
  "B.E / B.Tech",
  "M.E / M.Tech",
  "B.Sc",
  "M.Sc",
  "BCA",
  "MCA",
  "B.Com",
  "M.Com",
  "MBA / PGDM",
  "Diploma",
  "PhD",
  "Any Postgraduate",
];

const departmentOptions = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations",
  "Customer Support",
  "Data Science",
  "Quality Assurance",
  "Business Development",
];

const roleCategoryOptions = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Mobile Development",
  "DevOps",
  "QA / Testing",
  "UI / UX Design",
  "Data Analytics",
  "Data Engineering",
  "Machine Learning",
  "HR Operations",
  "Recruitment",
  "Sales",
  "Marketing",
  "Finance",
  "Customer Success",
];

const companyTypeOptions = [
  "Startup",
  "Mid-size Company",
  "Enterprise",
  "Consultancy",
  "Product Company",
  "Service Company",
  "MNC",
  "Non-Profit",
  "Government",
];

const workModeOptions = ["Remote", "Hybrid", "Onsite"];

const steps = [
  "Company",
  "Job Basics",
  "Requirements",
  "Compensation",
  "Description",
  "Review",
];

const emptyForm = {
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
  minExp: 0,
  maxExp: 5,
  minSalary: 3,
  maxSalary: 12,
  skills: [],
  perks: [],
  responsibilities: [],
  jobDescription: "",
  applyBefore: "",
  contactEmail: "",
};

const chipClass =
  "inline-flex items-center gap-2 rounded-full bg-cyan-500 px-3 py-1 text-sm font-medium text-black";

const panelClass =
  "rounded-3xl border border-slate-800 bg-black/70 p-6 shadow-2xl backdrop-blur-2xl md:p-8";

const inputClass =
  "w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400";

const labelClass = "mb-2 block text-sm font-medium text-slate-300";

function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (command, commandValue = null) => {
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML || "");
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/90">
      <div className="flex flex-wrap gap-2 border-b border-slate-700 p-3">
        {[
          ["Bold", () => exec("bold")],
          ["Italic", () => exec("italic")],
          ["Underline", () => exec("underline")],
          ["UL", () => exec("insertUnorderedList")],
          ["OL", () => exec("insertOrderedList")],
          ["H3", () => exec("formatBlock", "<h3>")],
          ["P", () => exec("formatBlock", "<p>")],
        ].map(([text, fn]) => (
          <button
            key={text}
            type="button"
            onClick={fn}
            className="rounded-xl border border-slate-600 px-3 py-1.5 text-sm text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            {text}
          </button>
        ))}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current?.innerHTML || "")}
        className="min-h-55 w-full px-4 py-4 text-white outline-none"
        style={{ whiteSpace: "pre-wrap" }}
      />
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-500/15 p-2 text-cyan-300">{icon}</div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
    </div>
  );
}

function TextField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly = false,
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`${inputClass} ${readOnly ? "cursor-not-allowed opacity-70" : ""}`}
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, placeholder = "Select" }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <select name={name} value={value} onChange={onChange} className={inputClass}>
        <option value="">{placeholder}</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}

const PostJob = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [skillInput, setSkillInput] = useState("");
  const [perkInput, setPerkInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [posting, setPosting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const skillDropdown = useMemo(() => {
    const query = skillInput.trim().toLowerCase();
    if (!query) return [];
    return skillSuggestions
      .filter(
        (skill) =>
          skill.toLowerCase().includes(query) &&
          !form.skills.some((s) => s.toLowerCase() === skill.toLowerCase())
      )
      .slice(0, 8);
  }, [skillInput, form.skills]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

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

        setForm((prev) => ({
          ...prev,
          companyName: data?.companyName || "",
          contactEmail: data?.email || "",
          industry: data?.industry || "",
        }));
      } catch (err) {
        console.error(err);
        alert("Unable to load recruiter profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSkill = (skill) => {
    const cleaned = skill.trim();
    if (!cleaned) return;
    if (form.skills.some((s) => s.toLowerCase() === cleaned.toLowerCase())) {
      setSkillInput("");
      return;
    }
    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, cleaned],
    }));
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const addPerk = (perk) => {
    const cleaned = perk.trim();
    if (!cleaned) return;
    if (form.perks.some((p) => p.toLowerCase() === cleaned.toLowerCase())) {
      setPerkInput("");
      return;
    }
    setForm((prev) => ({
      ...prev,
      perks: [...prev.perks, cleaned],
    }));
    setPerkInput("");
  };

  const removePerk = (perk) => {
    setForm((prev) => ({
      ...prev,
      perks: prev.perks.filter((p) => p !== perk),
    }));
  };

  const addResponsibility = () => {
    const cleaned = responsibilityInput.trim();
    if (!cleaned) return;
    setForm((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, cleaned],
    }));
    setResponsibilityInput("");
  };

  const removeResponsibility = (item) => {
    setForm((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((r) => r !== item),
    }));
  };

  const generateDescriptionTemplate = () => {
    const expText = `${form.minExp} to ${form.maxExp} years`;
    const salaryText = `₹${form.minSalary} LPA to ₹${form.maxSalary} LPA`;
    const skillsText = form.skills.length ? form.skills.join(", ") : "relevant technical skills";

    return `
      <h3>About the Role</h3>
      <p>We are looking for a <strong>${form.title || "professional"}</strong> to join ${form.companyName || "our company"} in a ${form.workMode || "flexible"} setup. This role belongs to the <strong>${form.department || "team"}</strong> department and will be based in <strong>${form.location || "the assigned location"}</strong>.</p>

      <h3>Key Responsibilities</h3>
      <ul>
        <li>Collaborate with cross-functional teams to deliver high-quality outcomes.</li>
        <li>Take ownership of assigned projects and meet timelines.</li>
        <li>Contribute to continuous improvement in process and execution.</li>
      </ul>

      <h3>Required Skills</h3>
      <p>Candidates should have experience in ${skillsText}.</p>

      <h3>Eligibility</h3>
      <p>Experience required: <strong>${expText}</strong>. Preferred education: <strong>${form.education || "Relevant degree"}</strong>.</p>

      <h3>Compensation & Benefits</h3>
      <p>Salary range: <strong>${salaryText}</strong>. Additional perks and benefits will be provided as per company policy.</p>
    `.trim();
  };

  const handleAIGenerate = async () => {
    setAiLoading(true);

    try {
      const token = localStorage.getItem("token");

      const promptPayload = {
        title: form.title,
        companyName: form.companyName,
        department: form.department,
        roleCategory: form.roleCategory,
        workMode: form.workMode,
        location: form.location,
        minExp: form.minExp,
        maxExp: form.maxExp,
        education: form.education,
        skills: form.skills,
      };

      try {
        const res = await fetch(`${API}/api/ai/generate-job-description`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(promptPayload),
        });

        if (res.ok) {
          const data = await res.json();
          setForm((prev) => ({
            ...prev,
            jobDescription: data?.description || generateDescriptionTemplate(),
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            jobDescription: generateDescriptionTemplate(),
          }));
        }
      } catch {
        setForm((prev) => ({
          ...prev,
          jobDescription: generateDescriptionTemplate(),
        }));
      }
    } finally {
      setAiLoading(false);
    }
  };

  const validateStep = () => {
    if (step === 0) {
      return !!form.companyName && !!form.contactEmail;
    }
    if (step === 1) {
      return !!form.title && !!form.workMode && !!form.department && !!form.location;
    }
    if (step === 2) {
      return !!form.roleCategory && !!form.education && !!form.industry;
    }
    if (step === 3) {
      return Number(form.maxSalary) >= Number(form.minSalary);
    }
    if (step === 4) {
      return !!form.jobDescription && !!form.applyBefore;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) {
      alert("Please complete the required fields in this step.");
      return;
    }
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login required");
      navigate("/recruiter/login");
      return;
    }

    try {
      setPosting(true);

      const payload = {
        ...form,
        minExp: Number(form.minExp),
        maxExp: Number(form.maxExp),
        minSalary: Number(form.minSalary),
        maxSalary: Number(form.maxSalary),
        responsibilities: form.responsibilities.filter(Boolean),
        skills: form.skills,
        perks: form.perks,
      };

      const res = await fetch(`${API}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to post job");
      }

      alert("Job posted successfully");
      navigate("/recruiter/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to post job");
    } finally {
      setPosting(false);
    }
  };

  if (loadingProfile) {
    return (
      <>
        <AnimatedBackground />
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="rounded-3xl border border-slate-800 bg-black/70 px-8 py-10 text-white shadow-2xl backdrop-blur-2xl">
            Loading job posting form...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatedBackground />

      <div className="min-h-screen px-4 py-8 text-white md:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">Post a Job</h1>
              <p className="mt-2 text-slate-300">
                Create a polished job listing with guided steps and smart helpers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/recruiter/dashboard")}
              className="rounded-2xl border border-slate-700 bg-black/50 px-5 py-3 font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              Back to Dashboard
            </button>
          </motion.div>

          <div className="mb-6 rounded-3xl border border-slate-800 bg-black/60 p-5 backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
              {steps.map((item, index) => {
                const active = index === step;
                const done = index < step;
                return (
                  <div
                    key={item}
                    className={`rounded-2xl border px-4 py-3 text-center text-sm font-medium transition ${
                      active
                        ? "border-cyan-400 bg-cyan-500/15 text-cyan-300"
                        : done
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                        : "border-slate-700 bg-slate-900/60 text-slate-400"
                    }`}
                  >
                    <div className="mb-1">{done ? <CheckCircle2 className="mx-auto h-4 w-4" /> : index + 1}</div>
                    <div>{item}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <div className={panelClass}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                >
                  {step === 0 && (
                    <div>
                      <SectionTitle
                        icon={<Building2 size={20} />}
                        title="Company Details"
                        subtitle="Start with recruiter and company information."
                      />

                      <div className="grid gap-5 md:grid-cols-2">
                        <TextField
                          label="Company Name"
                          name="companyName"
                          value={form.companyName}
                          onChange={handleChange}
                          placeholder="Company name"
                          readOnly
                        />

                        <TextField
                          label="Consultancy Name"
                          name="consultancyName"
                          value={form.consultancyName}
                          onChange={handleChange}
                          placeholder="Consultancy name"
                        />

                        <TextField
                          label="Hiring For"
                          name="hiringFor"
                          value={form.hiringFor}
                          onChange={handleChange}
                          placeholder="Hiring for company / client"
                        />

                        <TextField
                          label="Contact Email"
                          name="contactEmail"
                          value={form.contactEmail}
                          onChange={handleChange}
                          placeholder="Contact email"
                          readOnly
                        />

                        <SelectField
                          label="Company Type"
                          name="companyType"
                          value={form.companyType}
                          onChange={handleChange}
                          options={companyTypeOptions}
                          placeholder="Select company type"
                        />
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div>
                      <SectionTitle
                        icon={<Briefcase size={20} />}
                        title="Job Basics"
                        subtitle="Define the role and how candidates will work."
                      />

                      <div className="grid gap-5 md:grid-cols-2">
                        <TextField
                          label="Job Title"
                          name="title"
                          value={form.title}
                          onChange={handleChange}
                          placeholder="e.g. Full Stack Developer"
                        />

                        <SelectField
                          label="Work Mode"
                          name="workMode"
                          value={form.workMode}
                          onChange={handleChange}
                          options={workModeOptions}
                          placeholder="Select work mode"
                        />

                        <SelectField
                          label="Department"
                          name="department"
                          value={form.department}
                          onChange={handleChange}
                          options={departmentOptions}
                          placeholder="Select department"
                        />

                        <TextField
                          label="Location"
                          name="location"
                          value={form.location}
                          onChange={handleChange}
                          placeholder="e.g. Chennai / Remote"
                        />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <SectionTitle
                        icon={<Target size={20} />}
                        title="Requirements"
                        subtitle="Specify role category, education, industry and skills."
                      />

                      <div className="grid gap-5 md:grid-cols-2">
                        <SelectField
                          label="Role Category"
                          name="roleCategory"
                          value={form.roleCategory}
                          onChange={handleChange}
                          options={roleCategoryOptions}
                          placeholder="Select role category"
                        />

                        <SelectField
                          label="Education"
                          name="education"
                          value={form.education}
                          onChange={handleChange}
                          options={educationOptions}
                          placeholder="Select education"
                        />

                        <div className="md:col-span-2">
                          <SelectField
                            label="Industry"
                            name="industry"
                            value={form.industry}
                            onChange={handleChange}
                            options={industryOptions}
                            placeholder="Select industry"
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className={labelClass}>Required Skills</label>

                        <div className="relative">
                          <input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addSkill(skillInput);
                              }
                            }}
                            placeholder="Type a skill"
                            className={inputClass}
                          />

                          {skillDropdown.length > 0 && (
                            <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl">
                              {skillDropdown.map((skill) => (
                                <button
                                  key={skill}
                                  type="button"
                                  onClick={() => addSkill(skill)}
                                  className="block w-full border-b border-slate-800 px-4 py-3 text-left text-sm text-slate-200 transition last:border-b-0 hover:bg-slate-900 hover:text-cyan-300"
                                >
                                  {skill}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {skillSuggestions.slice(0, 12).map((skill) => (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => addSkill(skill)}
                              className="rounded-xl border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:border-cyan-400 hover:bg-cyan-500 hover:text-black"
                            >
                              + {skill}
                            </button>
                          ))}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {form.skills.map((skill) => (
                            <span key={skill} className={chipClass}>
                              {skill}
                              <button type="button" onClick={() => removeSkill(skill)}>
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <SectionTitle
                        icon={<CircleDollarSign size={20} />}
                        title="Experience & Compensation"
                        subtitle="Set experience expectations and salary range."
                      />

                      <div className="grid gap-8 md:grid-cols-2">
                        <div>
                          <label className={labelClass}>
                            Experience Range: {form.minExp} to {form.maxExp} years
                          </label>
                          <div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
                            <div>
                              <div className="mb-2 text-sm text-slate-400">Minimum Experience</div>
                              <input
                                type="range"
                                min="0"
                                max="15"
                                step="1"
                                name="minExp"
                                value={form.minExp}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  setForm((prev) => ({
                                    ...prev,
                                    minExp: value,
                                    maxExp: value > Number(prev.maxExp) ? value : prev.maxExp,
                                  }));
                                }}
                                className="w-full"
                              />
                            </div>

                            <div>
                              <div className="mb-2 text-sm text-slate-400">Maximum Experience</div>
                              <input
                                type="range"
                                min="0"
                                max="20"
                                step="1"
                                name="maxExp"
                                value={form.maxExp}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  setForm((prev) => ({
                                    ...prev,
                                    maxExp: value < Number(prev.minExp) ? prev.minExp : value,
                                  }));
                                }}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>
                            Salary Range: ₹{form.minSalary} LPA to ₹{form.maxSalary} LPA
                          </label>
                          <div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
                            <div>
                              <div className="mb-2 text-sm text-slate-400">Minimum Salary</div>
                              <input
                                type="range"
                                min="1"
                                max="50"
                                step="1"
                                name="minSalary"
                                value={form.minSalary}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  setForm((prev) => ({
                                    ...prev,
                                    minSalary: value,
                                    maxSalary: value > Number(prev.maxSalary) ? value : prev.maxSalary,
                                  }));
                                }}
                                className="w-full"
                              />
                            </div>

                            <div>
                              <div className="mb-2 text-sm text-slate-400">Maximum Salary</div>
                              <input
                                type="range"
                                min="1"
                                max="80"
                                step="1"
                                name="maxSalary"
                                value={form.maxSalary}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  setForm((prev) => ({
                                    ...prev,
                                    maxSalary: value < Number(prev.minSalary) ? prev.minSalary : value,
                                  }));
                                }}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className={labelClass}>Perks & Benefits</label>
                        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                          <input
                            value={perkInput}
                            onChange={(e) => setPerkInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addPerk(perkInput);
                              }
                            }}
                            placeholder="Add a custom perk"
                            className={inputClass}
                          />
                          <button
                            type="button"
                            onClick={() => addPerk(perkInput)}
                            className="rounded-2xl bg-teal-500 px-5 py-3 font-semibold text-black transition hover:bg-teal-400"
                          >
                            Add Perk
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {perkSuggestions.map((perk) => (
                            <button
                              key={perk}
                              type="button"
                              onClick={() => addPerk(perk)}
                              className="rounded-xl border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:border-teal-400 hover:bg-teal-500 hover:text-black"
                            >
                              + {perk}
                            </button>
                          ))}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {form.perks.map((perk) => (
                            <span key={perk} className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-3 py-1 text-sm font-medium text-black">
                              {perk}
                              <button type="button" onClick={() => removePerk(perk)}>
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div>
                      <SectionTitle
                        icon={<FileText size={20} />}
                        title="Job Description"
                        subtitle="Write a polished description and key responsibilities."
                      />

                      <div className="mb-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={handleAIGenerate}
                          disabled={aiLoading}
                          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-60"
                        >
                          <Sparkles size={18} />
                          {aiLoading ? "Generating..." : "AI Job Description Generator"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              jobDescription: "",
                            }))
                          }
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 font-medium text-slate-200 transition hover:border-slate-500"
                        >
                          <Wand2 size={18} />
                          Clear Editor
                        </button>
                      </div>

                      <label className={labelClass}>Rich Text Editor</label>
                      <RichTextEditor
                        value={form.jobDescription}
                        onChange={(html) =>
                          setForm((prev) => ({
                            ...prev,
                            jobDescription: html,
                          }))
                        }
                      />

                      <div className="mt-6">
                        <label className={labelClass}>Responsibilities</label>
                        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                          <input
                            value={responsibilityInput}
                            onChange={(e) => setResponsibilityInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addResponsibility();
                              }
                            }}
                            placeholder="Add one responsibility"
                            className={inputClass}
                          />
                          <button
                            type="button"
                            onClick={addResponsibility}
                            className="rounded-2xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400"
                          >
                            Add
                          </button>
                        </div>

                        <div className="mt-4 space-y-2">
                          {form.responsibilities.map((item) => (
                            <div
                              key={item}
                              className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3"
                            >
                              <span className="text-slate-200">{item}</span>
                              <button
                                type="button"
                                onClick={() => removeResponsibility(item)}
                                className="text-slate-400 transition hover:text-red-400"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 grid gap-5 md:grid-cols-2">
                        <TextField
                          label="Apply Before"
                          name="applyBefore"
                          value={form.applyBefore}
                          onChange={handleChange}
                          type="date"
                        />
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div>
                      <SectionTitle
                        icon={<Lightbulb size={20} />}
                        title="Review & Submit"
                        subtitle="Check the job summary before posting."
                      />

                      <div className="grid gap-5 md:grid-cols-2">
                        <SummaryCard title="Company" items={[
                          ["Company Name", form.companyName],
                          ["Consultancy Name", form.consultancyName || "-"],
                          ["Hiring For", form.hiringFor || "-"],
                          ["Contact Email", form.contactEmail],
                          ["Company Type", form.companyType || "-"],
                        ]} />

                        <SummaryCard title="Job Basics" items={[
                          ["Title", form.title],
                          ["Work Mode", form.workMode],
                          ["Department", form.department],
                          ["Location", form.location],
                          ["Role Category", form.roleCategory],
                        ]} />

                        <SummaryCard title="Requirements" items={[
                          ["Education", form.education],
                          ["Industry", form.industry],
                          ["Experience", `${form.minExp} - ${form.maxExp} years`],
                          ["Skills Count", String(form.skills.length)],
                          ["Perks Count", String(form.perks.length)],
                        ]} />

                        <SummaryCard title="Compensation" items={[
                          ["Salary", `₹${form.minSalary} - ₹${form.maxSalary} LPA`],
                          ["Apply Before", form.applyBefore],
                          ["Responsibilities", String(form.responsibilities.length)],
                        ]} />
                      </div>

                      <div className="mt-6 rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
                        <h3 className="mb-3 text-lg font-semibold text-white">Description Preview</h3>
                        <div
                          className="prose prose-invert max-w-none text-slate-200"
                          dangerouslySetInnerHTML={{ __html: form.jobDescription || "<p>No description added yet.</p>" }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 px-5 py-3 font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={posting}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-500 to-teal-500 px-6 py-3 font-semibold text-black transition hover:from-cyan-400 hover:to-teal-400 disabled:opacity-60"
                  >
                    <CheckCircle2 size={18} />
                    {posting ? "Posting..." : "Post Job"}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className={panelClass}>
                <SectionTitle
                  icon={<Sparkles size={20} />}
                  title="Smart Helpers"
                  subtitle="Quick tips to create a strong job listing."
                />

                <div className="space-y-4 text-sm text-slate-300">
                  <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                    <div className="mb-1 font-semibold text-white">Skill Suggestions</div>
                    Use 5 to 10 focused skills instead of adding every technology.
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                    <div className="mb-1 font-semibold text-white">Salary Slider</div>
                    Keep a realistic range to improve candidate conversion.
                  </div>

                  <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                    <div className="mb-1 font-semibold text-white">AI Description</div>
                    Generate a draft, then edit it to match your exact needs.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function SummaryCard({ title, items }) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
      <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
      <div className="space-y-3">
        {items.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 text-sm">
            <span className="text-slate-400">{label}</span>
            <span className="text-right text-slate-200">{value || "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SnapshotRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-700 bg-slate-900/70 p-3">
      <div className="mt-0.5 text-cyan-300">{icon}</div>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
        <div className="wrap-break-word text-slate-200">{value}</div>
      </div>
    </div>
  );
}

export default PostJob;