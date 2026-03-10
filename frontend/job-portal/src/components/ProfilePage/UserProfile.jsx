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
  Trash2,
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

const cardClass =
  "rounded-3xl border border-white/10 bg-white/3 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-sm";

const sectionTitleClass = "text-xl font-semibold text-white";
const actionBtnClass =
  "flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20";
const tagClass =
  "rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-200";

const ProfilePageDark = () => {
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/profile/me");
        if (!data) return;

        setProfile(data);
        setSkills(data.skills || []);
        setEducationList(data.education || []);
        setInternships(data.internships || []);
        setProjects(data.projects || []);
        setLanguages(data.languages || []);
        setEmployments(data.employments || []);
        setCompetitiveExams(data.competitiveExams || []);
        setAchievements(data.achievements || []);
        setProfileSummary(data.profileSummary || "");

        if (data.preferences) {
          setPreferences(data.preferences);
          setPreferenceForm(data.preferences);
        }

        if (data.profileImage?.url) {
          setProfileImage(`http://localhost:5000${data.profileImage.url}`);
        }

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

  const [educationList, setEducationList] = useState([]);
  const [editingEducationIndex, setEditingEducationIndex] = useState(null);
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
  const resumeUrl = resume?.url ? `http://localhost:5000${resume.url}` : null;
  const fileInputRef = useRef(null);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const { data } = await api.post("/api/profile/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

  const [modals, setModals] = useState({
    personalDetails: false,
    preference: false,
    education: false,
    skills: false,
    languages: false,
    accomplishments: false,
    summary: false,
  });

  const [preferenceForm, setPreferenceForm] = useState(preferences);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    location: "",
    dob: "",
    degree: "",
    college: "",
    gender: "",
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

  const openModal = (modal) => setModals({ ...modals, [modal]: true });
  const closeModal = (modal) => setModals({ ...modals, [modal]: false });

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

  const sectionsRef = {
    Preference: useRef(null),
    Education: useRef(null),
    KeySkills: useRef(null),
    Languages: useRef(null),
    Internships: useRef(null),
    Projects: useRef(null),
    "Profile Summary": useRef(null),
    CompetitiveExams: useRef(null),
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
  const [competitiveExams, setCompetitiveExams] = useState([]);
  const [showExamModal, setShowExamModal] = useState(false);
  const [editingExamIndex, setEditingExamIndex] = useState(null);
  const [examForm, setExamForm] = useState({
    examName: "",
    score: "",
    year: "",
    rank: "",
  });

  const handleSaveExam = (examData) => {
    setCompetitiveExams([...competitiveExams, examData]);
    setShowExamModal(false);
    setEditingExamIndex(null);
    setExamForm({
      examName: "",
      score: "",
      year: "",
      rank: "",
    });
  };

  const handleEditExam = (index) => {
    setEditingExamIndex(index);
    setExamForm(competitiveExams[index]);
    setShowExamModal(true);
  };

  const handleDeleteExam = (index) => {
    setCompetitiveExams(competitiveExams.filter((_, i) => i !== index));
  };

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

  const handleEmploymentSave = (data) => {
    const duration = data.currentlyWorking
      ? `${data.fromMonth} ${data.fromYear} - Present`
      : `${data.fromMonth} ${data.fromYear} - ${data.toMonth} ${data.toYear}`;

    const newEmployment = {
      company: data.company,
      role: data.role,
      fromMonth: data.fromMonth,
      fromYear: data.fromYear,
      toMonth: data.toMonth,
      toYear: data.toYear,
      currentlyWorking: data.currentlyWorking,
      description: data.description,
      duration,
    };

    if (editingEmploymentIndex !== null) {
      const updated = [...employments];
      updated[editingEmploymentIndex] = newEmployment;
      setEmployments(updated);
    } else {
      setEmployments([...employments, newEmployment]);
    }

    setShowEmploymentModal(false);
    setEditingEmploymentIndex(null);
  };

  const handleEditEmployment = (index) => {
    const item = employments[index];
    setEmploymentForm({
      role: item.role || "",
      company: item.company || "",
      fromMonth: item.fromMonth || "",
      fromYear: item.fromYear || "",
      toMonth: item.toMonth || "",
      toYear: item.toYear || "",
      currentlyWorking: item.currentlyWorking || false,
      description: item.description || "",
    });
    setEditingEmploymentIndex(index);
    setShowEmploymentModal(true);
  };

  const handleDeleteEmployment = (index) => {
    setEmployments(employments.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setProfile((prev) => ({ ...prev, skills }));
  }, [skills]);

  useEffect(() => {
    setProfile((prev) => ({ ...prev, education: educationList }));
  }, [educationList]);

  useEffect(() => {
    setProfile((prev) => ({ ...prev, internships }));
  }, [internships]);

  useEffect(() => {
    setProfile((prev) => ({ ...prev, languages }));
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
    if (profile.profileSummary?.length > 50) total += 10;
    if (profile.skills?.length >= 3) total += 15;
    if (profile.education?.length > 0) total += 15;
    if (profile.internships?.length > 0) total += 10;
    if (profile.projects?.length > 0) total += 10;
    if (profile.employments?.length > 0) total += 10;
    if (resume?.url) total += 10;

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
    setInternships(internships.filter((_, i) => i !== index));
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

  const modalVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.25 },
    },
    exit: { opacity: 0, y: 40, scale: 0.96 },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#13223f_0%,#0b1120_35%,#060b16_100%)] px-4 py-6 text-slate-300 md:px-8">
      <ProfilePageHeader />

      <div className="mx-auto max-w-375">
        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${cardClass} mb-8 overflow-hidden`}
        >
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* LEFT */}
            <div className="space-y-6">
              <div className="relative mx-auto w-fit">
                <div className="h-36 w-36 overflow-hidden rounded-4xl border border-white/10 bg-slate-900 shadow-xl">
                  <img
                    src={
                      profileImage ||
                      "https://ui-avatars.com/api/?name=KP&background=111827&color=ffffff"
                    }
                    alt="Profile"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://ui-avatars.com/api/?name=KP&background=111827&color=ffffff";
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
                  className="absolute -bottom-2 -right-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-cyan-600 text-white shadow-lg transition hover:bg-cyan-500"
                >
                  <Camera size={16} />
                </label>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/3 p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white">
                    Profile Completion
                  </h2>
                  <span className="font-bold text-cyan-400">
                    {profileCompletion}%
                  </span>
                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${profileCompletion}%` }}
                  />
                </div>

                <p className="mt-3 text-sm text-slate-400">
                  {profileCompletion < 100
                    ? "Complete your profile to improve visibility for recruiters."
                    : "Your profile is fully completed."}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-white md:text-4xl">
                        {profile.name || "Your Name"}
                      </h1>
                      <button
                        onClick={() => {
                          setFormData(profile);
                          openModal("personalDetails");
                        }}
                        className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10 hover:text-cyan-300"
                      >
                        <Edit2 size={16} />
                      </button>
                    </div>

                    {profile.degree && (
                      <p className="text-lg font-medium text-slate-200">
                        {profile.degree}
                      </p>
                    )}

                    {profile.college && (
                      <p className="mt-1 text-sm text-slate-400">
                        {profile.college}
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
                    Available for opportunities
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-400">
                      <MapPin size={15} />
                      <span className="text-xs uppercase tracking-wide">
                        Location
                      </span>
                    </div>
                    <p className="text-sm text-white">
                      {profile.location || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-400">
                      <Phone size={15} />
                      <span className="text-xs uppercase tracking-wide">
                        Mobile
                      </span>
                    </div>
                    <p className="text-sm text-white">
                      {profile.mobile || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-400">
                      <Calendar size={15} />
                      <span className="text-xs uppercase tracking-wide">
                        DOB
                      </span>
                    </div>
                    <p className="text-sm text-white">
                      {profile.dob || "Not added"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                    <div className="mb-2 flex items-center gap-2 text-slate-400">
                      <Mail size={15} />
                      <span className="text-xs uppercase tracking-wide">
                        Email
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm text-white">
                        {profile.email || "Not added"}
                      </p>
                      {profile.email && (
                        <CheckCircle2 size={14} className="text-emerald-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* LAYOUT */}
        <div className="grid gap-8 xl:grid-cols-[280px_1fr]">
          {/* SIDEBAR */}
          <aside className="xl:sticky xl:top-28 xl:h-fit">
            <div className={`${cardClass}`}>
              <h3 className="mb-5 text-lg font-semibold text-white">
                Quick Links
              </h3>

              <ul className="space-y-2">
                {quickLinks.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection(item)}
                      className="w-full rounded-2xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* CONTENT */}
          <div>
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
                className={cardClass}
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className={sectionTitleClass}>Career Preferences</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Tell recruiters what kind of opportunities you are looking
                      for.
                    </p>
                  </div>

                  <button onClick={openPreferenceModal} className={actionBtnClass}>
                    <Plus size={16} />
                    Add / Edit
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                    <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">
                      Preferred Job Type
                    </p>
                    <p className="text-sm text-white">
                      {preferences.types.join(" • ")}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                    <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">
                      Availability
                    </p>
                    <p className="text-sm text-emerald-300">
                      {preferences.availability}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                    <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">
                      Preferred Locations
                    </p>
                    <p className="text-sm text-white">
                      {preferences.locations.join(" • ")}
                    </p>
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
              </motion.section>

              {/* Education */}
<motion.section
  ref={sectionsRef.Education}
  variants={sectionVariants}
  className={cardClass}
>
  <div className="mb-6 flex items-center justify-between">
    <h2 className={sectionTitleClass}>Education</h2>
    <button
      onClick={() => {
        setEditingEducationIndex(null);
        openModal("education");
      }}
      className={actionBtnClass}
    >
      <Plus size={16} />
      Add Education
    </button>
  </div>

  {!educationList || educationList.length === 0 ? (
    <p className="text-sm text-slate-400">
      No education details added yet.
    </p>
  ) : (
    <div className="space-y-5">
      {educationList.map((edu, index) => (
        <div
          key={edu._id || index}
          className="rounded-2xl border border-white/10 bg-white/4 p-5"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {edu.degree || "Course not specified"}
              </h3>

              {edu.specialization && (
                <p className="mt-1 text-sm text-slate-400">
                  {edu.specialization}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingEducationIndex(index);
                  openModal("education");
                }}
                className="text-sm text-cyan-400 hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => {
                  const updated = educationList.filter((_, i) => i !== index);
                  setEducationList(updated);
                }}
                className="text-sm text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-300">
            {edu.institute} {edu.instituteLocation && `• ${edu.instituteLocation}`}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {edu.startYear} - {edu.endYear}{" "}
            {edu.courseType && `• ${edu.courseType}`}
          </p>

          {edu.percentage && (
            <p className="mt-2 text-sm text-cyan-400">{edu.percentage}%</p>
          )}

          {(edu.school12Name || edu.school12Percentage) && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <h4 className="mb-1 font-medium text-slate-200">
                12th Details
              </h4>
              <p className="text-sm text-slate-400">
                {edu.school12Name}{" "}
                {edu.school12Location && `• ${edu.school12Location}`}
              </p>
              <p className="text-xs text-slate-500">
                {edu.school12StartYear} - {edu.school12EndYear}
              </p>
              {edu.school12Percentage && (
                <p className="mt-1 text-sm text-cyan-400">
                  {edu.school12Percentage}%
                </p>
              )}
            </div>
          )}

          {(edu.school10Name || edu.school10Percentage) && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <h4 className="mb-1 font-medium text-slate-200">
                10th Details
              </h4>
              <p className="text-sm text-slate-400">
                {edu.school10Name}{" "}
                {edu.school10Location && `• ${edu.school10Location}`}
              </p>
              <p className="text-xs text-slate-500">
                {edu.school10StartYear} - {edu.school10EndYear}
              </p>
              {edu.school10Percentage && (
                <p className="mt-1 text-sm text-cyan-400">
                  {edu.school10Percentage}%
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )}

  <EducationModal
    modals={modals}
    closeModal={closeModal}
    modalVariants={modalVariants}
    educationList={educationList}
    setEducationList={setEducationList}
    editingEducationIndex={editingEducationIndex}
    setEditingEducationIndex={setEditingEducationIndex}
  />
</motion.section>

              {/* Skills */}
              <motion.section
                ref={sectionsRef.KeySkills}
                variants={sectionVariants}
                className={cardClass}
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className={sectionTitleClass}>Key Skills</h2>
                  <button
                    onClick={() => openModal("skills")}
                    className={actionBtnClass}
                  >
                    <Plus size={16} />
                    Add Skills
                  </button>
                </div>

                {skills.length === 0 ? (
                  <p className="text-sm text-slate-400">No skills added yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {skills.map((skill) => (
                      <span key={skill} className={tagClass}>
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <SkillsModal
                  modals={modals}
                  closeModal={closeModal}
                  modalVariants={modalVariants}
                  skills={skills}
                  setSkills={setSkills}
                />
              </motion.section>

              {/* Languages */}
              <motion.section
                ref={sectionsRef.Languages}
                variants={sectionVariants}
                className={cardClass}
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className={sectionTitleClass}>Languages</h2>
                  <button
                    onClick={() => openModal("languages")}
                    className={actionBtnClass}
                  >
                    <Plus size={16} />
                    Add Languages
                  </button>
                </div>

                {languages.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No languages added yet.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {languages.map((lang, index) => (
                      <span key={index} className={tagClass}>
                        {typeof lang === "string" ? lang : lang.name}
                      </span>
                    ))}
                  </div>
                )}

                <LanguagesModal
                  modals={modals}
                  closeModal={closeModal}
                  modalVariants={modalVariants}
                  languages={languages}
                  setLanguages={setLanguages}
                />
              </motion.section>

              {/* Internships */}
              <motion.section
                ref={sectionsRef.Internships}
                variants={sectionVariants}
                className={cardClass}
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className={sectionTitleClass}>Internships</h2>
                  <button
                    onClick={() => {
                      setEditingIndex(null);
                      setShowInternshipModal(true);
                    }}
                    className={actionBtnClass}
                  >
                    <Plus size={16} />
                    Add Internship
                  </button>
                </div>

                <InternshipsModal
                  isOpen={showInternshipModal}
                  onClose={() => {
                    setShowInternshipModal(false);
                    setEditingIndex(null);
                  }}
                  onSave={handleSaveInternship}
                  initialData={
                    editingIndex !== null ? internships[editingIndex] : null
                  }
                />

                {internships.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No internships added yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {internships.map((item, index) => (
                      <div
                        key={index}
                        className="relative rounded-2xl border border-white/10 bg-white/3 p-5"
                      >
                        <div className="absolute right-4 top-4 flex gap-4">
                          <button
                            onClick={() => handleEditInternship(index)}
                            className="text-sm text-cyan-400 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteInternship(index)}
                            className="text-sm text-red-400 hover:underline"
                          >
                            Delete
                          </button>
                        </div>

                        <h3 className="text-lg font-semibold text-white">
                          {item.project}
                        </h3>
                        <p className="text-sm text-slate-400">{item.company}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.fromMonth} {item.fromYear} - {item.toMonth}{" "}
                          {item.toYear}
                        </p>

                        {item.description && (
                          <p className="mt-3 text-sm leading-relaxed text-slate-300">
                            {item.description}
                          </p>
                        )}

                        {item.skills && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.skills.split(",").map((skill, i) => (
                              <span
                                key={i}
                                className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300"
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
                            className="mt-3 inline-block text-sm text-cyan-400 hover:underline"
                          >
                            View Project →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>

              {/* Projects */}
              <motion.section
                ref={sectionsRef.Projects}
                variants={sectionVariants}
                className={cardClass}
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className={sectionTitleClass}>Projects</h2>
                  <button
                    onClick={() => {
                      setEditingProjectIndex(null);
                      setShowProjectModal(true);
                    }}
                    className={actionBtnClass}
                  >
                    <Plus size={16} />
                    Add Project
                  </button>
                </div>

                {projects.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No projects added yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-white/10 bg-white/3 p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {project.name}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              {project.startMonth} {project.startYear} -{" "}
                              {project.endMonth} {project.endYear}
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <button
                              className="text-sm text-cyan-400 hover:underline"
                              onClick={() => {
                                setEditingProjectIndex(index);
                                setShowProjectModal(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-sm text-red-400 hover:underline"
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

                        <p className="mt-3 text-sm text-slate-300">
                          {project.description}
                        </p>

                        {project.learnings && (
                          <p className="mt-2 text-sm text-slate-300">
                            <span className="font-medium text-white">
                              Learnings:
                            </span>{" "}
                            {project.learnings}
                          </p>
                        )}

                        {project.skills &&
                          Array.isArray(project.skills) &&
                          project.skills.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {project.skills.map((skill, i) => (
                                <span key={i} className={tagClass}>
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
                            className="mt-3 inline-block text-sm text-cyan-400 hover:underline"
                          >
                            View Project
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <ProjectsModal
                  isOpen={showProjectModal}
                  onClose={() => {
                    setShowProjectModal(false);
                    setEditingProjectIndex(null);
                  }}
                  onSave={handleSaveProject}
                  modalVariants={modalVariants}
                  initialData={
                    editingProjectIndex !== null
                      ? projects[editingProjectIndex]
                      : null
                  }
                />
              </motion.section>

              {/* Profile Summary */}
              <motion.section
                ref={sectionsRef["Profile Summary"]}
                variants={sectionVariants}
                className={cardClass}
              >
                <div className="mb-4 flex items-start justify-between">
                  <h2 className={sectionTitleClass}>Profile Summary</h2>

                  <button
                    onClick={() => openModal("summary")}
                    className={actionBtnClass}
                  >
                    <Plus size={16} />
                    {profileSummary ? "Edit" : "Add"}
                  </button>
                </div>

                <p className="text-sm leading-relaxed text-slate-300">
                  {profileSummary || "No profile summary added yet."}
                </p>
              </motion.section>

              {/* Academic Achievements */}
              <motion.section
                ref={sectionsRef["Academic Achievements"]}
                variants={sectionVariants}
                className={cardClass}
              >
                <div className="mb-4 flex items-start justify-between">
                  <h2 className={sectionTitleClass}>
                    Academic Achievements / Accomplishments
                  </h2>

                  <button
                    onClick={() => openModal("accomplishments")}
                    className={actionBtnClass}
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>

                <div className="space-y-3">
                  {achievements?.length > 0 ? (
                    achievements.map((item, index) => (
                      <div
                        key={index}
                        className="border-b border-white/10 pb-3 last:border-none"
                      >
                        <p className="font-medium text-white">{item?.title}</p>

                        {item?.description && (
                          <p className="mt-1 text-sm text-slate-400">
                            {item.description}
                          </p>
                        )}

                        {item?.year && (
                          <p className="mt-1 text-xs text-cyan-400">
                            {item.year}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-slate-400">
                      No academic achievements added yet.
                    </div>
                  )}
                </div>
              </motion.section>

              <AcademicAchievements
                modals={modals}
                closeModal={closeModal}
                onSave={(data) => setAchievements(data)}
              />

              {/* Competitive Exams */}
              <motion.section
                ref={sectionsRef.CompetitiveExams}
                variants={sectionVariants}
                className={cardClass}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className={sectionTitleClass}>Competitive Exams</h2>
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
                    className={actionBtnClass}
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>

                {competitiveExams.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No competitive exams added yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {competitiveExams.map((exam, index) => (
                      <div
                        key={index}
                        className="relative rounded-2xl border border-white/10 bg-white/3 p-5"
                      >
                        <div className="absolute right-4 top-4 flex gap-3">
                          <button
                            onClick={() => handleEditExam(index)}
                            className="text-sm text-cyan-400 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteExam(index)}
                            className="text-sm text-red-400 hover:underline"
                          >
                            Delete
                          </button>
                        </div>

                        <p className="text-lg font-semibold text-white">
                          {exam.examName}
                        </p>
                        <p className="mt-2 text-sm text-slate-400">
                          Score: {exam.score}
                        </p>
                        <p className="text-sm text-slate-400">
                          Year: {exam.year}
                        </p>
                        <p className="text-sm text-slate-400">
                          Rank: {exam.rank}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>

              {/* Employment */}
              <motion.section
                ref={sectionsRef.Employment}
                variants={sectionVariants}
                className={cardClass}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className={`${sectionTitleClass} flex items-center gap-2`}>
                    <Briefcase size={20} /> Employment
                  </h2>

                  <button onClick={handleAddEmployment} className={actionBtnClass}>
                    <Plus size={16} />
                    Add Employment
                  </button>
                </div>

                {employments.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    No employment details added yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {employments.map((job, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-white/10 bg-white/3 p-5"
                      >
                        <div className="flex justify-between gap-4">
                          <div>
                            <p className="font-semibold text-white">
                              {job.role}
                            </p>
                            <p className="text-sm text-slate-400">
                              {job.company}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {job.fromMonth} {job.fromYear} -{" "}
                              {job.currentlyWorking
                                ? "Present"
                                : `${job.toMonth} ${job.toYear}`}
                            </p>
                          </div>

                          <div className="flex gap-4">
                            <button
                              onClick={() => handleEditEmployment(index)}
                              className="text-cyan-400"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteEmployment(index)}
                              className="text-red-400"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {job.description && (
                          <p className="mt-3 text-sm text-slate-400">
                            {job.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>

              {/* Resume */}
              <motion.section
                ref={sectionsRef.Resume}
                variants={sectionVariants}
                className={cardClass}
              >
                <h2 className={`${sectionTitleClass} mb-4`}>Resume</h2>

                {resume && resume.url ? (
                  <>
                    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/3 p-5 md:flex-row md:items-center">
                      <div
                        onClick={() => window.open(resumeUrl, "_blank")}
                        className="flex cursor-pointer items-center gap-4"
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                          <FileText size={28} />
                        </div>

                        <div>
                          <p className="font-medium text-white">{resume?.name}</p>
                          <p className="text-sm text-slate-500">
                            Uploaded on {resume.uploaded}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleDeleteResume}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-5 text-sm">
                      <button
                        onClick={() => window.open(resumeUrl, "_blank")}
                        className="flex items-center gap-2 text-cyan-400"
                      >
                        <Download size={16} /> View Resume
                      </button>

                      <a
                        href={resumeUrl}
                        download={resume?.name}
                        className="flex items-center gap-2 text-emerald-400"
                      >
                        <Download size={16} /> Download Resume
                      </a>

                      <button
                        onClick={() => fileInputRef.current.click()}
                        className="flex items-center gap-2 text-cyan-400"
                      >
                        <Upload size={16} /> Update Resume
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/2 p-10 text-center">
                    <Upload size={40} className="mb-3 text-cyan-400" />
                    <p className="mb-4 text-sm text-slate-400">
                      No resume uploaded
                    </p>

                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="rounded-2xl bg-cyan-600 px-6 py-3 text-white transition hover:bg-cyan-500"
                    >
                      Upload Resume
                    </button>
                  </div>
                )}

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
      </div>

      {/* PERSONAL DETAILS MODAL */}
      <AnimatePresence>
        {modals.personalDetails && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0f172a] p-8 shadow-2xl"
            >
              <h2 className="mb-1 text-2xl font-bold text-white">
                All about you
              </h2>
              <p className="mb-8 text-sm text-slate-400">
                Basic information
              </p>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-slate-400">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-slate-400">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={formData.degree || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, degree: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-slate-400">
                    College Name
                  </label>
                  <input
                    type="text"
                    value={formData.college || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, college: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-slate-400">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm text-slate-400">
                    Gender
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {["Male", "Female", "Other"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFormData({ ...formData, gender: g })}
                        className={`rounded-full border px-5 py-2 text-sm ${
                          formData.gender === g
                            ? "border-cyan-500 bg-cyan-600 text-white"
                            : "border-white/10 bg-white/5 text-slate-300"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-slate-400">
                    Date of birth
                  </label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm text-slate-400">
                    Current location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm text-slate-400">
                    Mobile number
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4 border-t border-white/10 pt-6">
                <button
                  className="px-6 py-2.5 text-slate-400"
                  onClick={() => closeModal("personalDetails")}
                >
                  Cancel
                </button>

                <button
                  className="rounded-2xl bg-cyan-600 px-8 py-2.5 text-white transition hover:bg-cyan-500"
                  onClick={handlePersonalDetailsSave}
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROFILE SUMMARY MODAL */}
      {modals.summary && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0f172a] p-8 shadow-2xl"
          >
            <X
              className="absolute right-5 top-5 cursor-pointer text-slate-400 hover:text-white"
              size={24}
              onClick={() => closeModal("summary")}
            />

            <h2 className="mb-2 text-2xl font-bold text-white">
              Profile summary
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              Write a short and meaningful summary that highlights your career,
              education, interests, and the kind of role you are looking for.
            </p>

            <div className="relative">
              <textarea
                className="min-h-48 w-full resize-y rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-cyan-500"
                placeholder="Type here"
                maxLength={1000}
                value={profileSummary}
                onChange={(e) => setProfileSummary(e.target.value)}
              />
              <div className="absolute bottom-3 right-4 text-xs text-slate-500">
                {profileSummary.length}/1000
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4 border-t border-white/10 pt-6">
              <button
                className="text-sm font-medium text-slate-400"
                onClick={() => closeModal("summary")}
              >
                Cancel
              </button>
              <button
                className="rounded-2xl bg-cyan-600 px-10 py-3 font-medium text-white transition hover:bg-cyan-500"
                onClick={() => closeModal("summary")}
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* EMPLOYMENT MODAL */}
      <AnimatePresence>
        {showEmploymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
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

      {/* EXAM MODAL */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl">
            <X
              className="absolute right-5 top-5 cursor-pointer text-slate-400 hover:text-white"
              size={24}
              onClick={() => setShowExamModal(false)}
            />
            <h2 className="mb-5 text-2xl font-bold text-white">
              {editingExamIndex !== null ? "Edit" : "Add"} Competitive Exam
            </h2>

            <div className="space-y-4">
              {["examName", "score", "year", "rank"].map((field) => (
                <div key={field}>
                  <label className="mb-1.5 block text-sm capitalize text-slate-400">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={examForm[field] || ""}
                    onChange={(e) =>
                      setExamForm({ ...examForm, [field]: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-200 outline-none focus:border-cyan-500"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                className="px-6 py-2.5 text-slate-400"
                onClick={() => setShowExamModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-2xl bg-cyan-600 px-8 py-2.5 text-white"
                onClick={() => handleSaveExam(examForm)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVE BUTTON */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleSave}
          disabled={loading}
          className="rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-7 py-3 font-semibold text-white shadow-2xl transition hover:scale-[1.02] hover:from-emerald-400 hover:to-teal-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePageDark;