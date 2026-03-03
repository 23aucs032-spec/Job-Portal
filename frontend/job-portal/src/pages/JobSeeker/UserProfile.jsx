/* eslint-disable react-hooks/refs */
/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Camera,
  CheckCircle2,
  X,
  FileText,
  Download,
  Upload,
  Briefcase,
  Plus,     
  Trash2  
} from "lucide-react";
import CareerPreferenceModal from "../../components/ProfilePage/CareerPreferenceModal";
import EducationModal from "../../components/ProfilePage/EducationModal";
import SkillsModal from "../../components/ProfilePage/SkillsModal";
import LanguagesModal from "../../components/ProfilePage/LanguagesModal";
import InternshipsModal from "../../components/ProfilePage/InternshipsModal";
import ProjectsModal from "../../components/ProfilePage/ProjectsModal";
import AcademicAchievements from "../../components/ProfilePage/AcademicAchievements";
import EmploymentModal from "../../components/ProfilePage/Employment";

const ProfilePageDark = () => {
  // ================= PROFILE STATE =================
  const [profileImage, setProfileImage] = useState(null);
  const [profileSummary, setProfileSummary] = useState("");
  const [achievements, setAchievements] = useState([]);
  const [profile, setProfile] = useState({
    name: "Karthik",
    degree: "B.Sc - Bachelor of Science",
    college: "Virudhunagar Hindu Nadars' College (VHNSNC)",
    location: "Virudhunagar",
    mobile: "9025555530",
    email: "23aucs032@vhnsnc.edu",
    dob: "15/09/2005",
    gender: "Male",
    completion: 40,
  });

const [preferences, setPreferences] = useState({
  types: ["Full Time", "Internship"],
  availability: "Immediate",
  locations: ["Chennai", "Bangalore"],
});


  const education = {
    course: "B.Sc Computer Science",
    specialization: "Artificial Intelligence",
    college: "Virudhunagar Hindu Nadars' College",
    university: "Madurai Kamaraj University",
  };

  // ================= EDUCATION STATE =================
const [educationList, setEducationList] = useState([]);

const [courseName, setCourseName] = useState("");
const [otherCourse, setOtherCourse] = useState("");
const [specialization, setSpecialization] = useState("");
const [otherSpecialization, setOtherSpecialization] = useState("");
const [collegeName, setCollegeName] = useState("");
const [selectedGrading, setSelectedGrading] = useState("");
const [selectedCourseType, setSelectedCourseType] = useState("");
const [startYear, setStartYear] = useState("2023");
const [endYear, setEndYear] = useState("2026");

  const [skills, setSkills] = useState([]);
const [resume, setResume] = useState({
  name: "",
  uploaded: "",
  url: ""
});
const fileInputRef = useRef(null);
const handleResumeUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const uploadedResume = {
    name: file.name,
    uploaded: new Date().toLocaleDateString(),
    url: URL.createObjectURL(file),
  };

  setResume(uploadedResume);
};
const handleDeleteResume = () => {
  setResume(null);
};
  
const [languages, setLanguages] = useState([]);

  // ================= MODAL STATE =================
const [modals, setModals] = useState({
  personalDetails: false,
  preference: false,
  education: false,
  skills: false,
  languages: false, // ✅ important
});
const [preferenceForm, setPreferenceForm] = useState(preferences);

  // Profile form data
const [formData, setFormData] = useState(profile);




  const openPreferenceModal = () => {
  setPreferenceForm(preferences);
  openModal("preference");
};

const handlePreferenceSave = () => {
  setPreferences(preferenceForm);
  closeModal("preference");
};

  const openModal = (modal) =>
    setModals({ ...modals, [modal]: true });

  const closeModal = (modal) =>
    setModals({ ...modals, [modal]: false });

  const handleSave = () => {
    setProfile(formData);
    closeModal("personalDetails");
  };

  // ================= IMAGE UPLOAD =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // ================= SECTION REFS =================
  const sectionsRef = {
    Preference: useRef(null),
    Education: useRef(null),
    KeySkills: useRef(null),
    Languages: useRef(null),
    Internships: useRef(null),
    Projects: useRef(null),
    "Profile Summary": useRef(null),
    "CompetitiveExams": useRef(null),
    Employment: useRef(null),
    "Academic Achievements": useRef(null),
    Resume: useRef(null),

  };

  const quickLinks = Object.keys(sectionsRef);

  const scrollToSection = (section) => {
    sectionsRef[section]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

const [showInternshipModal, setShowInternshipModal] = useState(false);
const [internships, setInternships] = useState([]);
const [editingIndex, setEditingIndex] = useState(null);
const [showProjectModal, setShowProjectModal] = useState(false);
const [projects, setProjects] = useState([]);
const [editingProjectIndex, setEditingProjectIndex] = useState(null);
// Competitive Exams State
const [competitiveExams, setCompetitiveExams] = useState([]);
const [showExamModal, setShowExamModal] = useState(false);
const [editingExamIndex, setEditingExamIndex] = useState(null);
const [examForm, setExamForm] = useState({
  examName: "",
  score: "",
  year: "",
  rank: "",
});

// Handlers
const handleSaveExam = (data) => {
  if (editingExamIndex !== null) {
    const updated = [...competitiveExams];
    updated[editingExamIndex] = data;
    setCompetitiveExams(updated);
    setEditingExamIndex(null);
  } else {
    setCompetitiveExams([...competitiveExams, data]);
  }
  setShowExamModal(false);
};

const handleEditExam = (index) => {
  setEditingExamIndex(index);
  setExamForm(competitiveExams[index]);
  setShowExamModal(true);
};

const handleDeleteExam = (index) => {
  setCompetitiveExams(competitiveExams.filter((_, i) => i !== index));
};

// ================= EMPLOYMENT STATE =================
const [employments, setEmployments] = useState([]);
const [showEmploymentModal, setShowEmploymentModal] = useState(false);
const [editingEmploymentIndex, setEditingEmploymentIndex] = useState(null);

const [employmentForm, setEmploymentForm] = useState({
  role: "",
  company: "",
  fromMonth: "",
  fromYear: "",
  toMonth: "",
  toYear: "",
  currentlyWorking: false,
  description: "",
});
// Open Add Modal
const handleAddEmployment = () => {
  setEmploymentForm({
    role: "",
    company: "",
    fromMonth: "",
    fromYear: "",
    toMonth: "",
    toYear: "",
    currentlyWorking: false,
    description: "",
  });
  setEditingEmploymentIndex(null);
  setShowEmploymentModal(true);
};

// Save Employment
const handleSaveEmployment = (formData) => {
  if (editingEmploymentIndex !== null) {
    const updated = [...employments];
    updated[editingEmploymentIndex] = formData;
    setEmployments(updated);
  } else {
    setEmployments([...employments, formData]);
  }

  setShowEmploymentModal(false);
};

// Edit Employment
const handleEditEmployment = (index) => {
  setEmploymentForm(employments[index]);
  setEditingEmploymentIndex(index);
  setShowEmploymentModal(true);
};

// Delete Employment
const handleDeleteEmployment = (index) => {
  const updated = employments.filter((_, i) => i !== index);
  setEmployments(updated);
};


const handleSaveInternship = (data) => {
  if (editingIndex !== null) {
    const updated = [...internships];
    updated[editingIndex] = data;
    setInternships(updated);
    setEditingIndex(null);
  } else {
    setInternships((prev) => [...prev, data]);
  }
};
const handleEditInternship = (index) => {
  setEditingIndex(index);
  setShowInternshipModal(true);
};
const handleDeleteInternship = (index) => {
  const updated = internships.filter((_, i) => i !== index);
  setInternships(updated);
};

const handleSaveProject = (data) => {
  if (editingProjectIndex !== null) {
    const updated = [...projects];
    updated[editingProjectIndex] = data;
    setProjects(updated);
    setEditingProjectIndex(null);
  } else {
    setProjects((prev) => [...prev, data]);
  }
};
const handleDeleteProject = (index) => {
  const updated = projects.filter((_, i) => i !== index);
  setProjects(updated);
};

  // ================= ANIMATIONS =================
const modalVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3 },
  },
  exit: { opacity: 0, y: 50, scale: 0.95 },
};

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-gray-300 px-10 py-6">

      {/* ================= PROFILE HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row gap-6">

          {/* Profile Picture */}
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full border-4 border-red-600 overflow-hidden">
              <img
  src={profileImage || "https://ui-avatars.com/api/?name=KP&background=222&color=fff"}
  alt="Profile"
  onError={(e) => {
    e.target.src = "/default-avatar.png"; // fallback local image
  }}
/>
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profile-upload"
              onChange={handleImageChange}
            />

            <label
              htmlFor="profile-upload"
              className="absolute -bottom-1 right-1 bg-blue-600 p-2 rounded-full cursor-pointer"
            >
              <Camera size={16} className="text-white" />
            </label>

            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0d1117] px-4 py-1 text-sm font-bold rounded-full border border-gray-700">
              {profile.completion}%
            </div>
          </div>

          {/* Main Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white">
                {profile.name}
              </h1>
              <Edit2
                size={18}
                onClick={() => {
                  setFormData(profile);
                  openModal("personalDetails");
                }}
                className="text-gray-400 hover:text-blue-400 cursor-pointer"
              />
            </div>

            <p className="text-lg text-gray-300 mt-2">{profile.degree}</p>
            <p className="text-gray-400">{profile.college}</p>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={14} /> {profile.location}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} /> {profile.mobile}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} /> {profile.dob}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} /> {profile.email}
                <CheckCircle2 size={14} className="text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ================= QUICK LINKS + CONTENT ================= */}
      <div className="grid grid-cols-12 gap-8">

        {/* Left Sidebar */}
        <div className="col-span-3">
          <div className="bg-[#111827] border border-gray-800 rounded-xl p-6 sticky top-6">
            <h3 className="text-white font-semibold mb-4">
              Quick links
            </h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((item, index) => (
                <li
                  key={index}
                  onClick={() => scrollToSection(item)}
                  className="hover:text-white cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Sections */}
        <div className="col-span-9">
          <motion.main
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            
            
            
{/* Career Preferences */}
<motion.section
  ref={sectionsRef.Preference}
  variants={sectionVariants}
  className="bg-[#161b22] border border-gray-800 rounded-xl p-6"
>
  {/* Header Row */}
  <div className="flex justify-between items-start mb-6">
    
    {/* Left Side */}
    <div>
      <h2 className="text-lg font-semibold text-white">
        Add Career Preferences
      </h2>
      <p className="text-sm text-gray-400 mt-1">
        Tell recruiters what kind of jobs you are looking for
      </p>
    </div>

    {/* Right Corner - Add Button */}
    <div
  onClick={openPreferenceModal}
  className="flex items-center gap-2 text-blue-400 cursor-pointer hover:text-blue-300 transition"
>
      <span className="text-sm font-medium">Add</span>

      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>
    </div>
    <CareerPreferenceModal
  modals={modals}
  closeModal={closeModal}
  modalVariants={modalVariants}
  preferenceForm={preferenceForm}
  setPreferenceForm={setPreferenceForm}
  handlePreferenceSave={handlePreferenceSave}
/>

  </div>

  {/* Existing Details (UNCHANGED) */}
  <div className="grid md:grid-cols-3 gap-6 text-sm">
    <div>
      <p className="text-gray-500">Preferred job type</p>
      <p>{preferences.types.join(" & ")}</p>
    </div>

    <div>
      <p className="text-gray-500">Availability</p>
      <p className="text-green-400">{preferences.availability}</p>
    </div>

    <div>
      <p className="text-gray-500">Preferred locations</p>
      <p>{preferences.locations.join(" • ")}</p>
    </div>
  </div>
</motion.section>

            {/* ================= EDUCATION SECTION ================= */}
<motion.section
  ref={sectionsRef.Education}
  variants={sectionVariants}
  className="bg-[#161b22] border border-gray-800 rounded-xl p-6"
>
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold text-white">Education</h2>

    {/* Add Education Button */}
    <button
      onClick={() => openModal("education")}
      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
    >
      <Edit2 size={16} />
      Add Education
    </button>
          <EducationModal
  modals={modals}
  closeModal={closeModal}
  modalVariants={modalVariants}
  courseName={courseName}
  setCourseName={setCourseName}
  otherCourse={otherCourse}
  setOtherCourse={setOtherCourse}
  specialization={specialization}
  setSpecialization={setSpecialization}
  otherSpecialization={otherSpecialization}
  setOtherSpecialization={setOtherSpecialization}
  collegeName={collegeName}
  setCollegeName={setCollegeName}
  selectedGrading={selectedGrading}
  setSelectedGrading={setSelectedGrading}
  selectedCourseType={selectedCourseType}
  setSelectedCourseType={setSelectedCourseType}
  startYear={startYear}
  setStartYear={setStartYear}
  endYear={endYear}
  setEndYear={setEndYear}
  educationList={educationList}
  setEducationList={setEducationList}
/>
  </div>

  {educationList.length === 0 ? (
    <p className="text-gray-400 text-sm">
      No education details added yet.
    </p>
  ) : (
    <div className="space-y-4">
      {educationList.map((edu, index) => (
        <div
          key={index}
          className="bg-[#0d1117] p-4 rounded-lg border border-gray-700"
        >
          <h3 className="text-white font-medium">
            {edu.course}
          </h3>
          <p className="text-gray-400 text-sm">
            {edu.specialization}
          </p>
          <p className="text-gray-400 text-sm">
            {edu.college}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {edu.startYear} - {edu.endYear} • {edu.courseType}
          </p>
        </div>
      ))}


    </div>
  )}
</motion.section>

{/* ================= Skills ================= */}
<motion.section
  ref={sectionsRef.KeySkills}
  variants={sectionVariants}
  className="bg-[#161b22] border border-gray-800 rounded-xl p-6"
>
  {/* Header Row */}
  <div className="flex justify-between items-start mb-6">

    {/* Title */}
    <h2 className="text-xl font-semibold text-white">
      Key Skills
    </h2>

    {/* Add Button */}
    <button
      onClick={() => openModal("skills")}
      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
    >
      <span className="text-sm font-medium">Add</span>

      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>
    </button>
    <SkillsModal
  modals={modals}
  closeModal={closeModal}
  modalVariants={modalVariants}
  skills={skills}
  setSkills={setSkills}
/>
  </div>

  {/* Skills List */}
  {skills.length === 0 ? (
    <p className="text-gray-400 text-sm">
      No skills added yet.
    </p>
  ) : (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className="bg-gray-800 px-4 py-2 rounded-full text-sm border border-gray-700 text-gray-200"
        >
          {skill}
        </span>
      ))}
    </div>
  )}
</motion.section>

{/* Languages */}
<motion.section
  ref={sectionsRef.Languages}
  variants={sectionVariants}
  className="bg-[#161b22] border border-gray-800 rounded-xl p-6"
>
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-semibold text-white">
      Languages
    </h2>

    <button
      onClick={() => openModal("languages")}
      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
    >
      <span className="text-sm font-medium">Add</span>
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500">
        +
      </div>
    </button>
    <LanguagesModal
  modals={modals}
  closeModal={closeModal}
  modalVariants={modalVariants}
  languages={languages}
  setLanguages={setLanguages}
/>
  </div>

  {languages.length === 0 ? (
    <p className="text-gray-400 text-sm">
      No languages added yet.
    </p>
  ) : (
    <div className="flex flex-wrap gap-2">
      {languages.map((lang) => (
        <span
          key={lang}
          className="bg-gray-800 px-4 py-2 rounded-full text-sm border border-gray-700 text-gray-200"
        >
          {lang}
        </span>
      ))}
    </div>
    
  )}
</motion.section>

{/* Internships Section */}
<motion.section
  ref={sectionsRef.Internships}
  variants={sectionVariants}
  className="bg-[#161b22] border border-gray-800 rounded-xl p-6"
>
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-semibold text-white">
      Internships
    </h2>

    <button
      onClick={() => {
        setEditingIndex(null);
        setShowInternshipModal(true);
      }}
      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
    >
      + Add
    </button>
    <InternshipsModal
  isOpen={showInternshipModal}
  onClose={() => {
    setShowInternshipModal(false);
    setEditingIndex(null);
  }}
  modalVariants={modalVariants}
  onSave={handleSaveInternship}
  initialData={
    editingIndex !== null
      ? internships[editingIndex]
      : null
  }
/>
  </div>

  {internships.length === 0 ? (
    <p className="text-gray-500 text-sm">
      No internships added yet.
    </p>
  ) : (
    <div className="space-y-6">
      {internships.map((item, index) => (
        <div
          key={index}
          className="border border-gray-700 rounded-lg p-5 bg-[#1c2128] relative"
        >
          {/* Edit/Delete Buttons */}
          <div className="absolute top-4 right-4 flex gap-4">
            <button
              onClick={() => handleEditInternship(index)}
              className="text-blue-400 text-sm hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteInternship(index)}
              className="text-red-400 text-sm hover:underline"
            >
              Delete
            </button>
          </div>

          <h3 className="text-white font-semibold text-lg">
            {item.project}
          </h3>

          <p className="text-gray-400 text-sm">
            {item.company}
          </p>

          <p className="text-gray-500 text-xs mt-1">
            {item.fromMonth} {item.fromYear} - {item.toMonth} {item.toYear}
          </p>

          <p className="text-gray-300 text-sm mt-3 leading-relaxed">
            {item.description}
          </p>

          {item.skills && (
            <div className="flex flex-wrap gap-2 mt-3">
              {item.skills.split(",").map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-600/20 text-blue-400 px-3 py-1 text-xs rounded-full"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          )}

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-sm mt-3 inline-block hover:underline"
            >
              View Project →
            </a>
          )}
        </div>
      ))}
    </div>
  )}
</motion.section>

{/* Projects Section - Profile Display */}
<motion.section
  ref={sectionsRef.Projects}
  variants={sectionVariants}
  className="bg-[#161b22] border border-gray-800 rounded-xl p-6"
>
  {/* Header Row */}
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-semibold text-white">Projects</h2>

    {/* Add Project Button */}
    <button
      onClick={() => {
        setEditingProjectIndex(null); // reset edit
        setShowProjectModal(true);    // open project modal
      }}
      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
    >
      <span>+ Add</span>
      <div className="w-6 h-6 flex items-center justify-center bg-blue-600 rounded-full hover:bg-blue-500 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>
    </button>
  </div>

  {/* Projects List */}
  {projects.length === 0 ? (
    <p className="text-gray-500 text-sm">No projects added yet.</p>
  ) : (
    <div className="space-y-4">
      {projects.map((project, index) => (
        <div
          key={index}
          className="bg-[#1c2128] border border-gray-700 rounded-lg p-5 relative"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-white font-semibold text-lg">{project.name}</h3>
            <div className="flex gap-2">
              <button
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                onClick={() => {
                  setEditingProjectIndex(index);
                  setShowProjectModal(true);
                }}
              >
                Edit
              </button>
              <button
                className="text-red-400 hover:text-red-500 text-sm font-medium"
                onClick={() => {
                  const updated = [...projects];
                  updated.splice(index, 1);
                  setProjects(updated);
                }}
              >
                Delete
              </button>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            {project.startMonth} {project.startYear} - {project.endMonth} {project.endYear}
          </p>
          <p className="text-gray-300 text-sm mt-3">{project.description}</p>
          {project.learnings && (
            <p className="text-gray-300 text-sm mt-2">
              <span className="font-medium">Learnings:</span> {project.learnings}
            </p>
          )}
{project.skills && Array.isArray(project.skills) && project.skills.length > 0 && (
  <div className="flex flex-wrap gap-2 mt-3">
    {project.skills.map((skill, i) => (
      <span
        key={i}
        className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-xs border border-gray-600"
      >
        {skill}
      </span>
    ))}
  </div>
)}
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-sm mt-3 inline-block hover:text-blue-300"
            >
              View Project
            </a>
          )}
        </div>
      ))}
    </div>
  )}

  {/* Projects Modal - always rendered */}
  <ProjectsModal
    isOpen={showProjectModal}
    onClose={() => {
      setShowProjectModal(false);
      setEditingProjectIndex(null);
    }}
    onSave={handleSaveProject}
    modalVariants={modalVariants}
    initialData={editingProjectIndex !== null ? projects[editingProjectIndex] : null}
  />
</motion.section>

{/* ================= Profile Summary ================= */}
<motion.section
  ref={sectionsRef["Profile Summary"]}
  variants={sectionVariants}
  initial="hidden"
  animate="visible"
  className="bg-[#161b22] border border-gray-800 rounded-xl p-6"
>
  {/* Header Row */}
  <div className="flex justify-between items-start mb-4">
    {/* Left Side Title */}
    <h2 className="text-xl font-semibold text-white">Profile Summary</h2>

    {/* Right Corner - Add/Edit Button */}
    <div
      className="flex items-center gap-2 text-blue-400 cursor-pointer hover:text-blue-300 transition"
      onClick={() => openModal("summary")}
    >
      <span className="text-sm font-medium">{profileSummary ? "Edit" : "Add"}</span>
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </div>
    </div>
  </div>

  {/* Displayed Summary */}
  <p className="text-sm text-gray-300 leading-relaxed">
    {profileSummary || "No profile summary added yet."}
  </p>
</motion.section>

{/* ================= Profile Summary Modal ================= */}
{modals.summary && (
  <motion.div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-[#161b22] rounded-2xl w-full max-w-2xl p-6 sm:p-8 border border-gray-700 relative shadow-2xl"
    >
      {/* Close button */}
      <X
        className="absolute right-5 top-5 cursor-pointer text-gray-400 hover:text-white"
        size={24}
        onClick={() => closeModal("summary")}
      />

      <h2 className="text-2xl font-bold text-white mb-2">Profile summary</h2>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
        Your profile summary should mention the highlights of your career and education, what your professional interests are, and what kind of career you are looking for. Write a meaningful summary of more than 50 characters.
      </p>

      <div className="space-y-4">
        {/* Summary textarea with character count */}
        <div className="relative">
          <textarea
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition min-h-45 resize-y"
            placeholder="Type here"
            maxLength={1000}
            value={profileSummary}
            onChange={(e) => setProfileSummary(e.target.value)}
          />
          {/* Character counter */}
          <div className="absolute bottom-3 right-4 text-xs text-gray-500">
            {profileSummary.length}/1000
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-end items-center gap-6 mt-10 pt-6 border-t border-gray-700">
        <button
          className="text-gray-400 hover:text-gray-200 text-sm font-medium"
          onClick={() => closeModal("summary")}
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-500 px-10 py-3 rounded-lg font-medium text-white shadow-md transition"
          onClick={() => {
            // Save button: profileSummary is already updated via state
            closeModal("summary");
          }}
        >
          Save
        </button>
      </div>
    </motion.div>
  </motion.div>
)}

      {/* Academic Achievements / Accomplishments Section */}
      <motion.section
        ref={sectionsRef["Academic Achievements"]}
        variants={sectionVariants}
        className="bg-[#161b22] border border-gray-800 rounded-xl p-6"
      >
        {/* Header Row */}
        <div className="flex justify-between items-start mb-4">

          {/* Left Side Title */}
          <h2 className="text-xl font-semibold text-white">
            Academic Achievements / Accomplishments
          </h2>

          {/* Right Corner - Add Button */}
          <div
            className="flex items-center gap-2 text-blue-400 cursor-pointer hover:text-blue-300 transition"
            onClick={() => openModal("accomplishments")}
          >
            <span className="text-sm font-medium">Add</span>

            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          </div>

        </div>

        {/* Existing Achievements List */}
        <div className="space-y-3">
          {achievements.length > 0 ? (
            achievements.map((item, index) => (
              <div
                key={index}
                className="text-sm text-gray-300 border-b border-gray-800 pb-2 last:border-none"
              >
                {item}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-sm">No academic achievements added yet.</div>
          )}
        </div>
      </motion.section>

      {/* Academic Achievements Modal */}
      <AcademicAchievements
        modals={modals}
        closeModal={closeModal}
        onSave={(data) => setAchievements(data)}
      />

{/* Competitive Exams */}
<motion.section
  ref={sectionsRef.CompetitiveExams}
  variants={sectionVariants}
  className="bg-[#161b22] border border-gray-800 rounded-xl p-6"
>
  {/* Header */}
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold text-white">Competitive Exams</h2>
    <button
      onClick={() => {
        setEditingExamIndex(null);
        setExamForm({
          examName: "",
          score: "",
          year: "",
          rank: "",
        });
        setShowExamModal(true);
      }}
      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
    >
      + Add
    </button>
  </div>

  {/* List */}
  {competitiveExams.length === 0 ? (
    <p className="text-gray-500 text-sm">No competitive exams added yet.</p>
  ) : (
    <div className="space-y-4">
      {competitiveExams.map((exam, index) => (
        <div key={index} className="border border-gray-700 p-4 rounded-lg bg-[#1c2128] relative">
          <div className="absolute top-4 right-4 flex gap-3">
            <button
              onClick={() => handleEditExam(index)}
              className="text-blue-400 text-sm hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteExam(index)}
              className="text-red-400 text-sm hover:underline"
            >
              Delete
            </button>
          </div>

          <p className="text-lg font-semibold text-white">{exam.examName}</p>
          <p className="text-gray-400 text-sm">Score: {exam.score}</p>
          <p className="text-gray-400 text-sm">Year: {exam.year}</p>
          <p className="text-gray-400 text-sm">Rank: {exam.rank}</p>
        </div>
      ))}
    </div>
  )}

  {/* Exam Modal */}
  {showExamModal && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161b22] rounded-2xl w-full max-w-lg p-6 border border-gray-700 relative">
        <X
          className="absolute right-5 top-5 cursor-pointer text-gray-400 hover:text-white"
          size={24}
          onClick={() => setShowExamModal(false)}
        />
        <h2 className="text-2xl font-bold text-white mb-4">
          {editingExamIndex !== null ? "Edit" : "Add"} Competitive Exam
        </h2>

        <div className="space-y-4">
          {["examName","score","year","rank"].map((field) => (
            <div key={field}>
              <label className="block text-sm text-gray-400 mb-1.5">{field}</label>
              <input
                type="text"
                value={examForm[field] || ""}
                onChange={(e) =>
                  setExamForm({ ...examForm, [field]: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            className="text-gray-400 px-6 py-2.5"
            onClick={() => setShowExamModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 px-8 py-2.5 rounded-lg text-white"
            onClick={() => handleSaveExam(examForm)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )}
</motion.section>

{/* ================= EMPLOYMENT SECTION ================= */}
<motion.section
  ref={sectionsRef.Employment}
  variants={sectionVariants}
  className="bg-[#161b22] border border-gray-800 rounded-xl p-6"
>
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
      <Briefcase size={20} /> Employment
    </h2>

    <button
      onClick={handleAddEmployment}
      className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300"
    >
      <Plus size={16} /> Add Employment
    </button>
  </div>

  {employments.length === 0 ? (
    <p className="text-gray-500 text-sm">
      No employment details added yet.
    </p>
  ) : (
    <div className="space-y-4">
      {employments.map((job, index) => (
        <div
          key={index}
          className="bg-gray-900 border border-gray-700 p-4 rounded-lg"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-white font-semibold">{job.role}</p>
              <p className="text-gray-400 text-sm">{job.company}</p>
              <p className="text-gray-500 text-xs mt-1">
                {job.fromMonth} {job.fromYear} -{" "}
                {job.currentlyWorking
                  ? "Present"
                  : `${job.toMonth} ${job.toYear}`}
              </p>
            </div>

            <div className="flex gap-4">
              <Edit2
                size={16}
                className="text-blue-400 cursor-pointer"
                onClick={() => handleEditEmployment(index)}
              />
              <Trash2
                size={16}
                className="text-red-400 cursor-pointer"
                onClick={() => handleDeleteEmployment(index)}
              />
            </div>
          </div>

          {job.description && (
            <p className="text-gray-400 text-sm mt-3">
              {job.description}
            </p>
          )}
        </div>
      ))}
    </div>
  )}
</motion.section>
<AnimatePresence>
  {showEmploymentModal && (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <EmploymentModal
        employmentForm={employmentForm}
        setEmploymentForm={setEmploymentForm}
        editingEmploymentIndex={editingEmploymentIndex}
        onClose={() => setShowEmploymentModal(false)}
        onSave={handleSaveEmployment}
      />
    </div>
  )}
</AnimatePresence>

{/* Resume */}
<motion.section
  ref={sectionsRef.Resume}
  variants={sectionVariants}
  className="bg-[#161b22] border border-gray-800 rounded-xl p-6"
>
  <h2 className="text-xl font-semibold text-white mb-4">
    Resume
  </h2>

  {/* If Resume Exists */}
  {resume ? (
    <>
      <div className="flex items-center justify-between bg-gray-900 p-5 rounded-lg border border-gray-700">
        <div
          onClick={() => window.open(resume.url)}
          className="flex items-center gap-4 cursor-pointer"
        >
          <FileText size={36} className="text-blue-500" />
          <div>
            <p className="text-white">{resume?.name}</p>
            <p className="text-sm text-gray-500">
              Uploaded on {resume.uploaded}
            </p>
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDeleteResume}
          className="text-red-400 hover:text-red-600"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-6 text-sm">
        <button
          onClick={() => window.open(resume.url)}
          className="text-blue-400 flex items-center gap-2"
        >
          <Download size={16} /> View / Download
        </button>

        <button
          onClick={() => fileInputRef.current.click()}
          className="text-blue-400 flex items-center gap-2"
        >
          <Upload size={16} /> Update Resume
        </button>
      </div>
    </>
  ) : (
    /* If No Resume */
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
      <Upload size={40} className="text-blue-500 mb-3" />
      <p className="text-gray-400 mb-3">No resume uploaded</p>

      <button
        onClick={() => fileInputRef.current.click()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
      >
        Upload Resume
      </button>
    </div>
  )}

  {/* Hidden File Input */}
  <input
    type="file"
    accept=".pdf,.doc,.docx"
    ref={fileInputRef}
    onChange={handleResumeUpload}
    className="hidden"
  />
</motion.section>

          </motion.main>
        </div>
      </div>

            {/* ================= PERSONAL DETAILS MODAL ================= */}
      <AnimatePresence>
        {modals.personalDetails && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-[#161b22] rounded-2xl w-full max-w-lg p-6 border border-gray-700 relative shadow-2xl"
            >
              <X
                className="absolute right-5 top-5 cursor-pointer text-gray-400 hover:text-white"
                size={24}
                onClick={() => closeModal("personalDetails")}
              />

              <h2 className="text-2xl font-bold text-white mb-1">
                All about you
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Basic information
              </p>

              <div className="space-y-6 text-gray-300">

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    Gender
                  </label>
                  <div className="flex gap-3">
                    {["Male", "Female", "Other"].map((g) => (
                      <button
                        key={g}
                        onClick={() =>
                          setFormData({ ...formData, gender: g })
                        }
                        className={`px-6 py-2 rounded-full text-sm border ${
                          formData.gender === g
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-gray-800 border-gray-600"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    Date of birth
                  </label>
                  <input
                    type="text"
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    Current location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">
                    Mobile number
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-700">
                <button
                  className="text-gray-400 px-6 py-2.5"
                  onClick={() => closeModal("personalDetails")}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 px-8 py-2.5 rounded-lg text-white"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6">
</div>

    </div>
  );
};

export default ProfilePageDark;