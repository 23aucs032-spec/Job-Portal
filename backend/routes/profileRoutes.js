const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Profile = require("../models/Profile");
const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware");

/* ======================
   MAIL TRANSPORTER
====================== */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ======================
   HELPER FUNCTIONS
====================== */

const getOrCreateProfile = async (userId) => {
  let profile = await Profile.findOne({ user: userId });
  if (!profile) {
    profile = await Profile.create({ user: userId });
  }
  return profile;
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* ======================
   GET PROFILE
====================== */

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    console.error("GET /me error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   SAVE FULL PROFILE
====================== */

router.post("/save", auth, async (req, res) => {
  try {
    const updateData = { ...req.body };

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
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json(profile);
  } catch (error) {
    console.error("POST /save error:", error);
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
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error) {
    console.error("PUT /basic error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   SEND EMAIL OTP
====================== */

router.post("/send-email-otp", auth, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const profile = await getOrCreateProfile(req.user.id);
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    profile.emailOtp = otp;
    profile.emailOtpExpires = otpExpiry;
    await profile.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Email OTP Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your OTP for email verification is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("POST /send-email-otp error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* ======================
   VERIFY EMAIL OTP
====================== */

router.post("/verify-email-otp", auth, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const profile = await getOrCreateProfile(req.user.id);

    if (!profile.emailOtp || !profile.emailOtpExpires) {
      return res.status(400).json({ message: "No OTP found. Please request OTP first" });
    }

    if (new Date() > new Date(profile.emailOtpExpires)) {
      return res.status(400).json({ message: "OTP expired. Please request a new OTP" });
    }

    if (profile.emailOtp !== otp.toString().trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    profile.email = email;
    profile.emailVerified = true;
    profile.emailOtp = "";
    profile.emailOtpExpires = null;

    await profile.save();

    res.json({
      message: "Email verified successfully",
      email: profile.email,
      emailVerified: true,
    });
  } catch (error) {
    console.error("POST /verify-email-otp error:", error);
    res.status(500).json({ message: "OTP verification failed" });
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
    console.error("PUT /languages error:", error);
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
    console.error("POST /education error:", error);
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
    console.error("DELETE /education/:id error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   ADD SKILL
====================== */

router.post("/skills", auth, async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user.id);

    if (req.body.skill && !profile.skills.includes(req.body.skill)) {
      profile.skills.push(req.body.skill);
      await profile.save();
    }

    res.json(profile.skills);
  } catch (error) {
    console.error("POST /skills error:", error);
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
    console.error("DELETE /skills/:skill error:", error);
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
    console.error("POST /internships error:", error);
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
    console.error("POST /projects error:", error);
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
    console.error("POST /employment error:", error);
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
    console.error("POST /exams error:", error);
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
    console.error("POST /achievements error:", error);
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
      { new: true, upsert: true }
    );

    res.json(profile.profileSummary);
  } catch (error) {
    console.error("PUT /summary error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================
   UPLOAD PROFILE IMAGE
====================== */

router.post(
  "/upload-profile-image",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const profile = await getOrCreateProfile(req.user.id);

      profile.profileImage = {
        url: `/uploads/${req.file.filename}`,
      };

      await profile.save();

      res.json(profile.profileImage);
    } catch (err) {
      console.error("Image Upload Error:", err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

/* ======================
   UPLOAD RESUME
====================== */

router.post(
  "/upload-resume",
  auth,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized user" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const resumeData = {
        name: req.file.originalname || "",
        url: `/uploads/${req.file.filename}`,
        public_id: "",
        uploadedAt: new Date(),
      };

      const profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: { resume: resumeData } },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

      if (!profile || !profile.resume || !profile.resume.url) {
        return res
          .status(500)
          .json({ message: "Resume uploaded but not saved in database" });
      }

      return res.status(200).json({
        message: "Resume uploaded successfully",
        resume: profile.resume,
      });
    } catch (err) {
      console.error("Resume Upload Error:", err);
      return res.status(500).json({ message: "Resume upload failed" });
    }
  }
);

module.exports = router;