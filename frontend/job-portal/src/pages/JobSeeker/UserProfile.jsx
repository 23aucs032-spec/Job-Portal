import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Save, Upload, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../LandingPage/components/AnimatedBackground";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editField, setEditField] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePicFile, setProfilePicFile] = useState(null);

  const token = localStorage.getItem("token");

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [token]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  /* ================= SAVE FIELD ================= */
  const saveField = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error("Failed to update");
      const data = await res.json();
      setUser(data);
      setEditField(null);
      alert("Profile Updated");
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= UPLOAD PROFILE PIC ================= */
  const uploadProfilePic = async () => {
    if (!profilePicFile) return alert("Please select a file");
    const formData = new FormData();
    formData.append("profilePic", profilePicFile);
    try {
      const res = await fetch(
        "http://localhost:5000/api/users/upload-profile-pic",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setUser({ ...user, profilePic: data.profilePic });
      alert("Profile picture uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Error uploading profile picture");
    }
  };

  /* ================= UPLOAD RESUME ================= */
  const uploadResume = async () => {
    if (!resumeFile) return alert("Please select a file");
    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      const res = await fetch("http://localhost:5000/api/users/upload-resume", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Resume upload failed");
      const data = await res.json();
      setUser({ ...user, resume: data.resume });
      alert("Resume Uploaded");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  /* ================= DELETE RESUME ================= */
  const deleteResume = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/delete-resume", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setUser({ ...user, resume: "" });
      alert("Resume Deleted");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  /* ================= FIELD COMPONENT ================= */
  const Field = ({ label, field, editable = true }) => (
    <div className="mb-5">
      <label className="text-gray-400 text-sm mb-1 block">{label}</label>
      <div className="flex gap-3 items-center">
        {editField === field ? (
          <>
            <input
              value={user[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              className="bg-gray-900 border border-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition"
            />
            <button
              onClick={saveField}
              className="bg-green-600 p-2 rounded-lg hover:bg-green-500 transition"
            >
              <Save className="text-white" />
            </button>
          </>
        ) : (
          <>
            <p className="flex-1 bg-gray-900 px-4 py-2 rounded-lg">{user[field] || "Not Added"}</p>
            {editable && (
              <button
                onClick={() => setEditField(field)}
                className="bg-blue-600 p-2 rounded-lg hover:bg-blue-500 transition"
              >
                <Edit className="text-white" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (!user) return <div className="text-white p-10">Loading...</div>;

  /* ================= UI ================= */
  return (
    <div className="relative min-h-screen text-white bg-gray-950">
      <div className="absolute inset-0 -z-10">
        <AnimatedBackground />
      </div>

      <div className="max-w-3xl mx-auto p-8">
        <button
          onClick={() => navigate("/jobseeker/dashboard")}
          className="flex gap-2 text-blue-400 mb-6 hover:underline"
        >
          <ArrowLeft /> Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/80 p-8 rounded-2xl border border-gray-800 shadow-xl backdrop-blur-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-white">My Profile</h2>

          {/* PROFILE PIC */}
          <div className="mb-8 flex flex-col items-center">
            {/* Profile Pic */}
            <img
              src={
                user.profilePic
                ? `http://localhost:5000/${user.profilePic}`
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicFile(e.target.files[0])}
              className="mb-2"
            />
            <button
              onClick={uploadProfilePic}
              className="bg-blue-600 px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-500 transition"
            >
              <Upload size={18} /> Upload Photo
            </button>
          </div>

          {/* USER FIELDS */}
          <Field label="Full Name" field="fullName" />
          <Field label="Email" field="email" editable={false} />
          <Field label="Mobile" field="mobile" />
          <Field label="City" field="city" />
          <Field label="Experience" field="experience" />
          <Field label="Skills" field="skills" />
          <Field label="Education" field="education" />
          <Field label="Role" field="role" editable={false} />

          {/* RESUME */}
          <div className="mt-8">
            <h3 className="font-semibold text-lg mb-3">Resume</h3>

            {user.resume ? (
              <div className="flex flex-col gap-2">
                <a
                  href={user.resume ? `http://localhost:5000/${user.resume}` : "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  View Resume
                </a>
                <button
                  onClick={deleteResume}
                  className="bg-red-600 px-4 py-2 rounded-lg flex gap-2 items-center hover:bg-red-500 transition"
                >
                  <Trash2 size={18} /> Delete Resume
                </button>
              </div>
            ) : (
              <p className="text-gray-400">No resume uploaded</p>
            )}

            <input
              type="file"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="mt-4"
            />
            <button
              onClick={uploadResume}
              className="bg-green-600 px-5 py-2 mt-2 rounded-lg flex gap-2 items-center hover:bg-green-500 transition"
            >
              <Upload size={18} /> Upload Resume
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;
