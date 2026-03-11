const Application = require("../models/Application");
const Job = require("../models/Job");
const Profile = require("../models/Profile");
const nodemailer = require("nodemailer");

/* ================= MAIL CONFIG ================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

    /* ===== CREATE APPLICATION ===== */

    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      status: "Applied",
    });

    /* ===== UPDATE JOB APPLICANTS ===== */

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

    /* ===== SEND EMAIL NOTIFICATION ===== */

    const profile = await Profile.findOne({ user: req.user.id });

    if (profile?.email) {
      const emailHtml = `
      <div style="font-family: Arial; padding:20px;">
        <h2 style="color:#0f766e;">Job Application Confirmation</h2>

        <p>Hello <strong>${profile.name || "Candidate"}</strong>,</p>

        <p>You have successfully applied for the following job:</p>

        <div style="border:1px solid #ddd; padding:15px; border-radius:10px; margin-top:10px;">
          <p><strong>Job Title:</strong> ${job.title}</p>
          <p><strong>Company:</strong> ${job.companyName || job.consultancyName || "N/A"}</p>
          <p><strong>Location:</strong> ${job.location || "N/A"}</p>
          <p><strong>Salary:</strong> ₹${job.minSalary ?? 0} - ₹${job.maxSalary ?? 0} LPA</p>
          <p><strong>Experience:</strong> ${job.minExp ?? 0} - ${job.maxExp ?? 0} years</p>
          <p><strong>Work Mode:</strong> ${job.workMode || "N/A"}</p>
          <p><strong>Status:</strong> <span style="color:green;font-weight:bold;">Applied</span></p>
        </div>

        <p style="margin-top:15px;">
          You can track the application status from your dashboard.
        </p>

        <p style="margin-top:20px;">
          Regards,<br/>
          <strong>Job Portal Team</strong>
        </p>
      </div>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: profile.email,
        subject: `Application Submitted - ${job.title}`,
        html: emailHtml,
      });
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
        ...application.job.toObject(),
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