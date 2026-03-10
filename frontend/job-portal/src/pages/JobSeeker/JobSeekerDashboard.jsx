/* eslint-disable no-unused-vars */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

import {
  Bookmark,
  ChevronDown,
  User,
  LogOut,
  Briefcase,
  Home,
  MapPin,
  IndianRupee,
  Search,
  Bell,
  Star,
  CalendarDays,
  Eye,
} from "lucide-react";

import DepartmentFilter from "../Filters/DepartmentFilter";
import LocationFilter from "../Filters/LocationFilter";
import CompanyTypeFilter from "../Filters/CompanyTypeFilter";
import RoleCategoryFilter from "../Filters/RoleCategoryFilter";
import EducationFilter from "../Filters/EducationFilter";
import IndustryFilter from "../Filters/IndustryFilter";
import SalaryFilter from "../Filters/SalaryFilter";
import WorkModeFilter from "../Filters/WorkModeFilter";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API = "http://localhost:5000";
const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const initialFilters = {
  department: [],
  location: [],
  companyType: [],
  roleCategory: [],
  education: [],
  industry: [],
  workMode: [],
  salary: [],
};

const normalizeSelected = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const formatSalary = (min, max) => {
  const minVal = min ?? 0;
  const maxVal = max ?? 0;
  return `₹ ${minVal}-${maxVal} Lacs PA`;
};

const formatExperience = (min, max) => {
  return `${min ?? 0}-${max ?? 0} yrs`;
};

const formatPostedDate = (dateString) => {
  if (!dateString) return "Recently posted";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Recently posted";

  const now = new Date();
  const diffMs = now - date;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatCardDate = (dateString) => {
  if (!dateString) return "Recently posted";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Recently posted";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const matchesOneOf = (jobValue, selectedValues) => {
  const normalizedJobValue = normalizeText(jobValue);
  const normalizedSelected = selectedValues.map(normalizeText);
  return normalizedSelected.includes(normalizedJobValue);
};

const isWithinSalaryRange = (job, range) => {
  const minSalary = toNumber(job.minSalary, 0);
  const maxSalary = toNumber(job.maxSalary, 0);

  if (range === "0-3") return minSalary >= 0 && maxSalary <= 3;
  if (range === "3-6") return minSalary >= 3 && maxSalary <= 6;
  if (range === "6-10") return minSalary >= 6 && maxSalary <= 10;
  if (range === "10-15") return minSalary >= 10 && maxSalary <= 15;
  if (range === "15-25") return minSalary >= 15 && maxSalary <= 25;
  if (range === "25-50") return minSalary >= 25 && maxSalary <= 50;

  return false;
};

const getCompanyLogo = (job) => {
  if (job?.companyLogo?.startsWith("http")) return job.companyLogo;
  if (job?.companyLogo) {
    return `${API}/${job.companyLogo}`.replace(/([^:]\/)\/+/g, "$1");
  }
  return DEFAULT_AVATAR;
};

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const loadMoreRef = useRef(null);

  const [jobs, setJobs] = useState([]);
  const [displayJobs, setDisplayJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [search, setSearch] = useState("");
  const [experience, setExperience] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [visibleCount, setVisibleCount] = useState(8);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [userLocation, setUserLocation] = useState({
    lat: null,
    lng: null,
  });

  const [filters, setFilters] = useState(initialFilters);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const user = {
    fullName: storedUser?.fullName || storedUser?.name || "Job Seeker",
    profilePic: storedUser?.profilePic || DEFAULT_AVATAR,
    skills: Array.isArray(storedUser?.skills) ? storedUser.skills : [],
  };

  /* ================= LOAD JOBS ================= */

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API}/api/jobs`);

        if (!res.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load jobs:", error);
        setJobs([]);
      }
    };

    fetchJobs();
  }, []);

  /* ================= LOAD SAVED JOBS ================= */

  useEffect(() => {
    const fetchSavedJobs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API}/api/saved-jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();

        const ids = Array.isArray(data)
          ? data.map((item) => item?.jobId?._id || item?.jobId).filter(Boolean)
          : [];

        setSavedJobs(ids);
      } catch (error) {
        console.error("Failed to load saved jobs:", error);
      }
    };

    fetchSavedJobs();
  }, []);

  /* ================= LOAD NOTIFICATIONS ================= */

  useEffect(() => {
    if (!notificationsEnabled) return;

    let intervalId;

    const fetchLatestJobs = async () => {
      try {
        const res = await fetch(`${API}/api/jobs/latest`);

        if (!res.ok) {
          if (res.status >= 500) {
            console.error("Latest jobs API failed with status:", res.status);
            setNotificationsEnabled(false);
          }
          return;
        }

        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load notifications:", error);
        setNotificationsEnabled(false);
      }
    };

    fetchLatestJobs();
    intervalId = setInterval(fetchLatestJobs, 20000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [notificationsEnabled]);

  /* ================= GEO LOCATION ================= */

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  /* ================= FILTERED JOBS ================= */

  const filteredJobs = useMemo(() => {
    let updatedJobs = [...jobs];

    if (search.trim()) {
      const q = search.trim().toLowerCase();

      updatedJobs = updatedJobs.filter((job) => {
        const title = job.title?.toLowerCase() || "";
        const companyName = job.companyName?.toLowerCase() || "";
        const location = job.location?.toLowerCase() || "";
        const skills = Array.isArray(job.skills) ? job.skills : [];

        return (
          title.includes(q) ||
          companyName.includes(q) ||
          location.includes(q) ||
          skills.some((skill) => String(skill).toLowerCase().includes(q))
        );
      });
    }

    if (experience > 0) {
      updatedJobs = updatedJobs.filter((job) => {
        const minExp = toNumber(job.minExp, 0);
        const maxExp = toNumber(job.maxExp, 50);
        return minExp <= experience && maxExp >= experience;
      });
    }

    const departmentSelected = normalizeSelected(filters.department);
    if (departmentSelected.length > 0) {
      updatedJobs = updatedJobs.filter((job) =>
        matchesOneOf(job.department, departmentSelected)
      );
    }

    const locationSelected = normalizeSelected(filters.location);
    if (locationSelected.length > 0) {
      updatedJobs = updatedJobs.filter((job) =>
        matchesOneOf(job.location, locationSelected)
      );
    }

    const companyTypeSelected = normalizeSelected(filters.companyType);
    if (companyTypeSelected.length > 0) {
      updatedJobs = updatedJobs.filter((job) =>
        matchesOneOf(job.companyType, companyTypeSelected)
      );
    }

    const roleSelected = normalizeSelected(filters.roleCategory);
    if (roleSelected.length > 0) {
      updatedJobs = updatedJobs.filter((job) =>
        matchesOneOf(job.roleCategory, roleSelected)
      );
    }

    const educationSelected = normalizeSelected(filters.education);
    if (educationSelected.length > 0) {
      updatedJobs = updatedJobs.filter((job) =>
        matchesOneOf(job.education, educationSelected)
      );
    }

    const industrySelected = normalizeSelected(filters.industry);
    if (industrySelected.length > 0) {
      updatedJobs = updatedJobs.filter((job) =>
        matchesOneOf(job.industry, industrySelected)
      );
    }

    const workModeSelected = normalizeSelected(filters.workMode);
    if (workModeSelected.length > 0) {
      updatedJobs = updatedJobs.filter((job) =>
        matchesOneOf(job.workMode, workModeSelected)
      );
    }

    const salarySelected = normalizeSelected(filters.salary);
    if (salarySelected.length > 0) {
      updatedJobs = updatedJobs.filter((job) =>
        salarySelected.some((range) => isWithinSalaryRange(job, range))
      );
    }

    return updatedJobs;
  }, [jobs, search, experience, filters]);

  useEffect(() => {
    setVisibleCount(8);
  }, [search, experience, filters]);

  useEffect(() => {
    setDisplayJobs(filteredJobs.slice(0, visibleCount));
  }, [filteredJobs, visibleCount]);

  /* ================= INFINITE SCROLL ================= */

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && visibleCount < filteredJobs.length) {
          setVisibleCount((prev) => prev + 6);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [visibleCount, filteredJobs.length]);

  /* ================= SAVE JOB ================= */

  const handleSaveJob = async (e, jobId) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login first");
      return;
    }

    try {
      const res = await fetch(`${API}/api/saved-jobs/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save job");
      }

      setSavedJobs((prev) => (prev.includes(jobId) ? prev : [...prev, jobId]));
    } catch (error) {
      alert(error.message || "Unable to save job");
    }
  };

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getMatchScore = (jobSkills = []) => {
    const userSkills = Array.isArray(user.skills) ? user.skills : [];
    if (!userSkills.length || !jobSkills.length) return 0;

    const lowerUser = userSkills.map((s) => String(s).toLowerCase());
    const matched = jobSkills.filter((s) =>
      lowerUser.includes(String(s).toLowerCase())
    );

    return Math.round((matched.length / jobSkills.length) * 100);
  };

  return (
    <div className="relative min-h-screen bg-[#020617] text-white">
      <AnimatedBackground />

      {/* HEADER */}
      <div className="sticky top-0 z-30 border-b border-slate-800 bg-[#020617]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-475 items-center justify-between px-6 py-4 lg:px-10">
          <h1
            onClick={() => navigate("/")}
            className="cursor-pointer text-2xl font-bold text-cyan-400"
          >
            Job Portal
          </h1>

          <div className="mx-6 flex max-w-xl flex-1 items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 shadow-sm">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs by title, company, location, skills..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-cyan-400"
            >
              <Home size={18} />
              Home
            </button>

            <div className="relative">
              <button
                onClick={() => setNotificationOpen((prev) => !prev)}
                className="relative rounded-full border border-slate-700 bg-slate-900 p-2.5 shadow-sm transition hover:bg-slate-800"
              >
                <Bell size={18} className="text-slate-200" />
                {notifications.length > 0 && (
                  <span className="absolute -right-1 -top-1 min-w-4.5 rounded-full bg-red-500 px-1.5 text-center text-[10px] font-semibold text-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 top-14 z-40 w-80 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl"
                  >
                    <div className="border-b border-slate-800 px-4 py-3">
                      <h3 className="text-sm font-semibold text-white">
                        Notifications
                      </h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {!notificationsEnabled ? (
                        <p className="px-4 py-5 text-sm text-slate-400">
                          Notifications are temporarily unavailable
                        </p>
                      ) : notifications.length === 0 ? (
                        <p className="px-4 py-5 text-sm text-slate-400">
                          No new job notifications
                        </p>
                      ) : (
                        notifications.map((job) => (
                          <button
                            key={job._id}
                            onClick={() => {
                              setNotificationOpen(false);
                              navigate(`/job/${job._id}`);
                            }}
                            className="block w-full border-b border-slate-800 px-4 py-4 text-left transition last:border-b-0 hover:bg-slate-900"
                          >
                            <p className="line-clamp-1 text-sm font-semibold text-white">
                              {job.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {job.companyName || "Company"} •{" "}
                              {formatPostedDate(job.createdAt)}
                            </p>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 shadow-sm transition hover:bg-slate-800"
              >
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="h-10 w-10 rounded-full border border-slate-700 object-cover"
                  onError={(e) => {
                    e.target.src = DEFAULT_AVATAR;
                  }}
                />
                <span className="max-w-35 truncate text-sm font-semibold text-white">
                  {user.fullName}
                </span>
                <ChevronDown size={16} className="text-slate-400" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-14 z-40 w-56 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl"
                  >
                    <button
                      onClick={() => navigate("/profile")}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-200 hover:bg-slate-900"
                    >
                      <User size={16} />
                      Profile
                    </button>

                    <button
                      onClick={() => navigate("/saved-jobs")}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-slate-200 hover:bg-slate-900"
                    >
                      <Briefcase size={16} />
                      Saved Jobs
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-400 hover:bg-red-950/40"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="mx-auto flex max-w-475 gap-6 px-4 py-6 lg:px-6">
        {/* LEFT SIDEBAR */}
        <aside className="sticky top-24 h-fit w-80 rounded-3xl border border-slate-800 bg-[#0f172a]/95 p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-white">Filters</h2>

          <div className="mb-6">
            <p className="mb-2 text-sm font-medium text-slate-300">
              Experience: {experience} years
            </p>
            <input
              type="range"
              min="0"
              max="20"
              value={experience}
              onChange={(e) => setExperience(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <DepartmentFilter filters={filters} setFilters={setFilters} />
          <LocationFilter filters={filters} setFilters={setFilters} />

          <CompanyTypeFilter
            selected={filters.companyType}
            setSelected={(v) =>
              setFilters((prev) => ({ ...prev, companyType: v }))
            }
          />

          <RoleCategoryFilter
            selected={filters.roleCategory}
            setSelected={(v) =>
              setFilters((prev) => ({ ...prev, roleCategory: v }))
            }
          />

          <EducationFilter
            selected={filters.education}
            setSelected={(v) =>
              setFilters((prev) => ({ ...prev, education: v }))
            }
          />

          <IndustryFilter
            selected={filters.industry}
            setSelected={(v) =>
              setFilters((prev) => ({ ...prev, industry: v }))
            }
          />

          <SalaryFilter
            selected={filters.salary}
            setSelected={(v) =>
              setFilters((prev) => ({ ...prev, salary: v }))
            }
          />

          <WorkModeFilter
            selected={filters.workMode}
            setSelected={(v) =>
              setFilters((prev) => ({ ...prev, workMode: v }))
            }
          />

          {userLocation.lat && userLocation.lng && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-medium text-slate-300">
                Your Location
              </p>
              <div className="overflow-hidden rounded-2xl border border-slate-700">
                <MapContainer
                  center={[userLocation.lat, userLocation.lng]}
                  zoom={13}
                  style={{ height: "220px", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[userLocation.lat, userLocation.lng]}>
                    <Popup>You are here</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-2xl bg-slate-900 p-4">
            <p className="text-sm text-slate-400">Total Jobs</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {filteredJobs.length}
            </p>
          </div>
        </aside>

        {/* CENTER JOB LIST */}
        <main className="min-w-0 flex-1">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Available Jobs</h1>
              <p className="mt-1 text-sm text-slate-400">
                Showing {displayJobs.length} of {filteredJobs.length} jobs
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {displayJobs.map((job, index) => {
              const saved = savedJobs.includes(job._id);
              const rating = job.companyRating ?? job.rating ?? 3.9;
              const reviews = job.reviewCount ?? job.reviews ?? 2338;
              const matchScore = getMatchScore(job.skills || []);

              return (
                <motion.div
                  key={job._id}
                  onClick={() => navigate(`/job/${job._id}`)}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{ y: -2 }}
                  className="cursor-pointer rounded-[28px] border border-slate-800 bg-[#0f172a]/95 p-6 shadow-sm transition hover:border-cyan-500/50 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="line-clamp-1 text-[28px] font-semibold leading-tight text-white">
                        {job.title || "Untitled Job"}
                      </h2>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[22px] text-slate-300">
                        <span className="font-medium text-slate-200">
                          {job.companyName || "Company"}
                        </span>

                        <span className="inline-flex items-center gap-1 text-amber-400">
                          <Star size={16} fill="currentColor" />
                          <span className="text-slate-200">{rating}</span>
                        </span>

                        <span className="text-slate-400">{reviews} Reviews</span>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-6 text-[22px] text-slate-300">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays size={18} className="text-slate-400" />
                          {formatCardDate(job.createdAt)}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <IndianRupee size={18} className="text-slate-400" />
                          {formatSalary(job.minSalary, job.maxSalary)}
                        </span>

                        <span className="inline-flex items-center gap-2">
                          <MapPin size={18} className="text-slate-400" />
                          {job.location || "Location not specified"}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                        <span className="rounded-full bg-cyan-500/10 px-3 py-1 font-medium text-cyan-300">
                          {formatExperience(job.minExp, job.maxExp)}
                        </span>

                        <span className="rounded-full bg-orange-500/10 px-3 py-1 font-medium text-orange-300">
                          {job.workMode || "Walk-in"}
                        </span>

                        <span className="text-slate-400">
                          {formatPostedDate(job.createdAt)}
                        </span>

                        {matchScore > 0 && (
                          <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-medium text-emerald-300">
                            {matchScore}% skill match
                          </span>
                        )}
                      </div>

                      <div className="mt-5">
                        <p className="mb-2 text-sm font-semibold text-slate-200">
                          Required Skills:
                        </p>

                        <div className="flex flex-wrap gap-x-3 gap-y-2 text-sm text-slate-300">
                          {Array.isArray(job.skills) && job.skills.length > 0 ? (
                            job.skills.map((skill, i) => (
                              <span key={i} className="inline-flex items-center">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500">No skills listed</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex w-30 flex-col items-end justify-between gap-5">
                      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
                        <img
                          src={getCompanyLogo(job)}
                          alt="Company Logo"
                          className="h-12 w-12 object-contain"
                          onError={(e) => {
                            e.target.src = DEFAULT_AVATAR;
                          }}
                        />
                      </div>

                      <button
                        onClick={(e) => handleSaveJob(e, job._id)}
                        className={`inline-flex items-center gap-2 text-sm font-medium transition ${
                          saved
                            ? "text-cyan-400"
                            : "text-slate-300 hover:text-cyan-400"
                        }`}
                      >
                        <Bookmark
                          size={18}
                          fill={saved ? "currentColor" : "none"}
                        />
                        {saved ? "Saved" : "Save"}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/job/${job._id}`);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-white"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {displayJobs.length === 0 && (
              <div className="rounded-3xl border border-slate-800 bg-[#0f172a]/95 p-10 text-center shadow-sm">
                <h3 className="text-xl font-semibold text-white">
                  No jobs found
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  Try changing filters or search keywords.
                </p>
              </div>
            )}

            <div ref={loadMoreRef} className="h-8" />
          </div>
        </main>

        {/* RIGHT PANEL */}
        <aside className="sticky top-24 h-fit w-80 rounded-3xl border border-slate-800 bg-[#0f172a]/95 p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Bell size={18} className="text-slate-200" />
            <h2 className="text-lg font-semibold text-white">
              Notifications
            </h2>
          </div>

          {notifications.length === 0 ? (
            <p className="text-sm text-slate-400">
              {!notificationsEnabled
                ? "Notifications unavailable"
                : "No new jobs"}
            </p>
          ) : (
            <div className="space-y-3">
              {notifications.map((job) => (
                <button
                  key={job._id}
                  onClick={() => navigate(`/job/${job._id}`)}
                  className="block w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-left transition hover:bg-slate-900"
                >
                  <p className="line-clamp-1 text-sm font-semibold text-white">
                    {job.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {job.companyName || "Company"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatPostedDate(job.createdAt)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;