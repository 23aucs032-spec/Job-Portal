import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const RecruiterProfile = () => {
  const navigate = useNavigate();
  const [recruiter, setRecruiter] = useState({
    name: "",
    companyName: "",
    logo: "",
    email: "",
    phone: "",
    website: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/recruiter/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setRecruiter(data.recruiter || {});
      } catch (err) {
        console.error(err);
        alert("Error fetching profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, user, navigate]);

  const handleChange = (e) => {
    setRecruiter({ ...recruiter, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5000/api/recruiter/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recruiter),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const data = await res.json();
      alert(data.message || "Profile updated successfully!");

      // Update localStorage with latest recruiter data
      localStorage.setItem("user", JSON.stringify({ ...user, ...data.recruiter }));
      setRecruiter(data.recruiter);
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl p-8 bg-black/70 backdrop-blur-lg rounded-2xl border border-gray-700 shadow-xl"
        >
          <h2 className="mb-6 text-3xl font-bold text-center">Profile</h2>

          {/* Company Logo */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={recruiter.logo || "/default-logo.png"}
              alt="Company Logo"
              className="w-24 h-24 rounded-full object-cover border border-gray-500"
            />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={recruiter.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
              required
            />
            <input
              type="text"
              name="companyName"
              value={recruiter.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
              required
            />
            <input
              type="text"
              name="logo"
              value={recruiter.logo}
              onChange={handleChange}
              placeholder="Logo URL"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            />
            <input
              type="email"
              name="email"
              value={recruiter.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            />
            <input
              type="text"
              name="phone"
              value={recruiter.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            />
            <input
              type="text"
              name="website"
              value={recruiter.website}
              onChange={handleChange}
              placeholder="Website URL"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            />
            <textarea
              name="description"
              value={recruiter.description}
              onChange={handleChange}
              placeholder="Company Description"
              rows={4}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded"
            />

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => navigate("/recruiter/dashboard")}
                className="px-6 py-3 bg-gray-700 rounded hover:bg-gray-600"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default RecruiterProfile;