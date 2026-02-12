/*import Application from "../models/Application.js";
import Job from "../models/Job.js";

// Apply to a job
export const applyToJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only job seekers can apply" });
    }

    const { jobId } = req.params;
    const { resume } = req.body;

    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my applications (Jobseeker)
export const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate("job", "title company location type")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get applicants for a job (Employer)
export const getMyApplicantForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const applicants = await Application.find({ job: job._id })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });

    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single application
export const getMyApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate("job")
      .populate("applicant", "name email");

    if (!app) return res.status(404).json({ message: "Application not found" });

    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update application status (Employer)
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const app = await Application.findById(req.params.id).populate("job");

    if (!app) return res.status(404).json({ message: "Application not found" });

    if (app.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    app.status = status;
    await app.save();

    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const Application = require("../models/Application");
const Job = require("../models/Job");

// Apply to a job
const applyToJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only job seekers can apply" });
    }

    const { jobId } = req.params;
    const { resume } = req.body;

    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my applications (Jobseeker)
const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate("job", "title company location type")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get applicants for a job (Employer)
const getMyApplicantForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const applicants = await Application.find({ job: job._id })
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });

    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single application
const getMyApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate("job")
      .populate("applicant", "name email");

    if (!app) return res.status(404).json({ message: "Application not found" });

    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update application status (Employer)
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const app = await Application.findById(req.params.id).populate("job");

    if (!app) return res.status(404).json({ message: "Application not found" });

    if (app.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    app.status = status;
    await app.save();

    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getMyApplicantForJob,
  getMyApplicationById,
  updateStatus
}; */



const Application = require("../models/Application");

exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const alreadyApplied = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You already applied for this job",
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: userId,
    });

    res.status(201).json({
      success: true,
      message: "Job applied successfully",
      application,
    });
  } catch (error) {
    console.error("Apply job error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAppliedJobs = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user.id,
    }).populate("job");

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
