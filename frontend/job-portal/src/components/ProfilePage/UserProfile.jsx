/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
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
import CareerPreferenceModal from "./CareerPreferenceModal";
import EducationModal from "./EducationModal";
import SkillsModal from "./SkillsModal";
import LanguagesModal from "./LanguagesModal";
import InternshipsModal from "./InternshipsModal";
import ProjectsModal from "./ProjectsModal";
import AcademicAchievements from "./AcademicAchievements";
import EmploymentModal from "./Employment";
import api from "../../pages/utils/axiosConfig";
import ProfilePageHeader from "./ProfilePageHeader";

const ProfilePageDark = () => {
  // ================= PROFILE STATE =================
  const [profileImage, setProfileImage] = useState(null);
  const [profileSummary, setProfileSummary] = useState("");
const [achievements, setAchievements] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [profile, setProfile] = useState({
  name: "",
  email: "",
  mobile: "",
  location: "",
  dob: "",
  gender: "",
  degree: "",
  college: "",
  skills: [],
  languages: [],
  preferences: {
    types: [],
    availability: "",
    locations: [],
  },
  education: [],
  internships: [],
  projects: [],
  competitiveExams: [],
  employments: [],
  achievements: [],
  profileSummary: "",
});

const [preferences, setPreferences] = useState({
  types: ["Full Time", "Internship"],
  availability: "Immediate",
  locations: ["Chennai", "Bangalore"],
});

  const [loading, setLoading] = useState(false);

  // ✅ Fetch Profile
  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/api/profile/me");

      if (!data) return;

      // Main profile object
      setProfile(data);

      // Basic Sections
      setSkills(data.skills || []);
      setEducationList(data.education || []);
      setInternships(data.internships || []);
      setProjects(data.projects || []);
      setLanguages(data.languages || []);
      setEmployments(data.employments || []);
      setCompetitiveExams(data.competitiveExams || []);
      setAchievements(data.achievements || []);
      setProfileSummary(data.profileSummary || "");

      // Preferences
      if (data.preferences) {
        setPreferences(data.preferences);
        setPreferenceForm(data.preferences);
      }

      // Profile Image
      if (data.profileImage?.url) {
        setProfileImage(`http://localhost:5000${data.profileImage.url}`);
      }

      // Resume
      if (data.resume?.url) {
        setResume({
          name: data.resume.name,
          url: data.resume.url,
          uploaded: data.resume.uploadedAt
            ? new Date(data.resume.uploadedAt).toLocaleDateString()
            : "",
        });
      }

    } catch (error) {
      console.log("Profile not found", error);
    }
  };

  fetchProfile();
}, []);

const handleSave = async () => {
  try {
    setLoading(true);

    const { data } = await api.post("/api/profile/save", profile);

    alert("Profile saved successfully!");
    console.log("Saved profile:", data);

  } catch (error) {
    console.error("Save error:", error.response?.data);
    alert(error.response?.data?.message || "Error saving profile");
  } finally {
    setLoading(false);
  }
};

const handlePersonalDetailsSave = () => {
  setProfile((prev) => ({
    ...prev,
    ...formData,
  }));

  closeModal("personalDetails");
};

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
const [resume, setResume] = useState(null);
const resumeUrl = resume?.url
  ? `http://localhost:5000${resume.url}`
  : null;
const fileInputRef = useRef(null);
const handleResumeUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("resume", file);

  try {
    const { data } = await api.post(
      "/api/profile/upload-resume",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    setResume({
      name: data.name,
      url: data.url,
      uploaded: new Date(data.uploadedAt).toLocaleDateString(),
    });

  } catch (err) {
    console.error("Resume upload failed");
  }
};
const handleDeleteResume = () => {
  setResume({
    name: "",
    uploaded: "",
    url: "",
  });
};

const handleSaveEducation = () => {

  const newEducation = {
    degree: courseName || otherCourse,
    specialization: specialization || otherSpecialization,
    institute: collegeName,
    instituteLocation: "",
    startYear,
    endYear,
    courseType: selectedCourseType,
    percentage: "",

    school12Name: "",
    school12Location: "",
    school12StartYear: "",
    school12EndYear: "",
    school12Percentage: "",

    school10Name: "",
    school10Location: "",
    school10StartYear: "",
    school10EndYear: "",
    school10Percentage: "",
  };

  setEducationList([...educationList, newEducation]);
  closeModal("education");
};
  
const [languages, setLanguages] = useState([]);

  // ================= MODAL STATE =================
const [modals, setModals] = useState({
  personalDetails: false,
  preference: false,
  education: false,
  skills: false,
  languages: false,
  accomplishments: false,   // ✅ add this
});
const [preferenceForm, setPreferenceForm] = useState(preferences);

  // Profile form data
const [formData, setFormData] = useState({
  name: "",
  email: "",
  mobile: "",
  location: "",
  dob: "",
  degree: "",
  college: ""
});


  const openPreferenceModal = () => {
  setPreferenceForm(preferences);
  openModal("preference");
};

const handlePreferenceSave = () => {
  setProfile({
    ...profile,
    preferences: preferenceForm,
  });

  closeModal("preference");
};

  const openModal = (modal) =>
    setModals({ ...modals, [modal]: true });

  const closeModal = (modal) =>
    setModals({ ...modals, [modal]: false });

  // ================= IMAGE UPLOAD =================
  const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const { data } = await api.post(
      "/api/profile/upload-profile-image",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    setProfileImage(`http://localhost:5000${data.url}`);
  } catch (err) {
    console.error("Image upload failed");
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
const handleSaveExam = (examData) => {
  setCompetitiveExams([...competitiveExams, examData]);
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
const handleEmploymentSave = (data) => {
  const duration = data.currentlyWorking
    ? `${data.fromMonth} ${data.fromYear} - Present`
    : `${data.fromMonth} ${data.fromYear} - ${data.toMonth} ${data.toYear}`;

  const newEmployment = {
    company: data.company,
    role: data.role,
    duration,
  };

  setEmployments([...employments, newEmployment]);
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
useEffect(() => {
  setProfile((prev) => ({
    ...prev,
    skills,
  }));
}, [skills]);
useEffect(() => {
  setProfile((prev) => ({
    ...prev,
    education: educationList,
  }));
}, [educationList]);
useEffect(() => {
  setProfile((prev) => ({
    ...prev,
    internships: internships,
  }));
}, [internships]);
useEffect(() => {
  setProfile((prev) => ({
    ...prev,
    languages: languages
  }));
}, [languages]);
useEffect(() => {
  setProfile((prev) => ({ ...prev, projects }));
}, [projects]);

useEffect(() => {
  setProfile((prev) => ({ ...prev, employments }));
}, [employments]);

useEffect(() => {
  setProfile((prev) => ({ ...prev, competitiveExams }));
}, [competitiveExams]);

useEffect(() => {
  setProfile((prev) => ({ ...prev, achievements }));
}, [achievements]);

useEffect(() => {
  setProfile((prev) => ({ ...prev, profileSummary }));
}, [profileSummary]);

useEffect(() => {
  let total = 0;

  if (profile.name && profile.email && profile.mobile && profile.location)
    total += 20;

  if (profile.profileSummary?.length > 50)
    total += 10;

  if (profile.skills?.length >= 3)
    total += 15;

  if (profile.education?.length > 0)
    total += 15;

  if (profile.internships?.length > 0)
    total += 10;

  if (profile.projects?.length > 0)
    total += 10;

  if (profile.employments?.length > 0)
    total += 10;

  if (resume?.url)
    total += 10;

  setProfileCompletion(total);
}, [profile, resume]);

const handleSaveInternship = (data) => {

  if (editingIndex !== null) {
    const updated = [...internships];
    updated[editingIndex] = data;
    setInternships(updated);
  } else {
    setInternships([...internships, data]);
  }

  setShowInternshipModal(false);
  setEditingIndex(null);
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
      <ProfilePageHeader />
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

<div className="mt-6 bg-[#161b22] p-6 rounded-xl border border-gray-800">
  
  <div className="flex justify-between mb-2">
    <h2 className="text-lg font-semibold text-white">
      Profile Completion
    </h2>
    <span className="text-blue-400 font-bold">
      {profileCompletion}%
    </span>
  </div>

  <div className="w-full bg-gray-700 rounded-full h-4">
    <div
      className="bg-blue-600 h-4 rounded-full transition-all duration-500"
      style={{ width: `${profileCompletion}%` }}
    />
  </div>

  {profileCompletion < 100 && (
    <p className="text-gray-400 text-sm mt-3">
      Complete your profile to increase visibility to recruiters.
    </p>
  )}

  {profileCompletion === 100 && (
    <p className="text-green-400 text-sm mt-3">
      🎉 Your profile is fully completed!
    </p>
  )}
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

            {/* Degree */}
  {profile.degree && (
    <p className="text-lg text-gray-300 mt-2">
      {profile.degree}
    </p>
  )}

  {/* College */}
  {profile.college && (
    <p className="text-gray-400">
      {profile.college}
    </p>
  )}

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
  ref={sectionsRef?.Education}
  variants={sectionVariants}
  className="bg-[#161b22] border border-gray-800 rounded-xl p-6"
>
  {/* Header */}
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-semibold text-white">
      Education
    </h2>

    <button
      onClick={() => openModal("education")}
      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
    >
      <Edit2 size={16} />
      Add Education
    </button>
  </div>

  {/* Education List */}
  {!educationList || educationList.length === 0 ? (
    <p className="text-gray-400 text-sm">
      No education details added yet.
    </p>
  ) : (
    <div className="space-y-6">
      {educationList.map((edu, index) => (
        <div
          key={edu._id || index}
          className="bg-[#0d1117] p-6 rounded-xl border border-gray-700 space-y-6"
        >
          {/* ================= College ================= */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">
              {edu.degree || "Course not specified"}
            </h3>

            {edu.specialization && (
              <p className="text-gray-400 text-sm">
                {edu.specialization}
              </p>
            )}

            <p className="text-gray-400 text-sm">
              {edu.institute}{" "}
              {edu.instituteLocation && `• ${edu.instituteLocation}`}
            </p>

            <p className="text-gray-500 text-xs">
              {edu.startYear} - {edu.endYear}{" "}
              {edu.courseType && `• ${edu.courseType}`}
            </p>

            {edu.percentage && (
              <p className="text-blue-400 text-sm">
                {edu.percentage}%
              </p>
            )}
          </div>

          {/* ================= 12th ================= */}
          {(edu.school12Name || edu.school12Percentage) && (
            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-gray-300 font-medium mb-1">
                12th Details
              </h4>

              <p className="text-gray-400 text-sm">
                {edu.school12Name}{" "}
                {edu.school12Location && `• ${edu.school12Location}`}
              </p>

              <p className="text-gray-500 text-xs">
                {edu.school12StartYear} - {edu.school12EndYear}
              </p>

              {edu.school12Percentage && (
                <p className="text-blue-400 text-sm">
                  {edu.school12Percentage}%
                </p>
              )}
            </div>
          )}

          {/* ================= 10th ================= */}
          {(edu.school10Name || edu.school10Percentage) && (
            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-gray-300 font-medium mb-1">
                10th Details
              </h4>

              <p className="text-gray-400 text-sm">
                {edu.school10Name}{" "}
                {edu.school10Location && `• ${edu.school10Location}`}
              </p>

              <p className="text-gray-500 text-xs">
                {edu.school10StartYear} - {edu.school10EndYear}
              </p>

              {edu.school10Percentage && (
                <p className="text-blue-400 text-sm">
                  {edu.school10Percentage}%
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )}

  {/* Education Modal */}
  <EducationModal
    modals={modals}
    closeModal={closeModal}
    modalVariants={modalVariants}
    educationList={educationList}
    setEducationList={setEducationList}
  />
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
    {languages.map((lang, index) => (
      <span
        key={index}
        className="bg-gray-800 px-4 py-2 rounded-full text-sm border border-gray-700 text-gray-200"
      >
        {typeof lang === "string" ? lang : lang.name}
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
  </div>

  <InternshipsModal
    isOpen={showInternshipModal}
    onClose={() => {
      setShowInternshipModal(false);
      setEditingIndex(null);
    }}
    onSave={handleSaveInternship}
    initialData={editingIndex !== null ? internships[editingIndex] : null}
  />

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

          {/* Edit/Delete */}
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

          {/* Project */}
          <h3 className="text-white font-semibold text-lg">
            {item.project}
          </h3>

          {/* Company */}
          <p className="text-gray-400 text-sm">
            {item.company}
          </p>

          {/* Duration */}
          <p className="text-gray-500 text-xs mt-1">
            {item.fromMonth} {item.fromYear} - {item.toMonth} {item.toYear}
          </p>

          {/* Description */}
          {item.description && (
            <p className="text-gray-300 text-sm mt-3 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Skills */}
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

          {/* URL */}
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
  <div className="flex justify-between items-start mb-4">

    <h2 className="text-xl font-semibold text-white">
      Academic Achievements / Accomplishments
    </h2>

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
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
      </div>
    </div>

  </div>

  <div className="space-y-3">
  {achievements?.length > 0 ? (
    achievements.map((item, index) => (
      <div
        key={index}
        className="text-sm text-gray-300 border-b border-gray-800 pb-2 last:border-none"
      >
        <p className="font-medium text-white">
          {item?.title}
        </p>

        {item?.description && (
          <p className="text-gray-400 text-xs mt-1">
            {item.description}
          </p>
        )}

        {item?.year && (
          <p className="text-blue-400 text-xs mt-1">
            {item.year}
          </p>
        )}
      </div>
    ))
  ) : (
    <div className="text-gray-500 text-sm">
      No academic achievements added yet.
    </div>
  )}
</div>
</motion.section>

{/* Modal */}
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
        onSave={handleEmploymentSave}
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
 {resume && resume.url ? (
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

  {/* View */}
  <button
    onClick={() => window.open(resumeUrl, "_blank")}
    className="text-blue-400 flex items-center gap-2"
  >
    <Download size={16} /> View Resume
  </button>

  {/* Download */}
  <a
    href={resumeUrl}
    download={resume?.name}
    className="text-green-400 flex items-center gap-2"
  >
    <Download size={16} /> Download Resume
  </a>

  {/* Update */}
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
        className="bg-gray-900 w-full max-w-xl rounded-xl shadow-xl p-8 
                   max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-white mb-1">
          All about you
        </h2>

        <p className="text-gray-400 text-sm mb-8">
          Basic information
        </p>

        <div className="space-y-6 text-gray-300">

          {/* Full Name */}
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

          {/* Degree */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Degree
            </label>
            <input
              type="text"
              value={formData.degree || ""}
              onChange={(e) =>
                setFormData({ ...formData, degree: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
            />
          </div>

          {/* College */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              College Name
            </label>
            <input
              type="text"
              value={formData.college || ""}
              onChange={(e) =>
                setFormData({ ...formData, college: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Gender
            </label>
            <div className="flex gap-3">
              {["Male", "Female", "Other"].map((g) => (
                <button
                  key={g}
                  type="button"
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

          {/* DOB */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">
              Date of birth
            </label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
            />
          </div>

          {/* Location */}
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

          {/* Mobile */}
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

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-700">
          <button
            className="text-gray-400 px-6 py-2.5"
            onClick={() => closeModal("personalDetails")}
          >
            Cancel
          </button>

          <button
            className="bg-blue-600 px-8 py-2.5 rounded-lg text-white"
            onClick={handlePersonalDetailsSave}
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
        <div className="fixed bottom-6 right-6">
  <button
    onClick={handleSave}
    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg"
  >
    Save Profile
  </button>
</div>
    </div>
  );
};

export default ProfilePageDark;