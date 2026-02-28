const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  learnings: String,
  skills: [String],
  url: String,
});

const employmentSchema = new mongoose.Schema({
  companyName: String,
  designation: String,
  totalExperienceYears: Number,
  totalExperienceMonths: Number,
  startMonth: String,
  startYear: Number,
  endMonth: String,
  endYear: Number,
  currentlyWorking: Boolean,
  description: String,
});

const certificationSchema = new mongoose.Schema({
  name: String,
  completionId: String,
  url: String,
  startMonth: String,
  startYear: Number,
  endMonth: String,
  endYear: Number,
  doesNotExpire: Boolean,
});

const clubSchema = new mongoose.Schema({
  name: String,
  role: String,
  associatedWith: String,
  startMonth: String,
  startYear: Number,
  endMonth: String,
  endYear: Number,
  currentlyWorking: Boolean,
  description: String,
  media: String,
});

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    summary: String,
    awards: String,
    accomplishments: [String],
    skills: [String],
    languages: [String],

    projects: [projectSchema],
    employment: [employmentSchema],
    certifications: [certificationSchema],
    clubCommittees: [clubSchema],

    profilePhoto: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);