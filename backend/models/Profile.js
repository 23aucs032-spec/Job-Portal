// models/Profile.js
const mongoose = require("mongoose");

const personalSchema = new mongoose.Schema({
  fullName:       String,
  gender:         String,
  dateOfBirth:    String,       // or Date
  location:       String,
  mobile:         String,
  email:          String,
  profilePhoto:   String,       // URL or cloud storage key
  profileCompletion: Number,
});

const preferenceSchema = new mongoose.Schema({
  jobTypes:       [String],     // ["Internships", "Full-time Jobs"]
  availability:   String,
  locations:      [String],
});

const educationSchema = new mongoose.Schema({
  courseName:         String,
  otherCourseName:    String,
  specialization:     String,
  otherSpecialization:String,
  college:            String,
  university:         String,
  startYear:          Number,
  endYear:            Number,     // or expected
  courseType:         String,     // Full Time / Part Time
  gradingSystem:      String,
  score:              String,     // "8.4 / 10.0"
});

const projectSchema = new mongoose.Schema({
  title:          String,
  duration:       String,
  description:    String,
  role:           String,
  technologies:   String,
  link:           String,
  createdAt:      { type: Date, default: Date.now },
});

const employmentSchema = new mongoose.Schema({
  company:        String,
  designation:    String,
  duration:       String,
  currentlyWorking: Boolean,
  description:    String,
});

const certificationSchema = new mongoose.Schema({
  name:           String,
  issuer:         String,
  completionId:   String,
  url:            String,
  validity:       String,       // "Lifetime" or date range
});

const awardSchema = new mongoose.Schema({
  title:          String,
  description:    String,
  year:           String,
});

const clubSchema = new mongoose.Schema({
  name:           String,
  position:       String,
  duration:       String,
  description:    String,
  associatedWith: String,
});

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

  personal:       personalSchema,
  preferences:    preferenceSchema,
  education:      educationSchema,

  summary:        String,
  skills:         [String],
  languages:      [String],

  projects:       [projectSchema],
  employment:     [employmentSchema],
  certifications: [certificationSchema],
  awards:         [awardSchema],
  clubs:          [clubSchema],

  resume: {
    fileName:     String,
    uploadedAt:   Date,
    url:          String,     // if stored in cloud
  },

}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);