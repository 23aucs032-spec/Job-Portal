/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const RecruiterProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState({
    fullName: "",
    companyName: "",
    logo: "",
    email: "",
    phone: "",
    website: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [logoFile, setLogoFile] = useState(null); // New state for uploaded file

  useEffect(() => {
    if (!token) {
      navigate("/recruiter/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/recruiter/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data.recruiter || {});
      } catch (err) {
        alert(err.message);
        navigate("/recruiter/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, logo: reader.result }); // Preview image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("fullName", profile.fullName);
      formData.append("companyName", profile.companyName);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);
      formData.append("website", profile.website);
      formData.append("description", profile.description);

      if (logoFile) {
        formData.append("logo", logoFile); // send the file
      }

      const res = await fetch("http://localhost:5000/api/recruiter/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      alert(data.message || "Profile updated successfully!");
      localStorage.setItem("user", JSON.stringify(data.recruiter));
      setProfile(data.recruiter);
      setLogoFile(null);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl font-semibold">
        Loading profile...
      </div>
    );

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/70 backdrop-blur-lg rounded-3xl p-10 w-full max-w-3xl border border-gray-700 shadow-2xl text-white"
        >
          <h2 className="text-4xl font-bold text-center mb-8">Recruiter Profile</h2>

          {/* Company Logo */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={profile.logo || "/default-logo.png"}
              alt="Company Logo"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-500 shadow-md mb-3"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="text-sm text-gray-300"
            />
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                required
              />
              <input
                type="text"
                name="companyName"
                value={profile.companyName}
                onChange={handleChange}
                placeholder="Company Name"
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                required
              />
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            <input
              type="text"
              name="website"
              value={profile.website}
              onChange={handleChange}
              placeholder="Website URL"
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
            />

            <textarea
              name="description"
              value={profile.description}
              onChange={handleChange}
              placeholder="Company Description"
              rows={5}
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
            />

            <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
              <button
                type="button"
                onClick={() => navigate("/recruiter/dashboard")}
                className="w-full md:w-auto px-6 py-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-cyan-500 rounded-xl hover:bg-cyan-600 transition font-semibold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default RecruiterProfile;