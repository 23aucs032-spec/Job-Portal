const Recruiter = require("../models/Recruiter");
const EmailOtp = require("../models/EmailOtp");
const jwt = require("jsonwebtoken");

exports.registerRecruiter = async (req, res) => {
  try {
    const {
      accountType,
      fullName,
      email,
      password,
      hiringFor,
      companyName,
      industry,
      employeesRange,
      designation,
      pincode,
      companyAddress,
    } = req.body;

    if (
      !accountType ||
      !fullName ||
      !email ||
      !password ||
      !hiringFor ||
      !companyName ||
      !industry ||
      !employeesRange ||
      !designation ||
      !pincode ||
      !companyAddress
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingRecruiter = await Recruiter.findOne({ email });
    if (existingRecruiter) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const verifiedOtp = await EmailOtp.findOne({
      email,
      verified: true,
    });

    if (!verifiedOtp) {
      return res.status(400).json({
        message: "Email is not verified",
      });
    }

    const recruiter = new Recruiter({
      accountType,
      fullName,
      email,
      password,
      hiringFor,
      companyName,
      industry,
      employeesRange,
      designation,
      pincode,
      companyAddress,
    });

    await recruiter.save();
    await EmailOtp.findOneAndDelete({ email });

    const token = jwt.sign(
      { id: recruiter._id, role: "recruiter" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const recruiterData = await Recruiter.findById(recruiter._id).select("-password");

    return res.status(201).json({
      message: "Recruiter registered successfully",
      token,
      recruiter: recruiterData,
    });
  } catch (error) {
    console.error("registerRecruiter error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.loginRecruiter = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    const isMatch = await recruiter.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: recruiter._id, role: "recruiter" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const recruiterData = await Recruiter.findById(recruiter._id).select("-password");

    return res.status(200).json({
      message: "Login successful",
      token,
      recruiter: recruiterData,
    });
  } catch (error) {
    console.error("loginRecruiter error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.user.id).select("-password");

    if (!recruiter) {
      return res.status(404).json({
        message: "Recruiter not found",
      });
    }

    return res.status(200).json(recruiter);
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updateData = {
      fullName: req.body.fullName,
      companyName: req.body.companyName,
      designation: req.body.designation,
      employeesRange: req.body.employeesRange,
      pincode: req.body.pincode,
      companyAddress: req.body.companyAddress,
      industry: req.body.industry,
      hiringFor: req.body.hiringFor,
      accountType: req.body.accountType,
    };

    if (req.file) {
      updateData.logo = `/uploads/logos/${req.file.filename}`;
    }

    const recruiter = await Recruiter.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!recruiter) {
      return res.status(404).json({
        message: "Recruiter not found",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      recruiter,
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};