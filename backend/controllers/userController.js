const User = require("../models/User");
const fs = require("fs");
const path = require("path");

/* =======================================
   GET LOGGED IN USER PROFILE
   GET /api/users/me
======================================= */
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =======================================
   UPDATE PROFILE
   PUT /api/users/update
======================================= */
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Update all fields from JSON body
    user.fullName = req.body.fullName || user.fullName;
    user.mobile = req.body.mobile || user.mobile;
    user.city = req.body.city || user.city;
    user.experience = req.body.experience || user.experience;
    user.skills = req.body.skills || user.skills;
    user.education = req.body.education || user.education;
    user.profilePic = req.body.profilePic || user.profilePic;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =======================================
   UPLOAD RESUME
   POST /api/users/upload-resume
======================================= */
exports.uploadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Delete old resume if exists
    if (user.resume) {
      const oldPath = path.join(__dirname, "..", user.resume);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Save new resume path
    user.resume = `uploads/resumes/${req.file.filename}`;
    await user.save();

    res.json({ message: "Resume uploaded successfully", resume: user.resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =======================================
   DELETE RESUME
   DELETE /api/users/delete-resume
======================================= */
exports.deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Delete file from uploads folder
    if (user.resume) {
      const filePath = path.join(__dirname, "..", user.resume);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      user.resume = "";
      await user.save();
    }

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =======================================
   UPLOAD PROFILE PICTURE
   POST /api/users/upload-profile-pic
======================================= */
exports.uploadProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    // Delete old profile picture if exists
    if (user.profilePic) {
      const oldPicPath = path.join(__dirname, "..", user.profilePic);
      if (fs.existsSync(oldPicPath)) fs.unlinkSync(oldPicPath);
    }

    // Save new profile picture path
    user.profilePic = `uploads/profilePics/${req.file.filename}`;
    await user.save();

    res.json({ message: "Profile picture uploaded successfully", profilePic: user.profilePic });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
