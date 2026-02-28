import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  User,
  Edit2,
  CheckCircle2,
  X,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  Award,
  FileText,
  Trophy,
  Building,
  Heart,
  Download,
  Upload,
  Plus,
  Star,
  Camera,
} from 'lucide-react';

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

export default function ProfilePage() {
  const [modals, setModals] = useState({
    preference: false,
    education: false,
    skills: false,
    languages: false,
    internships: false,
    projects: false,
    summary: false,
    accomplishments: false,
    employment: false,
    awards: false,
    clubCommittees: false,
    certifications: false,
  });

const openModal = (name) => {
  setModals((prev) => ({ ...prev, [name]: true }));
};

const closeModal = (name) => {
  setModals((prev) => ({ ...prev, [name]: false }));
};

// 1. This line MUST exist
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

  // 2. This handler should exist (you already have it – good)
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (profilePhotoPreview) {
      URL.revokeObjectURL(profilePhotoPreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setProfilePhotoPreview(previewUrl);
  };

  // 3. In the JSX – use the state variable
  // (this is probably line ~200 where the crash happens)
<img
  src={profilePhotoPreview || "https://api.dicebear.com/9.x/initials/svg?seed=KP&backgroundColor=111222&textColor=ffffff&fontFamily=Verdana"}
  alt="Profile"
  className="w-full h-full object-cover"
/>

// Add these inside ProfilePage function
const [courseName, setCourseName] = useState('');
const [otherCourse, setOtherCourse] = useState('');
const [specialization, setSpecialization] = useState('');
const [otherSpecialization, setOtherSpecialization] = useState('');
const [selectedGrading, setSelectedGrading] = useState('');
const [selectedCourseType, setSelectedCourseType] = useState('');

  // ─────────────────────────────────────────────
  //  Demo / filled data
  // ─────────────────────────────────────────────
  const profile = {
    name: 'Karthik P',
    degree: 'B.Sc - Bachelor of Science',
    college: "Virudhunagar Hindu Nadars' Senthi Kumara Nadar College (VHNSNC)",
    location: 'Virudhunagar, Tamil Nadu',
    mobile: '+91 90255 55530',
    email: '23aucs032@vhnsnc.edu.in',
    gender: 'Male',
    dob: '15 September 2005',
    completion: 82,
  };

  const preferences = {
    types: ['Internships', 'Full-time Jobs'],
    availability: 'Immediately available (within 15 days)',
    locations: ['Bengaluru', 'Chennai', 'Coimbatore', 'Remote', 'Madurai'],
  };

  const education = {
    course: 'B.Sc - Bachelor of Science',
    specialization: 'Computer Science and Technology',
    college: "Virudhunagar Hindu Nadars' Senthi Kumara Nadar College (VHNSNC)",
    university: 'Madurai Kamaraj University',
    duration: '2023 – 2026 (Expected)',
    type: 'Full Time',
    grading: 'CGPA',
    score: '8.4 / 10.0 (up to 4th semester)',
  };

  const skills = [
    'React.js',
    'React Native',
    'Redux',
    'JavaScript (ES6+)',
    'TypeScript',
    'Tailwind CSS',
    'Git & GitHub',
    'RESTful APIs',
    'Firebase',
  ];

  const languages = ['English (Fluent)', 'Tamil (Native)', 'Hindi (Conversational)'];

  const summary = 
    "Motivated B.Sc Computer Science student with hands-on experience in building responsive web and mobile applications using React.js and React Native. Passionate about clean code, modern UI/UX, and learning emerging technologies. Seeking internships and entry-level roles in frontend/full-stack development to apply problem-solving skills and contribute to real-world projects.";

  const projects = [
    {
      title: 'TaskFlow – Productivity Mobile App',
      duration: 'Jun 2025 – Aug 2025',
      description: 'Cross-platform mobile app built with React Native & Redux for task management with offline support, notifications, and dark mode.',
      role: 'Designed UI, implemented state management, integrated AsyncStorage & Firebase Authentication.',
      technologies: 'React Native, Redux Toolkit, Firebase, Tailwind CSS (via twrnc)',
      link: 'https://github.com/karthikp-23/taskflow-app',
    },
  ];

  const certifications = [
    {
      name: 'The Complete 2025 Web Development Bootcamp',
      issuer: 'Udemy – Dr. Angela Yu',
      completionId: 'UC-abc123xyz',
      url: 'https://www.udemy.com/certificate/UC-abc123xyz/',
      validity: 'Lifetime',
    },
  ];

  const awards = [
    {
      title: 'Best Project Award – Intra College Tech Symposium 2025',
      description: 'Won 1st place for developing an AI-powered attendance system using face recognition (group project).',
      year: '2025',
    },
  ];

  const clubs = [
    {
      name: 'Computer Science Association (CSA)',
      position: 'Web Development Lead',
      duration: 'Jun 2024 – Present',
      description: 'Led a team of 8 to build and maintain the department website and event registration portal. Organized 3 technical workshops on web technologies.',
      associatedWith: 'B.Sc Computer Science',
    },
  ];

  const employment = [
    {
      company: 'Freelance / Personal Projects',
      designation: 'Frontend Developer (Self-employed)',
      duration: 'Jan 2025 – Present',
      currentlyWorking: true,
      description: 'Developed 4+ responsive websites and 2 mobile apps for local clients and personal portfolio. Focused on React ecosystem and performance optimization.',
    },
  ];

  const resume = {
    name: 'Karthik_P_Resume_Feb2026.pdf',
    uploaded: 'February 10, 2026',
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header */}
<motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 mb-8 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row gap-6 md:items-start">
          {/* Profile Picture – clickable + preview */}
          <div className="relative mx-auto md:mx-0 group cursor-pointer">
            <div className="w-32 h-32 rounded-full border-4 border-red-600 overflow-hidden shadow-lg transition-transform group-hover:scale-105">
              <img
                src={profilePhotoPreview || "https://via.placeholder.com/150/222/111?text=KP"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={32} className="text-white drop-shadow-md" />
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profile-photo-upload"
              onChange={handleProfilePhotoChange}
            />

            {/* Trigger button */}
            <label
              htmlFor="profile-photo-upload"
              className="absolute -bottom-1 right-1 bg-blue-600 p-2.5 rounded-full cursor-pointer shadow-lg hover:bg-blue-500 transition transform hover:scale-110 active:scale-95"
            >
              <Camera size={18} className="text-white" />
            </label>

            {/* Completion percentage */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0d1117] px-4 py-1 text-sm font-bold rounded-full border border-gray-700 shadow-md">
              {profile.completion}%
            </div>
          </div>

          {/* Main Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h1
                className="text-3xl md:text-4xl font-bold text-white capitalize cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => openModal('personalDetails')}
              >
                {profile.name}
              </h1>
              <Edit2
                size={20}
                className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors"
                onClick={() => openModal('personalDetails')}
              />
            </div>

            <p className="text-xl text-gray-300 mt-2 font-medium">{profile.degree}</p>
            <p className="text-gray-400 mt-1">{profile.college}</p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5 text-sm">
              <div
                className="flex items-center justify-center md:justify-start gap-2 cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => openModal('personalDetails')}
              >
                <MapPin size={16} className="text-gray-400" />
                {profile.location}
              </div>

              <div
                className="flex items-center justify-center md:justify-start gap-2 cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => openModal('personalDetails')}
              >
                <Phone size={16} className="text-gray-400" />
                {profile.mobile}
              </div>

              <div
                className="flex items-center justify-center md:justify-start gap-2 cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => openModal('personalDetails')}
              >
                <User size={16} className="text-gray-400" />
                {profile.gender}
              </div>

              <div className="col-span-2 sm:col-span-1 flex items-center justify-center md:justify-start gap-2 break-all">
                <Mail size={16} className="text-gray-400" />
                {profile.email}
                <CheckCircle2 size={16} className="text-green-500 shrink-0" />
              </div>

              <div
                className="flex items-center justify-center md:justify-start gap-2 cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => openModal('personalDetails')}
              >
                <Calendar size={16} className="text-gray-400" />
                {profile.dob}
              </div>
            </div>
          </div>

          {/* Completion call-to-action */}
          <div className="bg-linear-to-br from-amber-950/60 to-amber-900/30 rounded-xl p-6 w-full md:w-80 flex flex-col items-center text-center border border-amber-800/40">
            <p className="text-amber-300 font-medium mb-4">
              Profile is {profile.completion}% complete
            </p>
            <button className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 px-6 rounded-lg font-medium transition shadow-md">
              Add {100 - profile.completion}% missing details
            </button>
          </div>
        </div>
      </motion.div>

      {/* ─────────────────────────────────────────────
          "All about you" Modal (personal details)
      ───────────────────────────────────────────── */}
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
            className="bg-[#161b22] rounded-2xl w-full max-w-md sm:max-w-lg p-6 border border-gray-700 relative shadow-2xl"
          >
            <X
              className="absolute right-5 top-5 cursor-pointer text-gray-400 hover:text-white"
              size={24}
              onClick={() => closeModal('personalDetails')}
            />

            <h2 className="text-2xl font-bold text-white mb-1">All about you</h2>
            <p className="text-gray-400 text-sm mb-8">Basic information</p>

            <div className="space-y-6 text-gray-300">
              {/* Full name */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Full name</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                  defaultValue={profile.name}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Gender</label>
                <div className="flex flex-wrap gap-3">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      className={`px-6 py-2 rounded-full text-sm border transition-all ${
                        profile.gender === g
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date of birth */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">
                  Date of birth (DD/MM/YYYY)
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                  defaultValue={profile.dob.replace(' September ', '/09/')}
                  placeholder="15/09/2005"
                />
              </div>

              {/* Current location */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Current location</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                  defaultValue={profile.location}
                  placeholder="City, State"
                />
              </div>

              {/* Mobile number */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Mobile number</label>
                <input
                  type="tel"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                  defaultValue={profile.mobile}
                  placeholder="+91 90255 55530"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-700">
              <button
                className="text-gray-400 hover:text-gray-200 px-6 py-2.5 rounded-lg transition"
                onClick={() => closeModal('personalDetails')}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-500 px-8 py-2.5 rounded-lg text-white font-medium transition shadow-md"
                onClick={() => {
                  console.log('Saving personal details...');
                  closeModal('personalDetails');
                }}
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT SIDEBAR – UNCHANGED */}
          <aside className="lg:col-span-1">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              className="bg-[#161b22] border border-gray-800 rounded-xl p-6 sticky top-6"
            >
              <h3 className="text-lg font-semibold text-gray-100 mb-6">Quick links</h3>
              <ul className="space-y-4 text-sm">
                {[
                  { icon: Briefcase, label: 'Preference', action: () => openModal('preference') },
                  { icon: GraduationCap, label: 'Education', action: () => openModal('education') },
                  { icon: Code, label: 'Key skills', action: () => openModal('skills') },
                  { icon: Globe, label: 'Languages', action: () => openModal('languages') },
                  { icon: Briefcase, label: 'Internships', action: () => openModal('internships') },
                  { icon: Code, label: 'Projects', action: () => openModal('projects') },
                  { icon: FileText, label: 'Profile summary', action: () => openModal('summary') },
                  { icon: Award, label: 'Accomplishments', action: () => openModal('accomplishments') },
                  { icon: Building, label: 'Employment', action: () => openModal('employment') },
                  { icon: FileText, label: 'Resume', action: () => openModal('Resume') },
                  { icon: Heart, label: 'Club & committees', action: () => openModal('clubCommittees') },
                  { icon: Award, label: 'Awards', action: () => openModal('awards') },
                  { icon: Award, label: 'Certifications', action: () => openModal('certifications') },
                ].map((item, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-3 cursor-pointer transition-colors ${
                      item.action ? 'hover:text-blue-400' : 'opacity-50'
                    }`}
                    onClick={item.action}
                  >
                    <item.icon size={18} className="text-gray-500" />
                    {item.label}
                  </li>
                ))}
              </ul>
            </motion.div>
          </aside>

          {/* MAIN CONTENT */}
          <motion.main
            className="lg:col-span-3 space-y-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Preferences */}
            <motion.section variants={sectionVariants} className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Career preferences</h2>
                <Edit2 size={18} className="text-gray-400 hover:text-blue-400 cursor-pointer" onClick={() => openModal('preference')} />
              </div>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="text-gray-500">Preferred job type</p>
                  <p className="font-medium">{preferences.types.join(' & ')}</p>
                </div>
                <div>
                  <p className="text-gray-500">Availability</p>
                  <p className="text-green-400 font-medium">{preferences.availability}</p>
                </div>
                <div>
                  <p className="text-gray-500">Preferred location(s)</p>
                  <p className="font-medium">{preferences.locations.join(' • ')}</p>
                </div>
              </div>
            </motion.section>

            {/* Education */}
            <motion.section variants={sectionVariants} className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Education</h2>
                <Edit2 size={18} className="text-gray-400 hover:text-blue-400 cursor-pointer" onClick={() => openModal('education')} />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold">{education.course}</p>
                <p className="text-blue-400 font-medium">{education.specialization}</p>
                <p className="text-gray-300">{education.college}</p>
                <p className="text-gray-400 text-sm">{education.university}</p>
                <div className="mt-3 text-sm space-y-1">
                  <p><span className="text-gray-500">Duration:</span> {education.duration} • {education.type}</p>
                  <p><span className="text-gray-500">CGPA:</span> {education.score}</p>
                </div>
              </div>
            </motion.section>

            {/* Skills */}
            <motion.section variants={sectionVariants} className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Key skills</h2>
                <Edit2 size={18} className="text-gray-400 hover:text-blue-400 cursor-pointer" onClick={() => openModal('skills')} />
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="bg-gray-800 text-gray-200 px-4 py-1.5 rounded-full text-sm border border-gray-700"
                  >
                    {s}
                  </span>
                ))}
                <button className="text-blue-400 text-sm hover:underline flex items-center gap-1">
                  <Plus size={14} /> Add
                </button>
              </div>
            </motion.section>

            {/* Languages */}
            <motion.section variants={sectionVariants} className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Languages</h2>
                <Edit2 size={18} className="text-gray-400 hover:text-blue-400 cursor-pointer" onClick={() => openModal('languages')} />
              </div>
              <div className="flex flex-wrap gap-3">
                {languages.map((l) => (
                  <span
                    key={l}
                    className="bg-gray-800 px-5 py-2 rounded-full text-sm border border-gray-700"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </motion.section>

            {/* Profile Summary */}
            <motion.section variants={sectionVariants} className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Profile summary</h2>
                <Edit2 size={18} className="text-gray-400 hover:text-blue-400 cursor-pointer" onClick={() => openModal('summary')} />
              </div>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{summary}</p>
            </motion.section>

            {/* Projects */}
            <motion.section variants={sectionVariants} className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Projects</h2>
                <Edit2 size={18} className="text-gray-400 hover:text-blue-400 cursor-pointer" onClick={() => openModal('projects')} />
              </div>
              {projects.map((proj, i) => (
                <div key={i} className="space-y-3 mt-4 first:mt-0 border-t border-gray-700 pt-5 first:border-t-0 first:pt-0">
                  <h3 className="text-lg font-semibold text-blue-400">{proj.title}</h3>
                  <p className="text-sm text-gray-400">{proj.duration}</p>
                  <p className="text-gray-300">{proj.description}</p>
                  <p className="text-sm"><span className="text-gray-500">Role / Contributions:</span> {proj.role}</p>
                  <p className="text-sm"><span className="text-gray-500">Technologies:</span> {proj.technologies}</p>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline text-sm inline-flex items-center gap-1"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              ))}
            </motion.section>

            {/* Certifications */}
            <motion.section variants={sectionVariants} className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Certifications</h2>
                <Edit2 size={18} className="text-gray-400 hover:text-blue-400 cursor-pointer" onClick={() => openModal('certifications')} />
              </div>
              {certifications.map((cert, i) => (
                <div key={i} className="space-y-2 mt-4 first:mt-0 border-t border-gray-700 pt-5 first:border-t-0 first:pt-0">
                  <h3 className="font-medium">{cert.name}</h3>
                  <p className="text-sm text-gray-400">{cert.issuer} • {cert.validity}</p>
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline text-sm"
                    >
                      View Certificate
                    </a>
                  )}
                </div>
              ))}
            </motion.section>

            {/* Awards */}
            <motion.section variants={sectionVariants} className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Awards</h2>
                <Edit2 size={18} className="text-gray-400 hover:text-blue-400 cursor-pointer" onClick={() => openModal('awards')} />
              </div>
              {awards.map((award, i) => (
                <div key={i} className="mt-4 first:mt-0 border-t border-gray-700 pt-5 first:border-t-0 first:pt-0">
                  <h3 className="font-medium flex items-center gap-2">
                    <Star size={16} className="text-yellow-400" /> {award.title}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{award.year}</p>
                  <p className="text-gray-300 mt-2">{award.description}</p>
                </div>
              ))}
            </motion.section>

            {/* Club & Committees */}
            <motion.section variants={sectionVariants} className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Club & Committees</h2>
                <Edit2 size={18} className="text-gray-400 hover:text-blue-400 cursor-pointer" onClick={() => openModal('clubCommittees')} />
              </div>
              {clubs.map((club, i) => (
                <div key={i} className="space-y-2 mt-4 first:mt-0 border-t border-gray-700 pt-5 first:border-t-0 first:pt-0">
                  <h3 className="font-medium">{club.name}</h3>
                  <p className="text-sm text-blue-400">{club.position}</p>
                  <p className="text-sm text-gray-400">{club.duration}</p>
                  <p className="text-gray-300">{club.description}</p>
                </div>
              ))}
            </motion.section>

            {/* Employment */}
            <motion.section variants={sectionVariants} className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Employment</h2>
                <Edit2 size={18} className="text-gray-400 hover:text-blue-400 cursor-pointer" onClick={() => openModal('employment')} />
              </div>
              {employment.map((job, i) => (
                <div key={i} className="space-y-2 mt-4 first:mt-0 border-t border-gray-700 pt-5 first:border-t-0 first:pt-0">
                  <h3 className="font-medium">{job.designation} • {job.company}</h3>
                  <p className="text-sm text-gray-400">
                    {job.duration} {job.currentlyWorking && <span className="text-green-400">(Present)</span>}
                  </p>
                  <p className="text-gray-300">{job.description}</p>
                </div>
              ))}
            </motion.section>

            {/* Resume */}
            <motion.section variants={sectionVariants} className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Resume</h2>
              <div className="flex items-center gap-4 bg-gray-900/60 p-5 rounded-lg border border-gray-700">
                <FileText size={36} className="text-blue-500" />
                <div>
                  <p className="font-medium">{resume.name}</p>
                  <p className="text-sm text-gray-500">Uploaded on {resume.uploaded}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-6 text-sm">
                <button className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                  <Download size={16} /> Download
                </button>
                <button className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                  <Upload size={16} /> Update resume
                </button>
              </div>
            </motion.section>

            {/* Locked sections placeholder */}
            <motion.div
              variants={sectionVariants}
              className="bg-[#161b22] border border-gray-800 rounded-xl p-10 text-center text-gray-500"
            >
              Internships • Competitive exams • More projects / certifications / awards
              <br />
              <span className="text-gray-400 mt-3 block text-sm">
                Add more experiences to unlock additional sections
              </span>
            </motion.div>
          </motion.main>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          MODALS ─ all screens from your images
      ───────────────────────────────────────────── */}

 {/* Preference Modal - Naukri Campus style */}
{modals.preference && (
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
      className="bg-[#161b22] rounded-2xl w-full max-w-lg p-6 sm:p-8 border border-gray-700 relative shadow-2xl"
    >
      {/* Close button */}
      <X
        className="absolute right-5 top-5 cursor-pointer text-gray-400 hover:text-white"
        size={24}
        onClick={() => closeModal('preference')}
      />

      <h2 className="text-2xl font-bold text-white mb-2">Career preferences</h2>
      <p className="text-gray-400 text-sm mb-8">
        Tell us your preferences for your next job & we will send you most relevant recommendations
      </p>

      <div className="space-y-8 text-gray-300">
        {/* Looking for */}
        <div>
          <p className="font-medium mb-3 text-white">Looking for</p>
          <div className="flex flex-wrap gap-3">
            <button
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-2 ${
                preferences.types.includes('Internships')
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => {
                // Toggle logic example (you can manage state properly)
                console.log('Toggle Internships');
              }}
            >
              Internships {preferences.types.includes('Internships') && <CheckCircle2 size={16} />}
            </button>

            <button
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-2 ${
                preferences.types.includes('Jobs')
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => {
                console.log('Toggle Jobs');
              }}
            >
              Jobs {preferences.types.includes('Jobs') && <CheckCircle2 size={16} />}
            </button>
          </div>
        </div>

        {/* Availability to work */}
        <div>
          <p className="font-medium mb-3 text-white">Availability to work</p>
          <div className="flex flex-wrap gap-2.5">
            {['15 Days or less', '1 Month', '2 Months', '3 Months', 'More than 3 Months'].map((opt) => (
              <button
                key={opt}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                  preferences.availability === opt
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => {
                  // You can update state here
                  console.log('Selected availability:', opt);
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred work location(s) */}
        <div>
          <p className="font-medium mb-3 text-white">Preferred work location(s)</p>
          <div className="flex flex-wrap gap-2.5 mb-3">
            {preferences.locations.map((loc) => (
              <span
                key={loc}
                className="bg-blue-900/40 text-blue-300 px-4 py-1.5 rounded-full text-sm border border-blue-800/50 flex items-center gap-2"
              >
                {loc}
                <X
                  size={14}
                  className="cursor-pointer hover:text-red-400"
                  onClick={() => console.log('Remove', loc)}
                />
              </span>
            ))}
          </div>

          {/* Dropdown simulation / Add more */}
          <div className="relative">
            <select
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-300 appearance-none cursor-pointer"
              defaultValue=""
              onChange={(e) => console.log('Add location:', e.target.value)}
            >
              <option value="" disabled>Select from the list</option>
              <option>Bengaluru</option>
              <option>Chennai</option>
              <option>Delhi / NCR</option>
              <option>Hyderabad</option>
              <option>Mumbai</option>
              <option>Pune</option>
              <option>Remote</option>
              {/* Add more cities as needed */}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-700">
        <button
          className="text-gray-400 hover:text-gray-200 text-sm font-medium"
          onClick={() => closeModal('preference')}
        >
          I'll add this later
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium text-white shadow-md transition"
          onClick={() => {
            console.log('Save preferences');
            closeModal('preference');
          }}
        >
          Save
        </button>
      </div>
    </motion.div>
  </motion.div>
)}

{/* Education Modal - Naukri Campus style (matches screenshot when "Other" selected) */}
{modals.education && (
  <motion.div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-[#161b22] rounded-2xl w-full max-w-2xl p-6 sm:p-8 border border-gray-700 relative shadow-2xl overflow-hidden"
    >
      {/* Close button */}
      <button
        onClick={() => closeModal('education')}
        className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Close modal"
      >
        <X size={24} />
      </button>

      <h2 className="text-2xl font-bold text-white mb-2">Education</h2>
      <p className="text-gray-400 text-sm mb-8">
        Adding your educational details help recruiters know your value as a potential candidate
      </p>

      <div className="space-y-7 text-gray-300">
        {/* Course name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Course name</label>
          <div className="relative">
            <select
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 appearance-none cursor-pointer focus:border-blue-500 outline-none"
              value={courseName} // ← controlled
              onChange={(e) => setCourseName(e.target.value)}
            >
              <option value="">Select course</option>
              <option>B.Tech/B.E. - Bachelor of Technology / Engineering</option>
              <option>B.Com - Bachelor of Commerce</option>
              <option>B.Sc - Bachelor of Science</option>
              <option>B.A - Bachelor of Arts</option>
              <option>Diploma</option>
              <option>BCA - Bachelor of Computer Applications</option>
              <option>MBBS - Bachelor of Medicine and Bachelor of Surgery</option>
              <option>B.B.A/B.B.M - Bachelor of Business Administration / Management Studies</option>
              <option>Other</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Show "Specify other" when "Other" is selected */}
          {courseName === 'Other' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Specify other</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 focus:border-blue-500 outline-none"
                placeholder="Type course name"
                value={otherCourse}
                onChange={(e) => setOtherCourse(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Specialization */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Specialization</label>
          <div className="relative">
            <select
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 appearance-none cursor-pointer focus:border-blue-500 outline-none"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            >
              <option value="">Select specialization</option>
              <option>Computer Science and Technology</option>
              <option>Information Technology (IT)</option>
              <option>Zoology</option>
              <option>Visual Communication</option>
              <option>Statistics</option>
              <option>Science</option>
              <option>Rural Development Science</option>
              <option>Radiology and Medical Imaging</option>
              <option>Psychology</option>
              <option>Physics, Chemistry, Mathematics</option>
              <option>Other</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Show "Specialization in" when "Other" is selected */}
          {specialization === 'Other' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Specialization in</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 focus:border-blue-500 outline-none"
                placeholder="Type specialization"
                value={otherSpecialization}
                onChange={(e) => setOtherSpecialization(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* College name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">College name</label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 focus:border-blue-500 outline-none"
            defaultValue="Virudhunagar Hindu Nadars' Senthi Kumara Nadar College (VHNSNC), Virudhunagar"
            placeholder="Enter your college name"
          />
        </div>

        {/* Grading system */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Grading system</label>
          <div className="flex flex-wrap gap-2.5">
            {['Scale 10 Grading System', 'Scale 4 Grading System', '% Marks of 100 Maximum', 'Course Requires a Pass'].map((opt) => (
              <button
                key={opt}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all flex items-center gap-2 ${
                  selectedGrading === opt
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setSelectedGrading(opt)}
              >
                {opt}
                {selectedGrading === opt && (
                  <X size={14} className="cursor-pointer hover:text-red-300" onClick={() => setSelectedGrading('')} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Course duration */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Course duration</label>
          <div className="flex items-center gap-3 flex-wrap">
            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-[100px]">
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
              {/* more years */}
            </select>
            <span className="text-gray-400">to</span>
            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-[100px]">
              <option>2026</option>
              <option>2027</option>
              <option>2025</option>
            </select>
          </div>
        </div>

        {/* Course type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Course type</label>
          <div className="flex flex-wrap gap-2.5">
            {['Full Time', 'Part Time', 'Correspondence'].map((type) => (
              <button
                key={type}
                className={`px-5 py-2 rounded-full text-sm border transition-all ${
                  selectedCourseType === type
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
                onClick={() => setSelectedCourseType(type)}
              >
                {type}
                {selectedCourseType === type && (
                  <X size={14} className="ml-1 cursor-pointer hover:text-red-300" onClick={() => setSelectedCourseType('')} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center gap-6 mt-10 pt-6 border-t border-gray-700">
        <button
          className="text-gray-400 hover:text-gray-200 text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-gray-800 transition"
          onClick={() => closeModal('education')}
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-500 px-10 py-3 rounded-lg font-medium text-white shadow-md transition"
          onClick={() => {
            console.log('Save education details');
            closeModal('education');
          }}
        >
          Save
        </button>
      </div>
    </motion.div>
  </motion.div>
)}

{/* Key Skills Modal - Naukri Campus style */}
{modals.skills && (
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
      className="bg-[#161b22] rounded-2xl w-full max-w-lg p-6 sm:p-8 border border-gray-700 relative shadow-2xl"
    >
      {/* Close button */}
      <X
        className="absolute right-5 top-5 cursor-pointer text-gray-400 hover:text-white"
        size={24}
        onClick={() => closeModal('skills')}
      />

      <h2 className="text-2xl font-bold text-white mb-2">Key skills</h2>
      <p className="text-gray-400 text-sm mb-2">
        Recruiters look for candidates with specific key skills. Add them here to appear in searches.
      </p>

      {/* Add new skill input */}
      <div className="mt-6 mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            className="flex-1 bg-gray-800 border-b-2 border-blue-600 focus:border-blue-500 rounded-none p-3 text-gray-200 placeholder-gray-500 outline-none transition-colors"
            placeholder="e.g. React.js, Python, Communication..."
            // You can add onKeyDown to add skill on Enter
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                // Logic to add skill to list
                console.log('Add skill:', e.currentTarget.value.trim());
                e.currentTarget.value = '';
              }
            }}
          />
          <button
            className="bg-blue-600 hover:bg-blue-500 px-6 rounded-lg text-white font-medium transition"
            onClick={() => {
              // You can get value from ref or state
              console.log('Add skill clicked');
            }}
          >
            Add
          </button>
        </div>
      </div>

      {/* Existing skills - chip style */}
      <div className="min-h-25">
        <p className="text-sm text-gray-400 mb-3">Added skills</p>
        <div className="flex flex-wrap gap-2.5">
          {skills.map((skill) => (
            <span
              key={skill}
              className="bg-gray-700 text-gray-200 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-gray-600"
            >
              {skill}
              <X
                size={14}
                className="cursor-pointer hover:text-red-400 transition-colors"
                onClick={() => console.log('Remove skill:', skill)}
              />
            </span>
          ))}

          {/* Example of typo / partial match highlight from screenshot */}
          {/*
          <span className="bg-gray-700 text-gray-200 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-gray-600">
            Read
            <span className="text-red-400">X</span>
          </span>
          */}
        </div>

        {skills.length === 0 && (
          <p className="text-gray-500 text-center mt-10 text-sm">
            No skills added yet
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center gap-6 mt-10 pt-6 border-t border-gray-700">
        <button
          className="text-gray-400 hover:text-gray-200 text-sm font-medium"
          onClick={() => closeModal('skills')}
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-500 px-10 py-3 rounded-lg font-medium text-white shadow-md transition"
          onClick={() => {
            console.log('Save skills');
            closeModal('skills');
          }}
        >
          Save
        </button>
      </div>
    </motion.div>
  </motion.div>
)}

{/* Languages Modal - Naukri Campus style */}
{modals.languages && (
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
      className="bg-[#161b22] rounded-2xl w-full max-w-lg p-6 sm:p-8 border border-gray-700 relative shadow-2xl"
    >
      {/* Close button */}
      <X
        className="absolute right-5 top-5 cursor-pointer text-gray-400 hover:text-white"
        size={24}
        onClick={() => closeModal('languages')}
      />

      <h2 className="text-2xl font-bold text-white mb-2">Languages known</h2>
      <p className="text-gray-400 text-sm mb-8">
        Strengthen your resume by letting recruiters know you can communicate in multiple languages
      </p>

      {/* Language selector + Add button */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <select
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 appearance-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Language
                </option>
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Telugu</option>
                <option>Kannada</option>
                <option>Malayalam</option>
                <option>Punjabi</option>
                <option>Odia</option>
                <option>Assamese</option>
                <option>Urdu</option>
                <option>Konkani</option>
                <option>Bodo</option>
                <option>Manipuri</option>
                <option>Sindhi</option>
                <option>Russian</option>
                <option>Chinese</option>
                <option>Korean</option>
                <option>Italian</option>
                <option>Portuguese</option>
                <option>Dutch</option>
                <option>Indonesian</option>
                <option>Malaysian</option>
                {/* You can add many more languages */}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <button
              className="bg-blue-600 hover:bg-blue-500 px-6 rounded-lg text-white font-medium transition min-w-20"
              onClick={() => {
                console.log('Add selected language');
              }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Placeholder for added languages (chips) */}
        <div className="min-h-30">
          <p className="text-sm text-gray-400 mb-3">Added languages</p>
          <div className="flex flex-wrap gap-2.5">
            {languages.map((lang) => (
              <span
                key={lang}
                className="bg-gray-700 text-gray-200 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-gray-600"
              >
                {lang}
                <X
                  size={14}
                  className="cursor-pointer hover:text-red-400 transition-colors"
                  onClick={() => console.log('Remove language:', lang)}
                />
              </span>
            ))}

            {languages.length === 0 && (
              <p className="text-gray-500 text-center w-full mt-8 text-sm">
                No languages added yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-end items-center gap-6 mt-10 pt-6 border-t border-gray-700">
        <button
          className="text-gray-400 hover:text-gray-200 text-sm font-medium"
          onClick={() => closeModal('languages')}
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-500 px-10 py-3 rounded-lg font-medium text-white shadow-md transition"
          onClick={() => {
            console.log('Save languages');
            closeModal('languages');
          }}
        >
          Save
        </button>
      </div>
    </motion.div>
  </motion.div>
)}

{/* Internships Modal - Naukri Campus style */}
{modals.internships && (
  <motion.div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
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
        onClick={() => closeModal('internships')}
      />

      <h2 className="text-2xl font-bold text-white mb-2">Internships</h2>
      <p className="text-gray-400 text-sm mb-8">
        Show your professional learnings
      </p>

      <div className="space-y-7 text-gray-300">
        {/* Company name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Company name
          </label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter the name of the company"
          />
        </div>

        {/* Internship duration */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Internship duration
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Month</option>
              <option>Jan</option>
              <option>Feb</option>
              <option>Mar</option>
              <option>Apr</option>
              <option>May</option>
              <option>Jun</option>
              <option>Jul</option>
              <option>Aug</option>
              <option>Sep</option>
              <option>Oct</option>
              <option>Nov</option>
              <option>Dec</option>
            </select>

            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Year</option>
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>

            <span className="text-gray-400">to</span>

            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Month</option>
              <option>Jan</option>
              <option>Feb</option>
              {/* ... same months */}
            </select>

            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Year</option>
              <option>2026</option>
              <option>2025</option>
              {/* ... same years */}
            </select>
          </div>
        </div>

        {/* Project name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project name
          </label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter the name of the project you undertook"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Describe what you did at internship
          </label>
          <textarea
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition min-h-120px resize-y"
            placeholder="Enter the responsibilities you held, anything you accomplished or learned while serving in your internship"
          />
        </div>

        {/* Key skills (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Key skills (optional)
          </label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter the skills you used in this role"
          />
        </div>

        {/* Project URL (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project URL (optional)
          </label>
          <input
            type="url"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter the website link of your project"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center gap-6 mt-10 pt-6 border-t border-gray-700">
        <button
          className="text-gray-400 hover:text-gray-200 text-sm font-medium"
          onClick={() => closeModal('internships')}
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-500 px-10 py-3 rounded-lg font-medium text-white shadow-md transition"
          onClick={() => {
            console.log('Save internship details');
            closeModal('internships');
          }}
        >
          Save
        </button>
      </div>
    </motion.div>
  </motion.div>
)}

{/* Projects Modal - Naukri Campus style */}
{modals.projects && (
  <motion.div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
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
        onClick={() => closeModal('projects')}
      />

      <h2 className="text-2xl font-bold text-white mb-2">Projects</h2>
      <p className="text-gray-400 text-sm mb-8">
        Showcase your talent with the best projects you have worked on during college and work
      </p>

      <div className="space-y-7 text-gray-300">
        {/* Project name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project name
          </label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter the name of the project you worked on"
          />
        </div>

        {/* Project duration */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project duration
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Month</option>
              <option>Jan</option>
              <option>Feb</option>
              <option>Mar</option>
              <option>Apr</option>
              <option>May</option>
              <option>Jun</option>
              <option>Jul</option>
              <option>Aug</option>
              <option>Sep</option>
              <option>Oct</option>
              <option>Nov</option>
              <option>Dec</option>
            </select>

            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Year</option>
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
            </select>

            <span className="text-gray-400">to</span>

            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Month</option>
              {/* same months */}
              <option>Jan</option>
              <option>Feb</option>
              {/* ... */}
            </select>

            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Year</option>
              <option>2026</option>
              <option>2025</option>
              {/* same years */}
            </select>
          </div>
        </div>

        {/* Describe what the project was about */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Describe what the project was about
          </label>
          <textarea
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition min-h-25 resize-y"
            placeholder="Enter what the project was about"
          />
        </div>

        {/* Learnings & favorite part */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Enter your learnings throughout the process of making the project and what you liked the most about it
          </label>
          <textarea
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition min-h-30 resize-y"
            placeholder="Enter your learnings throughout the process of making the project and what you liked the most about it"
          />
        </div>

        {/* Key skills used (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Key skills used in the project (optional)
          </label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter key skills used in the project"
          />
        </div>

        {/* Project URL (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project URL (optional)
          </label>
          <input
            type="url"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter the website link of your project"
          />
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-end items-center gap-6 mt-10 pt-6 border-t border-gray-700">
        <button
          className="text-gray-400 hover:text-gray-200 text-sm font-medium"
          onClick={() => closeModal('projects')}
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-500 px-10 py-3 rounded-lg font-medium text-white shadow-md transition"
          onClick={() => {
            console.log('Save project details');
            closeModal('projects');
          }}
        >
          Save
        </button>
      </div>
    </motion.div>
  </motion.div>
)}

{/* Profile Summary Modal - Naukri Campus style */}
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
        onClick={() => closeModal('summary')}
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
            // You can add onChange to update character count in real time
            // For now it's static like in screenshot
          />

          {/* Character counter (bottom right) */}
          <div className="absolute bottom-3 right-4 text-xs text-gray-500">
            0/1000
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-end items-center gap-6 mt-10 pt-6 border-t border-gray-700">
        <button
          className="text-gray-400 hover:text-gray-200 text-sm font-medium"
          onClick={() => closeModal('summary')}
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-500 px-10 py-3 rounded-lg font-medium text-white shadow-md transition"
          onClick={() => {
            console.log('Save profile summary');
            closeModal('summary');
          }}
        >
          Save
        </button>
      </div>
    </motion.div>
  </motion.div>
)}

{/* Academic Achievements / Accomplishments Modal - Naukri Campus style */}
{modals.accomplishments && (
  <motion.div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-[#161b22] rounded-2xl w-full max-w-lg p-6 sm:p-8 border border-gray-700 relative shadow-2xl"
    >
      {/* Close button */}
      <X
        className="absolute right-5 top-5 cursor-pointer text-gray-400 hover:text-white"
        size={24}
        onClick={() => closeModal('accomplishments')}
      />

      <h2 className="text-2xl font-bold text-white mb-2">Academic achievements</h2>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
        Adding your achievements to help recruiters know your value as a potential candidate
      </p>

      <div className="space-y-6">
        {/* Selected period / during which course */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Academic achievements
          </label>
          <div className="flex flex-wrap gap-2.5">
            <span className="bg-blue-900/40 text-blue-300 px-4 py-1.5 rounded-full text-sm border border-blue-800/50 flex items-center gap-2">
              During B.Sc - Bachelor of Science
              <X size={14} className="cursor-pointer hover:text-red-400" />
            </span>
          </div>
        </div>

        {/* List of achievement options as pills */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Received during B.Sc - Bachelor of Science
          </label>
          <div className="flex flex-wrap gap-2.5">
            {[
              'College topper',
              'Department topper',
              'Top 3 in class',
              'Top 10 in class',
              'Gold medalist',
              'Received scholarship',
              'All rounder',
              'Other',
            ].map((achievement) => (
              <button
                key={achievement}
                className="px-4 py-1.5 rounded-full text-sm bg-gray-700 border border-gray-600 text-gray-200 hover:bg-gray-600 transition flex items-center gap-1.5"
              >
                {achievement}
                <span className="text-blue-400">+</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center gap-6 mt-10 pt-6 border-t border-gray-700">
        <button
          className="text-gray-400 hover:text-gray-200 text-sm font-medium"
          onClick={() => closeModal('accomplishments')}
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-500 px-10 py-3 rounded-lg font-medium text-white shadow-md transition"
          onClick={() => {
            console.log('Save academic achievements');
            closeModal('accomplishments');
          }}
        >
          Save
        </button>
      </div>
    </motion.div>
  </motion.div>
)}

{/* Employment Details Modal - Naukri Campus style */}
{modals.employment && (
  <motion.div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
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
        onClick={() => closeModal('employment')}
      />

      <h2 className="text-2xl font-bold text-white mb-2">Employment details</h2>
      <p className="text-gray-400 text-sm mb-8">
        Adding roles & companies you have worked with help employers understand your background
      </p>

      <div className="space-y-7 text-gray-300">
        {/* Total work experience */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Total work experience
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-25">
              <option>Years</option>
              <option>0</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5+</option>
            </select>

            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-25">
              <option>Months</option>
              <option>0</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
              <option>11</option>
            </select>
          </div>
        </div>

        {/* Company name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Company name
          </label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter the name of the company you worked at"
          />
        </div>

        {/* Designation */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Designation
          </label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition"
            placeholder="Enter the designation you held"
          />
        </div>

        {/* Working since */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Working since
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Month</option>
              <option>Jan</option>
              <option>Feb</option>
              <option>Mar</option>
              <option>Apr</option>
              <option>May</option>
              <option>Jun</option>
              <option>Jul</option>
              <option>Aug</option>
              <option>Sep</option>
              <option>Oct</option>
              <option>Nov</option>
              <option>Dec</option>
            </select>

            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Year</option>
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
            </select>

            <span className="text-gray-400">to</span>

            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Month</option>
              {/* same months */}
              <option>Jan</option>
              <option>Feb</option>
              {/* ... */}
            </select>

            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Year</option>
              <option>2026</option>
              <option>2025</option>
              {/* same years */}
            </select>
          </div>

          {/* Currently working checkbox */}
          <label className="flex items-center gap-2 mt-3 text-sm text-gray-300">
            <input
              type="checkbox"
              className="w-4 h-4 accent-blue-600 bg-gray-700 border-gray-600 rounded"
            />
            I currently work here
          </label>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Describe what you did at work
          </label>
          <textarea
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition min-h-35 resize-y"
            placeholder="Enter the responsibilities you held, anything you accomplished or learned while serving in your full time job"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center gap-6 mt-10 pt-6 border-t border-gray-700">
        <button
          className="text-gray-400 hover:text-gray-200 text-sm font-medium"
          onClick={() => closeModal('employment')}
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-500 px-10 py-3 rounded-lg font-medium text-white shadow-md transition"
          onClick={() => {
            console.log('Save employment details');
            closeModal('employment');
          }}
        >
          Save
        </button>
      </div>
    </motion.div>
  </motion.div>
)}

{/* Awards Modal - Naukri Campus style */}
{modals.awards && (
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
        onClick={() => closeModal('awards')}
      />

      <h2 className="text-2xl font-bold text-white mb-2">Awards</h2>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
        Adding awards & accomplishments helps you stand out
      </p>

      <div className="space-y-4">
        {/* Awards description textarea */}
        <div className="relative">
          <textarea
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition min-h-45 resize-y"
            placeholder="Mention your academic or extra-curricular achievements where you were recognised for your performance"
            maxLength={1000}
            // Optional: connect to state for real-time count
            // onChange={(e) => setCharCount(e.target.value.length)}
          />

          {/* Character counter (bottom right) */}
          <div className="absolute bottom-3 right-4 text-xs text-gray-500">
            0/1000
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-end items-center gap-6 mt-10 pt-6 border-t border-gray-700">
        <button
          className="text-gray-400 hover:text-gray-200 text-sm font-medium"
          onClick={() => closeModal('awards')}
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-500 px-10 py-3 rounded-lg font-medium text-white shadow-md transition"
          onClick={() => {
            console.log('Save awards');
            closeModal('awards');
          }}
        >
          Save
        </button>
      </div>
    </motion.div>
  </motion.div>
)}

{/* Club & Committees Modal - Naukri Campus style */}
{modals.clubCommittees && (
  <motion.div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
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
        onClick={() => closeModal('clubCommittees')}
      />

      <h2 className="text-2xl font-bold text-white mb-2">Club & committees</h2>
      <p className="text-gray-400 text-sm mb-8">
        Showcase your leadership skills by adding position of responsibilities that you have held
      </p>

      <div className="space-y-7 text-gray-300">
        {/* Club or committee name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Club or committee name
          </label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition"
            placeholder="Eg - E-Cell"
          />
        </div>

        {/* Designation / Position of responsibility */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Designation / Position of responsibility
          </label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition"
            placeholder="Eg - Head boy"
          />
        </div>

        {/* Associate with education (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Associate with education (optional)
          </label>
          <div className="relative">
            <select
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 appearance-none cursor-pointer"
            >
              <option>Select an option</option>
              <option>During B.Sc - Bachelor of Science</option>
              <option>During Class XII</option>
              <option>During Class X</option>
              <option>Not associated with education</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Duration
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Month</option>
              <option>Jan</option>
              <option>Feb</option>
              <option>Mar</option>
              <option>Apr</option>
              <option>May</option>
              <option>Jun</option>
              <option>Jul</option>
              <option>Aug</option>
              <option>Sep</option>
              <option>Oct</option>
              <option>Nov</option>
              <option>Dec</option>
            </select>

            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Year</option>
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
            </select>

            <span className="text-gray-400">to</span>

            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Month</option>
              {/* same months */}
              <option>Jan</option>
              <option>Feb</option>
              {/* ... */}
            </select>

            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Year</option>
              <option>2026</option>
              <option>2025</option>
              {/* same years */}
            </select>
          </div>

          {/* Currently working checkbox */}
          <label className="flex items-center gap-2 mt-3 text-sm text-gray-300">
            <input
              type="checkbox"
              className="w-4 h-4 accent-blue-600 bg-gray-700 border-gray-600 rounded"
            />
            I am currently working in this role
          </label>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition min-h-35 resize-y"
            placeholder="Describe your responsibilities and experiences at this position"
          />
        </div>

        {/* Media (optional) - file upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Media (optional)
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Add media to support your work
          </p>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-gray-900/30">
            <div className="mx-auto w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mb-3">
              <Upload size={20} className="text-gray-400" />
            </div>
            <p className="text-gray-300 text-sm mb-1">File</p>
            <p className="text-xs text-gray-500">
              Supported format: DOC, DOCX, PDF, RTF, PNG, JPG
            </p>
            <p className="text-xs text-gray-500">
              Maximum file size: 2 MB
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center gap-6 mt-10 pt-6 border-t border-gray-700">
        <button
          className="text-gray-400 hover:text-gray-200 text-sm font-medium"
          onClick={() => closeModal('clubCommittees')}
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-500 px-10 py-3 rounded-lg font-medium text-white shadow-md transition"
          onClick={() => {
            console.log('Save club & committees details');
            closeModal('clubCommittees');
          }}
        >
          Save
        </button>
      </div>
    </motion.div>
  </motion.div>
)}

{/* Certifications Modal - Naukri Campus style */}
{modals.certifications && (
  <motion.div
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-[#161b22] rounded-2xl w-full max-w-lg p-6 sm:p-8 border border-gray-700 relative shadow-2xl"
    >
      {/* Close button */}
      <X
        className="absolute right-5 top-5 cursor-pointer text-gray-400 hover:text-white"
        size={24}
        onClick={() => closeModal('certifications')}
      />

      <h2 className="text-2xl font-bold text-white mb-2">Certification</h2>
      <p className="text-gray-400 text-sm mb-8">
        Add details of your certification. You can add up to 10 in your profile.
      </p>

      <div className="space-y-7 text-gray-300">
        {/* Certification name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Certification name
          </label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition"
            placeholder="Please enter your certification name"
          />
        </div>

        {/* Certification completion ID */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Certification completion ID
          </label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition"
            placeholder="Please mention your course completion ID"
          />
        </div>

        {/* Certification URL */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Certification URL
          </label>
          <input
            type="url"
            className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-blue-500 outline-none transition"
            placeholder="Please mention your completion URL"
          />
        </div>

        {/* Certification validity */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Certification validity
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Month</option>
              <option>Jan</option>
              <option>Feb</option>
              <option>Mar</option>
              <option>Apr</option>
              <option>May</option>
              <option>Jun</option>
              <option>Jul</option>
              <option>Aug</option>
              <option>Sep</option>
              <option>Oct</option>
              <option>Nov</option>
              <option>Dec</option>
            </select>

            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Year</option>
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
            </select>

            <span className="text-gray-400">to</span>

            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Month</option>
              {/* same months */}
              <option>Jan</option>
              <option>Feb</option>
              {/* ... */}
            </select>

            <select className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200 min-w-27.5">
              <option>Year</option>
              <option>2026</option>
              <option>2025</option>
              {/* same years */}
            </select>
          </div>

          {/* Does not expire checkbox */}
          <label className="flex items-center gap-2 mt-3 text-sm text-gray-300">
            <input
              type="checkbox"
              className="w-4 h-4 accent-blue-600 bg-gray-700 border-gray-600 rounded"
            />
            This certification does not expire
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end items-center gap-6 mt-10 pt-6 border-t border-gray-700">
        <button
          className="text-gray-400 hover:text-gray-200 text-sm font-medium"
          onClick={() => closeModal('certifications')}
        >
          Cancel
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-500 px-10 py-3 rounded-lg font-medium text-white shadow-md transition"
          onClick={() => {
            console.log('Save certification details');
            closeModal('certifications');
          }}
        >
          Save
        </button>
      </div>
    </motion.div>
  </motion.div>
)}

    </div>
  );
}