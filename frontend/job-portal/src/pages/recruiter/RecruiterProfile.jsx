/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
} from "lucide-react";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

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
          fullName: data?.fullName || "",
          email: data?.email || "",
          accountType: data?.accountType || "",
          hiringFor: data?.hiringFor || "",
          companyName: data?.companyName || "",
          industry: data?.industry || "",
          employeesRange: data?.employeesRange || "",
          designation: data?.designation || "",
          pincode: data?.pincode || "",
          companyAddress: data?.companyAddress || "",
          logo: data?.logo || "",
        });

        setPreviewLogo(data?.logo ? `${API}${data.logo}` : "");
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
        fullName: updatedRecruiter?.fullName || "",
        email: updatedRecruiter?.email || "",
        accountType: updatedRecruiter?.accountType || "",
        hiringFor: updatedRecruiter?.hiringFor || "",
        companyName: updatedRecruiter?.companyName || "",
        industry: updatedRecruiter?.industry || "",
        employeesRange: updatedRecruiter?.employeesRange || "",
        designation: updatedRecruiter?.designation || "",
        pincode: updatedRecruiter?.pincode || "",
        companyAddress: updatedRecruiter?.companyAddress || "",
        logo: updatedRecruiter?.logo || "",
      });

      setPreviewLogo(
        updatedRecruiter?.logo ? `${API}${updatedRecruiter.logo}` : ""
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

  if (loading) {
    return (
      <>
        <AnimatedBackground />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="px-8 py-10 text-lg text-white border shadow-2xl bg-white/10 backdrop-blur-xl border-white/20 rounded-3xl">
            Loading recruiter profile...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AnimatedBackground />

      <div className="min-h-screen px-4 py-10 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white md:text-4xl">
                Recruiter Profile
              </h1>
              <p className="mt-2 text-gray-300">
                Manage your recruiter and company details.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/recruiter/dashboard")}
              className="inline-flex items-center gap-2 px-5 py-3 text-white transition border rounded-xl bg-white/10 border-white/20 hover:bg-white/20"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="p-6 text-white border shadow-2xl lg:col-span-1 bg-white/10 backdrop-blur-xl border-white/20 rounded-3xl"
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
                    <div className="flex items-center justify-center w-32 h-32 border-4 shadow-lg rounded-2xl bg-white/10 border-cyan-400">
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
                  <div className="flex items-center justify-center gap-2 px-4 py-3 font-medium transition rounded-xl bg-cyan-500 hover:bg-cyan-600">
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.15 }}
              className="p-6 text-white border shadow-2xl lg:col-span-2 bg-white/10 backdrop-blur-xl border-white/20 rounded-3xl md:p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
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

                <div className="flex flex-col justify-end gap-4 pt-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate("/recruiter/dashboard")}
                    className="px-6 py-3 transition border rounded-xl border-white/20 bg-white/5 hover:bg-white/10"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold transition rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60"
                  >
                    <Save size={18} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

const ProfileItem = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
      {icon}
      <span className="text-sm">{text}</span>
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
        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 bg-white/5 ${
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