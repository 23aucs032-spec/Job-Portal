/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Mail,
  MapPin,
  Briefcase,
  Users,
  Hash,
  Upload,
  ArrowLeft,
  Save,
  UserCircle2,
  BadgeInfo,
  Layers3,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Phone,
  FileText,
  BadgeCheck,
  PlusCircle,
} from "lucide-react";

const API = "http://localhost:5000";

const RecruiterProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    accountType: "",
    hiringFor: "",
    companyName: "",
    industry: "",
    employeesRange: "",
    designation: "",
    pincode: "",
    companyAddress: "",
    logo: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [previewLogo, setPreviewLogo] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

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

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    if (!token) {
      navigate("/recruiter/login");
      return;
    }

    const fetchProfile = async () => {
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

        setProfile({
          fullName: data?.fullName || data?.name || "",
          email: data?.email || "",
          accountType: data?.accountType || "",
          hiringFor: data?.hiringFor || "",
          companyName: data?.companyName || "",
          industry: data?.industry || "",
          employeesRange: data?.employeesRange || "",
          designation: data?.designation || "",
          pincode: data?.pincode || "",
          companyAddress: data?.companyAddress || data?.address || "",
          logo: data?.logo || "",
        });

        if (data?.logo) {
          setPreviewLogo(
            data.logo.startsWith("http") ? data.logo : `${API}${data.logo}`
          );
        } else {
          setPreviewLogo("");
        }
      } catch (error) {
        alert(error.message || "Unable to load profile");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/recruiter/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token]);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file");
      return;
    }

    setLogoFile(file);
    setPreviewLogo(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("fullName", profile.fullName);
      formData.append("companyName", profile.companyName);
      formData.append("designation", profile.designation);
      formData.append("employeesRange", profile.employeesRange);
      formData.append("pincode", profile.pincode);
      formData.append("companyAddress", profile.companyAddress);
      formData.append("industry", profile.industry);
      formData.append("hiringFor", profile.hiringFor);
      formData.append("accountType", profile.accountType);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const res = await fetch(`${API}/api/recruiter/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update recruiter profile");
      }

      const updatedRecruiter = data?.recruiter || data;

      setProfile({
        fullName: updatedRecruiter?.fullName || updatedRecruiter?.name || "",
        email: updatedRecruiter?.email || "",
        accountType: updatedRecruiter?.accountType || "",
        hiringFor: updatedRecruiter?.hiringFor || "",
        companyName: updatedRecruiter?.companyName || "",
        industry: updatedRecruiter?.industry || "",
        employeesRange: updatedRecruiter?.employeesRange || "",
        designation: updatedRecruiter?.designation || "",
        pincode: updatedRecruiter?.pincode || "",
        companyAddress:
          updatedRecruiter?.companyAddress || updatedRecruiter?.address || "",
        logo: updatedRecruiter?.logo || "",
      });

      setPreviewLogo(
        updatedRecruiter?.logo
          ? updatedRecruiter.logo.startsWith("http")
            ? updatedRecruiter.logo
            : `${API}${updatedRecruiter.logo}`
          : ""
      );

      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          ...updatedRecruiter,
        })
      );

      setLogoFile(null);
      alert("Recruiter profile updated successfully");
    } catch (error) {
      alert(error.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  const recruiterName = profile.fullName || "Recruiter";
  const companyName = profile.companyName || "Company Name";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617]">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="px-8 py-10 text-lg text-white border shadow-2xl bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl">
            Loading recruiter profile...
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
                  <p className="text-xs text-slate-400">Recruiter Profile</p>
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
                  className="px-4 py-2 text-sm font-medium transition rounded-xl text-slate-300 hover:bg-white/5"
                >
                  Manage Jobs
                </button>

                <button
                  onClick={() => navigate("/recruiter/profile")}
                  className="px-4 py-2 text-sm font-medium rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/20"
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
                {previewLogo ? (
                  <img
                    src={previewLogo}
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
        {/* ================= HERO SECTION ================= */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="p-6 mb-8 border shadow-2xl rounded-3xl bg-linear-to-r from-[#0f172a] via-[#111827] to-[#0f172a] border-white/10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-medium border rounded-full bg-cyan-500/10 text-cyan-300 border-cyan-500/20">
                <BadgeCheck size={13} />
                Recruiter Account Center
              </div>

              <h2 className="text-2xl font-bold md:text-3xl">
                Manage Recruiter Profile
              </h2>
              <p className="mt-2 max-w-2xl text-slate-300">
                Update recruiter information, company details, and branding to
                keep your hiring profile professional and complete.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/recruiter/dashboard")}
                className="inline-flex items-center gap-2 px-5 py-3 font-medium transition border rounded-2xl border-white/10 bg-white/5 hover:bg-white/10"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </button>
            </div>
          </div>
        </motion.div>

        {/* ================= PROFILE CONTENT ================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* LEFT CARD */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="p-6 text-white border shadow-2xl lg:col-span-1 bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                {previewLogo ? (
                  <img
                    src={previewLogo}
                    alt="Company Logo"
                    className="object-cover w-32 h-32 border-4 shadow-lg rounded-2xl border-cyan-400"
                  />
                ) : (
                  <div className="flex items-center justify-center w-32 h-32 border-4 shadow-lg rounded-2xl bg-white/5 border-cyan-400">
                    <Building2 size={50} className="text-cyan-300" />
                  </div>
                )}
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                {profile.companyName || "Company Name"}
              </h2>

              <p className="mt-1 text-cyan-300">
                {profile.designation || "Recruiter Designation"}
              </p>

              <div className="w-full mt-6 space-y-3 text-left">
                <ProfileItem
                  icon={<UserCircle2 className="text-cyan-300" size={18} />}
                  text={profile.fullName || "Recruiter Name"}
                />

                <ProfileItem
                  icon={<Mail className="text-cyan-300" size={18} />}
                  text={profile.email || "Email"}
                />

                <ProfileItem
                  icon={<BadgeInfo className="text-cyan-300" size={18} />}
                  text={profile.accountType || "Account Type"}
                />

                <ProfileItem
                  icon={<Layers3 className="text-cyan-300" size={18} />}
                  text={profile.hiringFor || "Hiring For"}
                />

                <ProfileItem
                  icon={<Users className="text-cyan-300" size={18} />}
                  text={profile.employeesRange || "Employees Range"}
                />
              </div>

              <label className="w-full mt-6 cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-3 font-medium transition rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black">
                  <Upload size={18} />
                  Upload Company Logo
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* EXTRA COMPANY SNAPSHOT */}
            <div className="pt-6 mt-6 border-t border-white/10">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Company Overview
              </h3>

              <div className="space-y-3">
                <MiniOverviewRow
                  icon={<Building2 size={16} />}
                  label="Company"
                  value={profile.companyName || "Not available"}
                />
                <MiniOverviewRow
                  icon={<Briefcase size={16} />}
                  label="Industry"
                  value={profile.industry || "Not available"}
                />
                <MiniOverviewRow
                  icon={<Users size={16} />}
                  label="Employees"
                  value={profile.employeesRange || "Not available"}
                />
                <MiniOverviewRow
                  icon={<Hash size={16} />}
                  label="Pincode"
                  value={profile.pincode || "Not available"}
                />
              </div>
            </div>
          </motion.div>

          {/* RIGHT CARD */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="p-6 text-white border shadow-2xl lg:col-span-2 bg-white/5 backdrop-blur-xl border-white/10 rounded-3xl md:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Recruiter Information */}
              <div>
                <h3 className="pb-3 mb-4 text-xl font-semibold border-b border-white/10">
                  Recruiter Information
                </h3>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <InputField
                    icon={<UserCircle2 size={18} />}
                    label="Full Name"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />

                  <InputField
                    icon={<Mail size={18} />}
                    label="Email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    readOnly
                  />

                  <InputField
                    icon={<BadgeInfo size={18} />}
                    label="Account Type"
                    name="accountType"
                    value={profile.accountType}
                    onChange={handleChange}
                    placeholder="Account type"
                  />

                  <InputField
                    icon={<Briefcase size={18} />}
                    label="Designation"
                    name="designation"
                    value={profile.designation}
                    onChange={handleChange}
                    placeholder="Enter designation"
                  />
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h3 className="pb-3 mb-4 text-xl font-semibold border-b border-white/10">
                  Company Information
                </h3>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <InputField
                    icon={<Building2 size={18} />}
                    label="Company Name"
                    name="companyName"
                    value={profile.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                  />

                  <InputField
                    icon={<Layers3 size={18} />}
                    label="Hiring For"
                    name="hiringFor"
                    value={profile.hiringFor}
                    onChange={handleChange}
                    placeholder="Hiring for"
                  />

                  <InputField
                    icon={<Briefcase size={18} />}
                    label="Industry"
                    name="industry"
                    value={profile.industry}
                    onChange={handleChange}
                    placeholder="Enter industry"
                  />

                  <InputField
                    icon={<Users size={18} />}
                    label="Employees Range"
                    name="employeesRange"
                    value={profile.employeesRange}
                    onChange={handleChange}
                    placeholder="Ex: 51-200"
                  />

                  <InputField
                    icon={<Hash size={18} />}
                    label="Pincode"
                    name="pincode"
                    value={profile.pincode}
                    onChange={handleChange}
                    placeholder="Enter pincode"
                  />

                  <div className="md:col-span-2">
                    <InputField
                      icon={<MapPin size={18} />}
                      label="Company Address"
                      name="companyAddress"
                      value={profile.companyAddress}
                      onChange={handleChange}
                      placeholder="Enter company address"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Summary */}
              <div>
                <h3 className="pb-3 mb-4 text-xl font-semibold border-b border-white/10">
                  Profile Summary
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <SummaryInfoCard
                    icon={<UserCircle2 size={18} />}
                    label="Recruiter"
                    value={profile.fullName || "Not available"}
                  />
                  <SummaryInfoCard
                    icon={<Building2 size={18} />}
                    label="Company"
                    value={profile.companyName || "Not available"}
                  />
                  <SummaryInfoCard
                    icon={<Mail size={18} />}
                    label="Email"
                    value={profile.email || "Not available"}
                  />
                  <SummaryInfoCard
                    icon={<FileText size={18} />}
                    label="Industry"
                    value={profile.industry || "Not available"}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-end gap-4 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/recruiter/dashboard")}
                  className="px-6 py-3 transition border rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold transition rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black disabled:opacity-60"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0f172a] border border-white/10">
      {icon}
      <span className="text-sm">{text}</span>
    </div>
  );
};

const MiniOverviewRow = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0f172a] border border-white/10">
      <div className="mt-0.5 text-cyan-300">{icon}</div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm text-white wrap-break-word">{value}</p>
      </div>
    </div>
  );
};

const SummaryInfoCard = ({ icon, label, value }) => {
  return (
    <div className="p-4 border rounded-2xl border-white/10 bg-[#0f172a]">
      <div className="flex items-center gap-2 mb-2 text-cyan-300">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-sm text-slate-300 wrap-break-word">{value}</p>
    </div>
  );
};

const InputField = ({
  icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly = false,
}) => {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-200">
        {label}
      </label>

      <div
        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 bg-[#0f172a] ${
          readOnly
            ? "border-gray-600 opacity-80"
            : "border-white/10 focus-within:border-cyan-400"
        } transition`}
      >
        <span className="text-cyan-300">{icon}</span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className="w-full text-white bg-transparent outline-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

export default RecruiterProfile;