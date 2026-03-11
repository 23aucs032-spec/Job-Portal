const mongoose = require("mongoose");

const EducationSchema = new mongoose.Schema({
  degree: {
    type: String,
    default: "",
  },
  specialization: {
    type: String,
    default: "",
  },
  institute: {
    type: String,
    default: "",
  },
  instituteLocation: {
    type: String,
    default: "",
  },
  startYear: {
    type: String,
    default: "",
  },
  endYear: {
    type: String,
    default: "",
  },
  courseType: {
    type: String,
    default: "",
  },
  percentage: {
    type: String,
    default: "",
  },

  marksheet: {
    url: {
      type: String,
      default: "",
    },
    public_id: {
      type: String,
      default: "",
    },
  },

  school12Name: {
    type: String,
    default: "",
  },
  school12Location: {
    type: String,
    default: "",
  },
  school12StartYear: {
    type: String,
    default: "",
  },
  school12EndYear: {
    type: String,
    default: "",
  },
  school12Percentage: {
    type: String,
    default: "",
  },
  school12Marksheet: {
    url: {
      type: String,
      default: "",
    },
    public_id: {
      type: String,
      default: "",
    },
  },

  school10Name: {
    type: String,
    default: "",
  },
  school10Location: {
    type: String,
    default: "",
  },
  school10StartYear: {
    type: String,
    default: "",
  },
  school10EndYear: {
    type: String,
    default: "",
  },
  school10Percentage: {
    type: String,
    default: "",
  },
  school10Marksheet: {
    url: {
      type: String,
      default: "",
    },
    public_id: {
      type: String,
      default: "",
    },
  },
});

const InternshipSchema = new mongoose.Schema(
  {
    company: { type: String, default: "" },
    project: { type: String, default: "" },
    description: { type: String, default: "" },
    skills: { type: String, default: "" },
    url: { type: String, default: "" },
    fromMonth: { type: String, default: "" },
    fromYear: { type: String, default: "" },
    toMonth: { type: String, default: "" },
    toYear: { type: String, default: "" },
  },
  { _id: true }
);

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    startMonth: { type: String, default: "" },
    startYear: { type: String, default: "" },
    endMonth: { type: String, default: "" },
    endYear: { type: String, default: "" },
    fromMonth: { type: String, default: "" },
    fromYear: { type: String, default: "" },
    toMonth: { type: String, default: "" },
    toYear: { type: String, default: "" },
    description: { type: String, default: "" },
    learnings: { type: String, default: "" },
    skills: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
    url: { type: String, default: "" },
  },
  { _id: true }
);

const EmploymentSchema = new mongoose.Schema(
  {
    company: { type: String, default: "" },
    role: { type: String, default: "" },
    fromMonth: { type: String, default: "" },
    fromYear: { type: String, default: "" },
    toMonth: { type: String, default: "" },
    toYear: { type: String, default: "" },
    currentlyWorking: { type: Boolean, default: false },
    description: { type: String, default: "" },
    duration: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
  },
  { _id: true }
);

const CompetitiveExamSchema = new mongoose.Schema(
  {
    examName: { type: String, default: "" },
    score: { type: String, default: "" },
    year: { type: String, default: "" },
    rank: { type: String, default: "" },
  },
  { _id: true }
);

const AchievementSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    year: { type: String, default: "" },
  },
  { _id: true }
);

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },

    languages: {
      type: [String],
      default: [],
    },

    profileSummary: {
      type: String,
      default: "",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailOtp: {
      type: String,
      default: "",
    },
    emailOtpExpires: {
      type: Date,
      default: null,
    },

    skills: {
      type: [String],
      default: [],
    },

    preferences: {
      types: {
        type: [String],
        default: [],
      },
      availability: {
        type: String,
        default: "",
      },
      locations: {
        type: [String],
        default: [],
      },
    },

    education: {
      type: [EducationSchema],
      default: [],
    },

    internships: {
      type: [InternshipSchema],
      default: [],
    },

    projects: {
      type: [ProjectSchema],
      default: [],
    },

    employments: {
      type: [EmploymentSchema],
      default: [],
    },

    competitiveExams: {
      type: [CompetitiveExamSchema],
      default: [],
    },

    achievements: {
      type: [AchievementSchema],
      default: [],
    },

    profileImage: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    resume: {
      name: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
      uploadedAt: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);