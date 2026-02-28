const Profile = require("../models/Profile");

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create or Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const existingProfile = await Profile.findOne({ user: req.user.id });

    if (existingProfile) {
      const updatedProfile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: req.body },
        { new: true }
      );
      return res.json(updatedProfile);
    }

    const newProfile = new Profile({
      user: req.user.id,
      ...req.body,
    });

    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};