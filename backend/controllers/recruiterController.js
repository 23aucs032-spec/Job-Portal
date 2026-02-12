const Recruiter = require("../models/Recruiter");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= REGISTER ================= */
exports.registerRecruiter = async (req, res) => {
  try {
    const { fullName, email, password, companyName } = req.body;

    // Check if recruiter already exists
    const existingRecruiter = await Recruiter.findOne({ email });
    if (existingRecruiter) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const recruiter = await Recruiter.create({
      fullName,
      email,
      password: hashedPassword,
      companyName,
    });

    res.status(201).json({
      message: "Recruiter registered successfully",
      recruiter,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */
exports.loginRecruiter = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check recruiter exists
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, recruiter.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 3️⃣ Generate JWT Token
    const token = jwt.sign(
      { id: recruiter._id, role: "recruiter" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4️⃣ Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: recruiter._id,
        fullName: recruiter.fullName,
        email: recruiter.email,
        role: "recruiter",
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
