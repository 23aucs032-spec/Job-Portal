const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Recruiter = require("../models/Recruiter");
const auth = require("../middleware/auth"); // make sure auth sets req.user.id

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, companyName } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await Recruiter.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const recruiter = await Recruiter.create({ name, email, password, companyName });

    const token = jwt.sign({ id: recruiter._id, role: "recruiter" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Remove password from response
    const { password: pwd, ...userWithoutPassword } = recruiter.toObject();

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: recruiter._id, role: "recruiter" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: pwd, ...userWithoutPassword } = recruiter.toObject();

    res.json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

/* ================= PROFILE ================= */
router.get("/profile", auth, async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.user.id).select("-password");
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });
    res.json({ recruiter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile fetch failed" });
  }
});

/* ================= UPDATE PROFILE ================= */
router.put("/:id", auth, async (req, res) => {
  try {
    if (req.params.id !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    const recruiter = await Recruiter.findById(req.user.id);
    if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });

    Object.assign(recruiter, req.body); // update allowed fields
    await recruiter.save();

    const { password, ...userWithoutPassword } = recruiter.toObject();
    res.json({ message: "Profile updated successfully", recruiter: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile update failed" });
  }
});

module.exports = router;