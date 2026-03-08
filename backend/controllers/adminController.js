const Admin = require("../models/Admin");
const User = require("../models/User");
const Recruiter = require("../models/Recruiter");
const Job = require("../models/Job");
const jwt = require("jsonwebtoken");

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid email" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({
      token,
      admin: { id: admin._id, fullName: admin.fullName, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin Dashboard Stats
exports.getStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const recruiters = await Recruiter.countDocuments();
    const jobs = await Job.countDocuments();
    res.json({ users, recruiters, jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= USERS ================= */

exports.getUsers = async(req,res)=>{
  const users = await User.find().select("-password");
  res.json(users);
};

exports.deleteUser = async(req,res)=>{
  await User.findByIdAndDelete(req.params.id);
  res.json({message:"User deleted"});
};


/* ================= RECRUITERS ================= */

exports.getRecruiters = async(req,res)=>{
  const recruiters = await Recruiter.find().select("-password");
  res.json(recruiters);
};

exports.deleteRecruiter = async(req,res)=>{
  await Recruiter.findByIdAndDelete(req.params.id);
  res.json({message:"Recruiter deleted"});
};


/* ================= JOBS ================= */

exports.getJobs = async(req,res)=>{
  const jobs = await Job.find();
  res.json(jobs);
};

exports.approveJob = async(req,res)=>{
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    {status:"approved"},
    {new:true}
  );
  res.json(job);
};

exports.rejectJob = async(req,res)=>{
  const job = await Job.findByIdAndUpdate(
    req.params.id,
    {status:"rejected"},
    {new:true}
  );
  res.json(job);
};

exports.deleteJob = async(req,res)=>{
  await Job.findByIdAndDelete(req.params.id);
  res.json({message:"Job deleted"});
};