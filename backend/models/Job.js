const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },

    companyName: {
      type: String,
      trim: true,
      default: "",
    },

    consultancyName: {
      type: String,
      trim: true,
      default: "",
    },

    companyLogo: {
      type: String,
      trim: true,
      default: "",
    },

    hiringFor: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    minExp: {
      type: Number,
      default: 0,
    },

    maxExp: {
      type: Number,
      default: 0,
    },

    minSalary: {
      type: Number,
      default: 0,
    },

    maxSalary: {
      type: Number,
      default: 0,
    },

    workMode: {
      type: String,
      trim: true,
      default: "",
    },

    department: {
      type: String,
      trim: true,
      default: "",
    },

    roleCategory: {
      type: String,
      trim: true,
      default: "",
    },

    education: {
      type: String,
      trim: true,
      default: "",
    },

    industry: {
      type: String,
      trim: true,
      default: "",
    },

    companyType: {
      type: String,
      trim: true,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    perks: {
      type: [String],
      default: [],
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    jobDescription: {
      type: String,
      default: "",
    },

    contactEmail: {
      type: String,
      trim: true,
      default: "",
    },

    applyBefore: {
      type: Date,
      default: null,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
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

module.exports = mongoose.model("Job", jobSchema);