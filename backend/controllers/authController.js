const User = require("../models/User");
const Profile = require("../models/Profile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ======================
   REGISTER
====================== */
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role, city, experience } = req.body;

    if (!fullName || !email || !password || !mobile || !role || !city) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    if (!["JobSeeker", "Employer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (role === "Employer" && !experience) {
      return res.status(400).json({ message: "Experience is required for Employer" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      mobile,
      role,
      city,
      experience: role === "Employer" ? experience : null,
    });

    // ✅ AUTO CREATE PROFILE AFTER REGISTER
    await Profile.create({
      user: user._id,
      personalDetails: {
        name: user.fullName,
        email: user.email,
        mobile: user.mobile,
        location: user.city,
      },
    });

    const token = jwt.sign(
      {
        id: user._id,  // ✅ IMPORTANT
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================
   LOGIN
====================== */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};