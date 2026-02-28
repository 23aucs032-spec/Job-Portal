// src/pages/ProfilePage.tsx
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
} from 'lucide-react';

export default function ProfilePage() {
  // Modal control
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
  });

const openModal = (name) => {
  setModals((prev) => ({ ...prev, [name]: true }));
};

const closeModal = (name) => {
  setModals((prev) => ({ ...prev, [name]: false }));
};

  // Profile header data
  const profile = {
    name: 'karthik',
    degree: 'B.Sc - Bachelor of Science',
    college:
      "Virudhunagar Hindu Nadars' Senthi Kumara Nadar College (VHNSNC), Virudhunagar",
    location: 'Virudhunagar',
    mobile: '9025555530',
    email: '23aucs032@vhnsn...',
    gender: 'Male',
    dob: '15th September 2005',
    completion: 40,
  };

  const preferences = {
    types: ['Jobs', 'Internships'],
    availability: 'Add work availability',
    locations: ['Bengaluru', 'Delhi / NCR', 'Mumbai'],
  };

  const education = {
    course: 'B.Sc - Bachelor of Science',
    specialization: 'Computer Science and Technology',
    college:
      "Virudhunagar Hindu Nadars' Senthi Kumara Nadar College (VHNSNC), Virudhunagar",
    duration: '2023 – 2026',
    type: 'Full Time',
  };

  const skills = ['React.js', 'React Native', 'Redux'];

  const languages = ['English', 'Hindi', 'Tamil'];

  const resume = {
    name: 'Resume_karthik.pdf',
    uploaded: 'Jan 31, 2026',
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header */}
        <div className="bg-[#161b22] border border-gray-800 rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-6 md:items-start">
            {/* Avatar + percentage */}
            <div className="relative mx-auto md:mx-0">
              <div className="w-32 h-32 rounded-full border-4 border-red-600 overflow-hidden shadow-lg">
                <img
                  src="https://via.placeholder.com/150/222/111?text=KP"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0d1117] px-5 py-1 text-sm font-bold rounded-full border border-gray-700 shadow-md">
                {profile.completion}%
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-3xl md:text-4xl font-bold text-white capitalize">
                  {profile.name}
                </h1>
                <Edit2 size={20} className="text-gray-400 hover:text-blue-400 cursor-pointer" />
              </div>

              <p className="text-xl text-gray-300 mt-2 font-medium">{profile.degree}</p>
              <p className="text-gray-400 mt-1">{profile.college}</p>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  {profile.location}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Phone size={16} className="text-gray-400" />
                  {profile.mobile}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <User size={16} className="text-gray-400" />
                  {profile.gender}
                </div>
                <div className="col-span-2 sm:col-span-1 flex items-center justify-center md:justify-start gap-2">
                  <Mail size={16} className="text-gray-400" />
                  {profile.email} <CheckCircle2 size={16} className="text-green-500" />
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  {profile.dob}
                </div>
              </div>
            </div>

            {/* Missing details */}
            <div className="bg-linear-to-br from-amber-950/70 to-amber-900/40 rounded-xl p-6 w-full md:w-80 flex flex-col items-center text-center border border-amber-800/50">
              <button className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 px-8 rounded-lg font-medium transition shadow-md">
                Add 11 missing details
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Links */}
          <aside className="lg:col-span-1">
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-6 sticky top-6">
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
                  { icon: Trophy, label: 'Competitive exams' },
                  { icon: Building, label: 'Employment', action: () => openModal('employment') },
                  { icon: FileText, label: 'Resume' },
                  { icon: Heart, label: 'Club & committees', action: () => openModal('clubCommittees') },
                  { icon: Award, label: 'Awards', action: () => openModal('awards') },
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
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3 space-y-6">
            {/* Preferences */}
            <section className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Your career preferences</h2>
                <Edit2 size={18} className="text-gray-400 hover:text-blue-400 cursor-pointer" onClick={() => openModal('preference')} />
              </div>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="text-gray-500">Preferred job type</p>
                  <p className="font-medium">{preferences.types.join(', ')}</p>
                </div>
                <div>
                  <p className="text-gray-500">Availability to work</p>
                  <p className="text-blue-400 font-medium">{preferences.availability}</p>
                </div>
                <div>
                  <p className="text-gray-500">Preferred location(s)</p>
                  <p className="font-medium">{preferences.locations.join(', ')}</p>
                </div>
              </div>
            </section>

            {/* Education */}
            <section className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Education</h2>
                <Edit2 size={18} className="text-gray-400 hover:text-blue-400 cursor-pointer" onClick={() => openModal('education')} />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold">{education.course}</p>
                <p className="text-blue-400 font-medium">{education.specialization}</p>
                <p className="text-gray-300">{education.college}</p>
                <p className="text-gray-400">
                  {education.duration} • {education.type}
                </p>
              </div>
            </section>

            {/* Skills */}
            <section className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
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
                <button className="text-blue-400 text-sm hover:underline">+ Add</button>
              </div>
            </section>

            {/* Languages */}
            <section className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
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
            </section>

            {/* Resume */}
            <section className="bg-[#161b22] border border-gray-800 rounded-xl p-6">
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
            </section>

            {/* Placeholder */}
            <div className="bg-[#161b22] border border-gray-800 rounded-xl p-12 text-center text-gray-500">
              Certifications • Awards • Club & committees • Competitive exams
              <br />
              <span className="text-gray-400 mt-3 block text-sm">
                Add details to unlock these sections
              </span>
            </div>
          </main>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          MODALS (matching your latest screenshots)
      ───────────────────────────────────────────── */}

      {/* Preference Modal */}
      {modals.preference && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161b22] rounded-2xl w-full max-w-lg p-8 border border-gray-700 relative">
            <X
              className="absolute right-6 top-6 cursor-pointer text-gray-400 hover:text-white"
              size={24}
              onClick={() => closeModal('preference')}
            />
            <h2 className="text-2xl font-bold text-white mb-6">Career preferences</h2>

            <div className="space-y-6 text-gray-300">
              <div>
                <p className="font-medium mb-3">Looking for</p>
                <div className="flex flex-wrap gap-3">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-full">Internships</button>
                  <button className="px-6 py-2 bg-gray-700 rounded-full">Jobs</button>
                </div>
              </div>

              <div>
                <p className="font-medium mb-3">Availability to work</p>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3">
                  <option>15 Days or less</option>
                  <option>1 Month</option>
                  <option>2 Months</option>
                  <option>3 Months</option>
                  <option>More than 3 Months</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button className="text-gray-400 hover:text-gray-200" onClick={() => closeModal('preference')}>
                  I'll add this later
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Education Modal */}
      {modals.education && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#161b22] rounded-2xl w-full max-w-2xl p-8 border border-gray-700 relative">
            <X
              className="absolute right-6 top-6 cursor-pointer text-gray-400 hover:text-white"
              size={24}
              onClick={() => closeModal('education')}
            />
            <h2 className="text-2xl font-bold text-white mb-6">Education</h2>

            <div className="space-y-6 text-gray-300">
              <div>
                <label className="block text-sm font-medium mb-2">Course name</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3">
                  <option>B.Sc - Bachelor of Science</option>
                  <option>B.Tech/B.E. - Bachelor of Technology / Engineering</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Specialization</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                  defaultValue="Computer Science and Technology"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">College name</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                  defaultValue={education.college}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Grading system</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3">
                  <option>Course Requires a Pass</option>
                  <option>Scale 10 Grading System</option>
                  <option>Scale 4 Grading System</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">From</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option>2023</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">To</label>
                  <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option>2026</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Course type</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3">
                  <option>Full Time</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button className="text-gray-400 hover:text-gray-200" onClick={() => closeModal('education')}>
                  Cancel
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skills Modal */}
      {modals.skills && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161b22] rounded-2xl w-full max-w-lg p-8 border border-gray-700 relative">
            <X
              className="absolute right-6 top-6 cursor-pointer text-gray-400 hover:text-white"
              size={24}
              onClick={() => closeModal('skills')}
            />
            <h2 className="text-2xl font-bold text-white mb-6">Key skills</h2>

            <div className="space-y-5">
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200"
                  placeholder="e.g. React.js, Python, AWS ..."
                />
                <button className="bg-blue-600 hover:bg-blue-500 px-5 rounded-lg">
                  <Plus size={22} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-20">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="bg-gray-700 text-gray-200 px-4 py-1.5 rounded-full text-sm flex items-center gap-2 border border-gray-600"
                  >
                    {s}
                    <X size={14} className="cursor-pointer hover:text-red-400" />
                  </span>
                ))}
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button className="text-gray-400 hover:text-gray-200" onClick={() => closeModal('skills')}>
                  Cancel
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Languages Modal */}
      {modals.languages && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161b22] rounded-2xl w-full max-w-lg p-8 border border-gray-700 relative">
            <X
              className="absolute right-6 top-6 cursor-pointer text-gray-400 hover:text-white"
              size={24}
              onClick={() => closeModal('languages')}
            />
            <h2 className="text-2xl font-bold text-white mb-6">Languages known</h2>

            <div className="space-y-5">
              <div className="flex gap-3">
                <select className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-3 text-gray-200">
                  <option>Select language...</option>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Tamil</option>
                  <option>Telugu</option>
                  <option>French</option>
                </select>
                <button className="bg-blue-600 hover:bg-blue-500 px-5 rounded-lg">
                  <Plus size={22} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 min-h-20">
                {languages.map((l) => (
                  <span
                    key={l}
                    className="bg-gray-700 text-gray-200 px-4 py-1.5 rounded-full text-sm flex items-center gap-2 border border-gray-600"
                  >
                    {l}
                    <X size={14} className="cursor-pointer hover:text-red-400" />
                  </span>
                ))}
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button className="text-gray-400 hover:text-gray-200" onClick={() => closeModal('languages')}>
                  Cancel
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Internships Modal (matches your screenshot exactly) */}
      {modals.internships && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161b22] rounded-2xl w-full max-w-2xl p-8 border border-gray-700 relative">
            <X
              className="absolute right-6 top-6 cursor-pointer text-gray-400 hover:text-white"
              size={24}
              onClick={() => closeModal('internships')}
            />
            <h2 className="text-2xl font-bold text-white mb-6">Internships</h2>

            <div className="space-y-6 text-gray-300">
              <div>
                <label className="block text-sm font-medium mb-2">Company name</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                  placeholder="Enter the name of the company"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Internship duration</label>
                <div className="grid grid-cols-3 gap-2">
                  <select className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option>Month</option>
                  </select>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option>Year</option>
                  </select>
                  <span className="flex items-center justify-center text-gray-400">to</span>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option>Month</option>
                  </select>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option>Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project name</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                  placeholder="Enter the name of the project you undertook"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Describe what you did at internship</label>
                <textarea
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 h-32"
                  placeholder="Enter the responsibilities you held, anything you accomplished or learned while serving in your internship"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Key skills (optional)</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                  placeholder="Enter the skills you used in this role"
                />
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button className="text-gray-400 hover:text-gray-200" onClick={() => closeModal('internships')}>
                  Cancel
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Modal (matches your screenshot) */}
      {modals.projects && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161b22] rounded-2xl w-full max-w-2xl p-8 border border-gray-700 relative">
            <X
              className="absolute right-6 top-6 cursor-pointer text-gray-400 hover:text-white"
              size={24}
              onClick={() => closeModal('projects')}
            />
            <h2 className="text-2xl font-bold text-white mb-6">Projects</h2>

            <div className="space-y-6 text-gray-300">
              <div>
                <label className="block text-sm font-medium mb-2">Project name</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                  placeholder="Enter the name of the project you worked on"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project duration</label>
                <div className="grid grid-cols-3 gap-2">
                  <select className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option>Month</option>
                  </select>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option>Year</option>
                  </select>
                  <span className="flex items-center justify-center text-gray-400">to</span>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option>Month</option>
                  </select>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option>Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Describe what the project was about</label>
                <textarea
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 h-28"
                  placeholder="Enter what the project was about"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Enter your learnings throughout the process of making the project and what you liked the most about it
                </label>
                <textarea
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 h-28"
                  placeholder="Your learnings and favorite part..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Key skills used in the project (optional)</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                  placeholder="Enter key skills used in the project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project URL (optional)</label>
                <input
                  type="url"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                  placeholder="Enter the website link of your project"
                />
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button className="text-gray-400 hover:text-gray-200" onClick={() => closeModal('projects')}>
                  Cancel
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Summary Modal */}
      {modals.summary && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161b22] rounded-2xl w-full max-w-2xl p-8 border border-gray-700 relative">
            <X
              className="absolute right-6 top-6 cursor-pointer text-gray-400 hover:text-white"
              size={24}
              onClick={() => closeModal('summary')}
            />
            <h2 className="text-2xl font-bold text-white mb-6">Profile summary</h2>

            <div className="space-y-4 text-gray-300">
              <p className="text-sm text-gray-400 leading-relaxed">
                Your Profile Summary should mention the highlights of your career and education, what your professional interests are, and what kind of career you are looking for. Write a meaningful summary of more than 50 characters.
              </p>

              <textarea
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 h-48 text-gray-200 resize-none"
                placeholder="Type here..."
              />

              <div className="flex justify-end gap-4 mt-6">
                <button className="text-gray-400 hover:text-gray-200" onClick={() => closeModal('summary')}>
                  Cancel
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accomplishments / Academic achievements Modal */}
      {modals.accomplishments && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161b22] rounded-2xl w-full max-w-lg p-8 border border-gray-700 relative">
            <X
              className="absolute right-6 top-6 cursor-pointer text-gray-400 hover:text-white"
              size={24}
              onClick={() => closeModal('accomplishments')}
            />
            <h2 className="text-2xl font-bold text-white mb-6">Academic achievements</h2>

            <div className="space-y-5 text-gray-300">
              <div>
                <label className="block text-sm font-medium mb-2">Received during</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3">
                  <option>During B.Sc - Bachelor of Science</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Achievements</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'College topper',
                    'Department topper',
                    'Top 3 in class',
                    'Top 10 in class',
                    'Gold medalist',
                    'Received scholarship',
                    'All rounder',
                    'Other',
                  ].map((item) => (
                    <button
                      key={item}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-sm"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  className="text-gray-400 hover:text-gray-200"
                  onClick={() => closeModal('accomplishments')}
                >
                  Cancel
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employment Modal */}
      {modals.employment && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161b22] rounded-2xl w-full max-w-2xl p-8 border border-gray-700 relative">
            <X
              className="absolute right-6 top-6 cursor-pointer text-gray-400 hover:text-white"
              size={24}
              onClick={() => closeModal('employment')}
            />
            <h2 className="text-2xl font-bold text-white mb-6">Employment details</h2>

            <div className="space-y-6 text-gray-300">
              <div>
                <label className="block text-sm font-medium mb-2">Total work experience</label>
                <div className="flex gap-3">
                  <select className="w-1/2 bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option>Years</option>
                    <option>0</option>
                    <option>1</option>
                    {/* ... */}
                  </select>
                  <select className="w-1/2 bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option>Months</option>
                    <option>0</option>
                    <option>1</option>
                    {/* ... */}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Company name</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                  placeholder="Enter the name of the company you worked at"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Designation</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                  placeholder="Enter the designation you held"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Working since</label>
                <div className="grid grid-cols-3 gap-2">
                  <select className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option>Month</option>
                  </select>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option>Year</option>
                  </select>
                  <span className="flex items-center justify-center text-gray-400">to</span>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option>Month</option>
                  </select>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <option>Year</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 mt-2 text-sm">
                  <input type="checkbox" className="accent-blue-600" />
                  I currently work here
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 h-32"
                  placeholder="Enter the responsibilities you held, anything you accomplished or learned while serving in your full time job"
                />
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button className="text-gray-400 hover:text-gray-200" onClick={() => closeModal('employment')}>
                  Cancel
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Awards Modal */}
      {modals.awards && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161b22] rounded-2xl w-full max-w-lg p-8 border border-gray-700 relative">
            <X
              className="absolute right-6 top-6 cursor-pointer text-gray-400 hover:text-white"
              size={24}
              onClick={() => closeModal('awards')}
            />
            <h2 className="text-2xl font-bold text-white mb-6">Awards</h2>

            <div className="space-y-5 text-gray-300">
              <textarea
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 h-40 text-gray-200 resize-none"
                placeholder="Mention your academic or extra-curricular achievements where you were recognised for your performance"
              />

              <div className="flex justify-end gap-4 mt-8">
                <button className="text-gray-400 hover:text-gray-200" onClick={() => closeModal('awards')}>
                  Cancel
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Club & Committees Modal */}
      {modals.clubCommittees && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#161b22] rounded-2xl w-full max-w-2xl p-8 border border-gray-700 relative">
            <X
              className="absolute right-6 top-6 cursor-pointer text-gray-400 hover:text-white"
              size={24}
              onClick={() => closeModal('clubCommittees')}
            />
            <h2 className="text-2xl font-bold text-white mb-6">Club & committees</h2>

            <div className="space-y-6 text-gray-300">
              <div>
                <label className="block text-sm font-medium mb-2">Club or committee name</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                  placeholder="Eg - E-Cell"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Designation / Position of responsibility</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3"
                  placeholder="Eg - Head boy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Associate with education (optional)</label>
                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3">
                  <option>Select an option</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-2">From</label>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg p-3 w-full">
                    <option>Month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg p-3 w-full">
                    <option>Year</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <span className="text-gray-400">to</span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">To</label>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg p-3 w-full">
                    <option>Month</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <select className="bg-gray-800 border border-gray-700 rounded-lg p-3 w-full">
                    <option>Year</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="accent-blue-600" />
                I currently work here / hold this position
              </label>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 h-32"
                  placeholder="Describe your responsibilities and experiences at this position"
                />
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  className="text-gray-400 hover:text-gray-200"
                  onClick={() => closeModal('clubCommittees')}
                >
                  Cancel
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
