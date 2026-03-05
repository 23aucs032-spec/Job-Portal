const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware");

/* ======================
   HELPER FUNCTION
====================== */

const getOrCreateProfile = async (userId) => {
  let profile = await Profile.findOne({ user: userId });
  if (!profile) {
    profile = await Profile.create({ user: userId });
  }
  return profile;
};

/* ======================
   GET PROFILE
====================== */

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   SAVE FULL PROFILE
====================== */

router.post("/save", auth, async (req, res) => {
  try {

    const updateData = { ...req.body };

    /* 🔥 Fix achievements if sent as string array */
    if (Array.isArray(updateData.achievements)) {
      updateData.achievements = updateData.achievements.map((item) =>
        typeof item === "string"
          ? { title: item, description: "", year: "" }
          : item
      );
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: updateData },
      {
        returnDocument: "after",   // ✅ fix deprecation warning
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   UPDATE BASIC PROFILE
====================== */

router.put("/basic", auth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: req.body },
      { new: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   UPDATE LANGUAGES
====================== */

router.put("/languages", auth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);
    profile.languages = req.body.languages || [];
    await profile.save();
    res.json(profile.languages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   ADD EDUCATION
====================== */

router.post("/education", auth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);
    profile.education.push(req.body);
    await profile.save();
    res.json(profile.education);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   DELETE EDUCATION
====================== */

router.delete("/education/:id", auth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);

    profile.education = profile.education.filter(
      (edu) => edu._id.toString() !== req.params.id
    );

    await profile.save();
    res.json(profile.education);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   ADD SKILL
====================== */

router.post("/skills", auth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);

    if (!profile.skills.includes(req.body.skill)) {
      profile.skills.push(req.body.skill);
      await profile.save();
    }

    res.json(profile.skills);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   DELETE SKILL
====================== */

router.delete("/skills/:skill", auth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);

    profile.skills = profile.skills.filter(
      (skill) => skill !== req.params.skill
    );

    await profile.save();
    res.json(profile.skills);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   ADD INTERNSHIP
====================== */

router.post("/internships", auth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);
    profile.internships.push(req.body);
    await profile.save();
    res.json(profile.internships);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   ADD PROJECT
====================== */

router.post("/projects", auth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);
    profile.projects.push(req.body);
    await profile.save();
    res.json(profile.projects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   ADD EMPLOYMENT
====================== */

router.post("/employment", auth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);
    profile.employments.push(req.body);
    await profile.save();
    res.json(profile.employments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   ADD COMPETITIVE EXAM
====================== */

router.post("/exams", auth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);
    profile.competitiveExams.push(req.body);
    await profile.save();
    res.json(profile.competitiveExams);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   ADD ACHIEVEMENT
====================== */

router.post("/achievements", auth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);

    profile.achievements.push({
      title: req.body.title,
      description: req.body.description,
      year: req.body.year,
    });

    await profile.save();
    res.json(profile.achievements);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   UPDATE SUMMARY
====================== */

router.put("/summary", auth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { profileSummary: req.body.profileSummary },
      { new: true }
    );
    res.json(profile.profileSummary);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/upload-profile-image",
  auth,                     // ✅ ADD THIS
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const profile = await getOrCreateProfile(req.user.id);  // ✅ safer

      profile.profileImage = {
        url: `/uploads/${req.file.filename}`,
      };

      await profile.save();

      res.json(profile.profileImage);

    } catch (err) {
      console.error("Image Upload Error:", err);  // ✅ show real error
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

router.post(
  "/upload-resume",
  auth,                      // ✅ ADD THIS
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const profile = await getOrCreateProfile(req.user.id);  // ✅ safer

      profile.resume = {
        name: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        uploadedAt: new Date(),
      };

      await profile.save();

      res.json(profile.resume);

    } catch (err) {
      console.error("Resume Upload Error:", err);
      res.status(500).json({ message: "Resume upload failed" });
    }
  }
);

module.exports = router;