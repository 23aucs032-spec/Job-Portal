const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { login } = require("../controllers/authController");

/* ======================
   REGISTER
====================== */
router.post("/register", async (req, res) => {
  try {
    // ✅ Safety check
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "Request body is missing or empty" });
    }

    const {
      fullName,
      email,
      password,
      mobile,
      role,
      city,
      experience,
    } = req.body;

    /* ======================
       FIELD VALIDATION
    ====================== */
    if (!fullName || !email || !password || !mobile || !role || !city) {
      return res.status(400).json({
        message:
          "fullName, email, password, mobile, role, and city are required",
      });
    }

    if (role !== "JobSeeker" && role !== "Employer") {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Employer must provide experience
    if (role === "Employer" && !experience) {
      return res.status(400).json({
        message: "Experience is required for Employer",
      });
    }

    /* ======================
       CHECK EXISTING USER
    ====================== */
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    /* ======================
       HASH PASSWORD
    ====================== */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* ======================
       CREATE USER
    ====================== */
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      mobile,
      role,
      city,
      experience: role === "Employer" ? experience : null,
    });

    /* ======================
       JWT SECRET CHECK
    ====================== */
    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ message: "JWT_SECRET missing in environment" });
    }

    /* ======================
       GENERATE TOKEN
    ====================== */
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    /* ======================
       RESPONSE
    ====================== */
    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        city: user.city,
        experience: user.experience,
      },
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/* ======================
   LOGIN ROUTE
====================== */
router.post("/login", login);

module.exports = router;
