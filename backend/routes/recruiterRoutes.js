const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Recruiter = require("../models/Recruiter");
const auth = require("../middleware/auth");

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

    const recruiter = await Recruiter.create({
      name,
      email,
      password,
      companyName,
    });

    const token = jwt.sign(
      { id: recruiter._id, role: "recruiter" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: recruiter,
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
    if (!recruiter)
      return res.status(400).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(
      password,
      recruiter.password
    );

    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: recruiter._id, role: "recruiter" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: recruiter,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

/* ================= PROFILE (AUTO COMPANY NAME) ================= */
router.get("/profile", auth, async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.user.id).select("-password");
    res.json(recruiter);
  } catch (err) {
    res.status(500).json({ message: "Profile fetch failed" });
  }
});

module.exports = router;
