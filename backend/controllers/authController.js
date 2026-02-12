const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ======================
   REGISTER
====================== */
exports.register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      mobile,
      role,
      city,
      experience,
    } = req.body;

    /* -------- REQUIRED FIELD CHECK -------- */
    if (!fullName || !email || !password || !mobile || !role || !city) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    if (!["JobSeeker", "Employer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Employer must provide experience
    if (role === "Employer" && !experience) {
      return res.status(400).json({
        message: "Experience is required for Employer",
      });
    }

    /* -------- CHECK EXISTING USER -------- */
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    /* -------- HASH PASSWORD -------- */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* -------- CREATE USER -------- */
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      mobile,
      role,
      city,
      experience: role === "Employer" ? experience : null,
    });

    /* -------- GENERATE TOKEN -------- */
    const token = jwt.sign(
      { id: user._id, role: user.role },
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
        city: user.city,
        experience: user.experience,
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
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
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

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
