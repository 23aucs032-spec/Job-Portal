const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  companyName: String,
  companyLogo: String,
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter" }, // ← add this

  minExp: Number,
  maxExp: Number,
  minSalary: Number,
  maxSalary: Number,
  workMode: String,
  department: String,
  location: String,
  companyType: String,
  roleCategory: String,
  education: String,
  industry: String,
  skills: [String],

  jobDescription: String,
  responsibilities: [String],
  applyBefore: Date,
  contactEmail: String,

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", jobSchema);
