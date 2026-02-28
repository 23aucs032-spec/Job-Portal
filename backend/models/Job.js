const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: String,
    companyName: String,
    consultancyName: String,
    companyLogo: String,
    location: String,

    minExp: Number,
    maxExp: Number,

    minSalary: Number,
    maxSalary: Number,

    workMode: String,
    department: String,
    roleCategory: String,
    education: String,
    industry: String,
    companyType: String,

    skills: [String],
    perks: [String],
    responsibilities: [String],

    jobDescription: String,
    contactEmail: String,
    applyBefore: Date,

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Should reference the recruiter user
      required: true
    },

    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

jobSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Job", jobSchema);