const mongoose = require("mongoose");

const applicantSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  skills: [String],
  resume: String,
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Applicant", applicantSchema);
