const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Under Review", "Shortlisted", "Rejected", "Hired"],
      default: "Applied",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },

    screeningScore: {
      type: Number,
      default: 0,
    },
    screeningResult: {
      type: String,
      enum: ["Selected", "Processing", "Rejected", "Not Screened"],
      default: "Not Screened",
    },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);