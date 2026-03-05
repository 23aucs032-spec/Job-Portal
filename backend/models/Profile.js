const mongoose = require("mongoose");

const EducationSchema = new mongoose.Schema({
  /* ===== College ===== */
  degree: String,
  specialization: String,
  institute: String,
  instituteLocation: String,
  startYear: String,
  endYear: String,
  courseType: String,
  percentage: String,

  marksheet: {
    url: String,
    public_id: String,
  },

  /* ===== 12th ===== */
  school12Name: String,
  school12Location: String,
  school12StartYear: String,
  school12EndYear: String,
  school12Percentage: String,
  school12Marksheet: {
    url: String,
    public_id: String,
  },

  /* ===== 10th ===== */
  school10Name: String,
  school10Location: String,
  school10StartYear: String,
  school10EndYear: String,
  school10Percentage: String,
  school10Marksheet: {
    url: String,
    public_id: String,
  },
});

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    /* =========================
       Personal Details
    ========================= */
    name: String,
    email: String,
    mobile: String,
    location: String,
    dob: String,
    gender: String,
    languages: {
      type: [String],
      default: [],
    },

    profileSummary: String,

    /* =========================
       Skills
    ========================= */
    skills: {
      type: [String],
      default: [],
    },

    /* =========================
       Career Preferences
    ========================= */
    preferences: {
      types: [String],
      availability: String,
      locations: [String],
    },

    /* =========================
       Education
    ========================= */
    education: [EducationSchema],

    /* =========================
       Internships
    ========================= */
    internships: [
      {
        company: String,
        project: String,
        description: String,
        skills: String,
        url: String,
        fromMonth: String,
        fromYear: String,
        toMonth: String,
        toYear: String,
      },
    ],

    /* =========================
       Projects
    ========================= */
    projects: [
      {
        name: String,
        fromMonth: String,
        fromYear: String,
        toMonth: String,
        toYear: String,
        description: String,
        learnings: String,
        skills: String,
        url: String,
      },
    ],

    /* =========================
       Employment
    ========================= */
    employments: [
      {
        company: String,
        role: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    /* =========================
       Competitive Exams
    ========================= */
    competitiveExams: [
      {
        examName: String,
        score: String,
        year: String,
        rank: String,
      },
    ],

    /* =========================
       Achievements
    ========================= */
    achievements: [
      {
        title: String,
        description: String,
        year: String,
      },
    ],

    /* =========================
       Resume
    ========================= */
    profileImage: {
  url: String,
  public_id: String,
},

resume: {
  name: String,
  url: String,
  public_id: String,
  uploadedAt: Date,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);