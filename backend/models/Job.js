const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recruiter",
    required: true,
  },
  companyName: String,
  consultancyName: String,
  hiringFor: String,
  title: String,
  minExp: String,
  maxExp: String,
  minSalary: String,
  maxSalary: String,
  skills: [String],
  perks: [String],
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
