const Application = require("../models/Application");
const Job = require("../models/Job");

/* ================= APPLY JOB ================= */
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized user",
      });
    }

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      status: "Applied",
    });

    if (!Array.isArray(job.applicants)) {
      job.applicants = [];
    }

    const alreadyInApplicants = job.applicants.some(
      (id) => id.toString() === req.user.id
    );

    if (!alreadyInApplicants) {
      job.applicants.push(req.user.id);
      await job.save();
    }

    return res.status(201).json({
      message: "Applied successfully",
      application,
    });
  } catch (error) {
    console.error("applyJob error:", error);
    return res.status(500).json({
      message: "Failed to apply for job",
      error: error.message,
    });
  }
};

/* ================= GET MY APPLIED JOBS ================= */
exports.getMyAppliedJobs = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized user",
      });
    }

    const applications = await Application.find({
      applicant: req.user.id,
    })
      .populate("job")
      .sort({ appliedAt: -1 });

    const appliedJobs = applications
      .filter((application) => application.job)
      .map((application) => ({
        applicationId: application._id,
        appliedAt: application.appliedAt,
        status: application.status,
        _id: application.job._id,
        title: application.job.title || "",
        companyName: application.job.companyName || "",
        consultancyName: application.job.consultancyName || "",
        companyLogo: application.job.companyLogo || "",
        location: application.job.location || "",
        minExp: application.job.minExp ?? 0,
        maxExp: application.job.maxExp ?? 0,
        minSalary: application.job.minSalary ?? 0,
        maxSalary: application.job.maxSalary ?? 0,
        skills: Array.isArray(application.job.skills)
          ? application.job.skills
          : [],
        workMode: application.job.workMode || "",
        department: application.job.department || "",
        roleCategory: application.job.roleCategory || "",
        education: application.job.education || "",
        industry: application.job.industry || "",
        companyType: application.job.companyType || "",
        contactEmail: application.job.contactEmail || "",
        jobDescription: application.job.jobDescription || "",
        responsibilities: Array.isArray(application.job.responsibilities)
          ? application.job.responsibilities
          : [],
        createdAt: application.job.createdAt,
        updatedAt: application.job.updatedAt,
      }));

    return res.status(200).json(appliedJobs);
  } catch (error) {
    console.error("getMyAppliedJobs error:", error);
    return res.status(500).json({
      message: "Failed to fetch applied jobs",
      error: error.message,
    });
  }
};

/* ================= GET APPLICANTS BY JOB ================= */
exports.getApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ job: jobId })
      .populate("applicant")
      .sort({ appliedAt: -1 });

    return res.status(200).json(applications);
  } catch (error) {
    console.error("getApplicantsByJob error:", error);
    return res.status(500).json({
      message: "Failed to fetch applicants",
      error: error.message,
    });
  }
};