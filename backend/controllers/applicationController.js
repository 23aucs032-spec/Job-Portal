const Application = require("../models/Application");
const Job = require("../models/Job");
const Profile = require("../models/Profile");
const Recruiter = require("../models/Recruiter");
const nodemailer = require("nodemailer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

/* ================= MAIL CONFIG ================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const VALID_STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Rejected",
  "Hired",
];

const BASE_URL = process.env.SERVER_URL || "http://localhost:5000";
const PYTHON_MATCHER_URL =
  process.env.PYTHON_MATCHER_URL || "http://localhost:8000/match";

/* ================= HELPERS ================= */

const sendMailSafe = async (mailOptions, label = "mail") => {
  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error(`${label} error:`, error.message);
    return { success: false, error: error.message };
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Under Review":
      return "#d97706";
    case "Shortlisted":
      return "#2563eb";
    case "Rejected":
      return "#dc2626";
    case "Hired":
      return "#16a34a";
    default:
      return "#0f766e";
  }
};

const normalizeFilePath = (value) => {
  if (!value) return "";

  if (typeof value === "string") return value.trim();

  if (typeof value === "object") {
    if (typeof value.url === "string") return value.url.trim();
    if (typeof value.path === "string") return value.path.trim();
    if (typeof value.filePath === "string") return value.filePath.trim();
    if (typeof value.resume === "string") return value.resume.trim();
    if (typeof value.location === "string") return value.location.trim();
    if (typeof value.filename === "string") return value.filename.trim();
  }

  return "";
};

const buildPublicFileUrl = (value) => {
  const filePath = normalizeFilePath(value);

  if (!filePath) return "";

  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  return `${BASE_URL}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
};

const formatResumeName = (resumeValue) => {
  const resumePath = normalizeFilePath(resumeValue);
  if (!resumePath) return "Resume";
  const fileName = resumePath.split("/").pop();
  return fileName || "Resume";
};

const getLocalFilePath = (value) => {
  const filePath = normalizeFilePath(value);
  if (!filePath) return "";

  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return "";
  }

  const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
  return path.join(process.cwd(), cleanPath);
};

const getApplicantDetails = async (userId) => {
  const profile = await Profile.findOne({ user: userId });

  return {
    profile,
    applicantName: profile?.name || "Candidate",
    applicantEmail: profile?.email || "",
    applicantPhone: profile?.mobile || profile?.phone || "",
    applicantLocation: profile?.city || profile?.location || "",
    applicantResume: profile?.resume || "",
    applicantResumeUrl: buildPublicFileUrl(profile?.resume),
  };
};

const getJobDescriptionText = (job) => {
  if (!job) return "";

  return (
    job.jobDescription ||
    job.description ||
    job.requirements ||
    [
      job.title,
      job.companyName,
      job.consultancyName,
      job.department,
      job.roleCategory,
      job.education,
      job.industry,
      Array.isArray(job.skills) ? job.skills.join(" ") : "",
      Array.isArray(job.responsibilities) ? job.responsibilities.join(" ") : "",
      job.location,
      job.workMode,
    ]
      .filter(Boolean)
      .join(" ")
  );
};

const buildApplicantResponse = (application, profile) => {
  return {
    _id: application._id,
    status: application.status,
    appliedAt: application.appliedAt || application.createdAt,
    createdAt: application.createdAt,
    screeningScore: application.screeningScore || 0,
    screeningResult: application.screeningResult || "Not Screened",
    applicant: {
      _id: application.applicant?._id,
      name: profile?.name || application.applicant?.name || "",
      fullName: profile?.name || application.applicant?.name || "",
      email: profile?.email || application.applicant?.email || "",
      phone:
        profile?.mobile ||
        profile?.phone ||
        application.applicant?.phone ||
        "",
      mobile: profile?.mobile || "",
      city: profile?.city || "",
      location: profile?.city || profile?.location || "",
      education: profile?.education || "",
      experience: profile?.experience || "",
      skills: profile?.skills || [],
      profileSummary: profile?.profileSummary || "",
      summary: profile?.summary || "",
      profilePic: profile?.profilePic || "",
      resume: profile?.resume || "",
      resumeUrl: buildPublicFileUrl(profile?.resume || ""),
    },
  };
};

const screenSingleApplication = async (application, job) => {
  try {
    const profile = await Profile.findOne({ user: application.applicant });
    const resumeValue = profile?.resume || "";
    const resumeLocalPath = getLocalFilePath(resumeValue);
    const jobDescription = getJobDescriptionText(job);

    if (!resumeLocalPath || !fs.existsSync(resumeLocalPath) || !jobDescription) {
      application.screeningScore = application.screeningScore || 0;
      application.screeningResult =
        application.screeningResult || "Not Screened";
      await application.save();
      return application;
    }

    const form = new FormData();
    form.append("resume", fs.createReadStream(resumeLocalPath));
    form.append("job", jobDescription);

    const response = await axios.post(PYTHON_MATCHER_URL, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const score = Number(response?.data?.match_score || 0);
    const result = response?.data?.result || "Rejected";

    application.screeningScore = score;
    application.screeningResult = result;

    if (result === "Selected") {
      application.status = "Shortlisted";
    } else if (result === "Processing") {
      if (application.status === "Applied") {
        application.status = "Under Review";
      }
    } else if (result === "Rejected") {
      if (application.status === "Applied" || application.status === "Under Review") {
        application.status = "Rejected";
      }
    }

    await application.save();
    return application;
  } catch (error) {
    console.error("screenSingleApplication error:", error.message);
    return application;
  }
};

/* ================= APPLY JOB ================= */

exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const job = await Job.findById(jobId).populate("recruiter");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
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
      screeningScore: 0,
      screeningResult: "Not Screened",
    });

    if (!Array.isArray(job.applicants)) {
      job.applicants = [];
    }

    const alreadyInApplicants = job.applicants.some(
      (id) => id.toString() === req.user.id.toString()
    );

    if (!alreadyInApplicants) {
      job.applicants.push(req.user.id);
      await job.save();
    }

    const {
      applicantName,
      applicantEmail,
      applicantPhone,
      applicantLocation,
      applicantResume,
      applicantResumeUrl,
    } = await getApplicantDetails(req.user.id);

    /* ===== MAIL TO APPLICANT ===== */
    if (applicantEmail) {
      const applicantEmailHtml = `
        <div style="font-family: Arial; padding:20px;">
          <h2 style="color:#0f766e;">Job Application Confirmation</h2>

          <p>Hello <strong>${applicantName}</strong>,</p>

          <p>You have successfully applied for the following job:</p>

          <div style="border:1px solid #ddd; padding:15px; border-radius:10px; margin-top:10px;">
            <p><strong>Job Title:</strong> ${job.title || "N/A"}</p>
            <p><strong>Company:</strong> ${job.companyName || job.consultancyName || "N/A"}</p>
            <p><strong>Location:</strong> ${job.location || "N/A"}</p>
            <p><strong>Salary:</strong> ₹${job.minSalary ?? 0} - ₹${job.maxSalary ?? 0} LPA</p>
            <p><strong>Experience:</strong> ${job.minExp ?? 0} - ${job.maxExp ?? 0} years</p>
            <p><strong>Work Mode:</strong> ${job.workMode || "N/A"}</p>
            <p><strong>Status:</strong> <span style="color:#0f766e;font-weight:bold;">Applied</span></p>
          </div>

          <p style="margin-top:15px;">You can track the application status from your dashboard.</p>

          <p style="margin-top:20px;">
            Regards,<br/>
            <strong>Job Portal Team</strong>
          </p>
        </div>
      `;

      await sendMailSafe(
        {
          from: process.env.EMAIL_USER,
          to: applicantEmail,
          subject: `Application Submitted - ${job.title || "Job"}`,
          html: applicantEmailHtml,
        },
        "apply applicant mail"
      );
    }

    /* ===== MAIL TO RECRUITER ===== */
    const recruiterEmail = job?.recruiter?.email || job?.contactEmail || "";
    const recruiterName =
      job?.recruiter?.fullName || job?.recruiter?.name || "Recruiter";

    if (recruiterEmail) {
      const recruiterEmailHtml = `
        <div style="font-family: Arial; padding:20px;">
          <h2 style="color:#2563eb;">New Job Application Received</h2>

          <p>Hello <strong>${recruiterName}</strong>,</p>

          <p>A new candidate has applied for your job posting.</p>

          <div style="border:1px solid #ddd; padding:15px; border-radius:10px; margin-top:10px;">
            <p><strong>Job Title:</strong> ${job.title || "N/A"}</p>
            <p><strong>Applicant Name:</strong> ${applicantName || "N/A"}</p>
            <p><strong>Applicant Email:</strong> ${applicantEmail || "N/A"}</p>
            <p><strong>Applicant Phone:</strong> ${applicantPhone || "N/A"}</p>
            <p><strong>Location:</strong> ${applicantLocation || "N/A"}</p>
            <p><strong>Resume:</strong> ${
              applicantResumeUrl
                ? `<a href="${applicantResumeUrl}" target="_blank" rel="noopener noreferrer">${formatResumeName(
                    applicantResume
                  )}</a>`
                : "Not uploaded"
            }</p>
            <p><strong>Status:</strong> <span style="color:#0f766e;font-weight:bold;">Applied</span></p>
          </div>

          <p style="margin-top:15px;">
            Please log in to your recruiter dashboard to review the applicant profile and resume.
          </p>

          <p style="margin-top:20px;">
            Regards,<br/>
            <strong>Job Portal Team</strong>
          </p>
        </div>
      `;

      await sendMailSafe(
        {
          from: process.env.EMAIL_USER,
          to: recruiterEmail,
          subject: `New Applicant - ${job.title || "Job"}`,
          html: recruiterEmailHtml,
        },
        "apply recruiter mail"
      );
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
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const applications = await Application.find({
      applicant: req.user.id,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    const appliedJobs = applications
      .filter((application) => application.job)
      .map((application) => ({
        applicationId: application._id,
        appliedAt: application.appliedAt || application.createdAt,
        status: application.status,
        screeningScore: application.screeningScore || 0,
        screeningResult: application.screeningResult || "Not Screened",
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

    const job = await Job.findById(jobId).populate("recruiter");

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    let applications = await Application.find({ job: jobId })
      .populate("applicant", "name email phone")
      .sort({ createdAt: -1 });

    for (const application of applications) {
      await screenSingleApplication(application, job);
    }

    applications = await Application.find({ job: jobId })
      .populate("applicant", "name email phone")
      .sort({ screeningScore: -1, createdAt: -1 });

    const applicants = await Promise.all(
      applications.map(async (application) => {
        const profile = await Profile.findOne({ user: application.applicant._id });
        return buildApplicantResponse(application, profile);
      })
    );

    const shortlistedApplicants = applicants.slice(0, 10);

    return res.status(200).json({
      job: {
        _id: job._id,
        title: job.title || "",
        companyName: job.companyName || job.consultancyName || "",
      },
      totalApplicants: applicants.length,
      shortlistedApplicants,
      applicants,
    });
  } catch (error) {
    console.error("getApplicantsByJob error:", error);

    return res.status(500).json({
      message: "Failed to fetch applicants",
      error: error.message,
    });
  }
};

/* ================= GET ALL APPLICANTS ================= */

exports.getAllApplicantsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email phone")
      .sort({ screeningScore: -1, createdAt: -1 });

    const applicants = await Promise.all(
      applications.map(async (application) => {
        const profile = await Profile.findOne({ user: application.applicant._id });
        return buildApplicantResponse(application, profile);
      })
    );

    return res.status(200).json({
      job: {
        _id: job._id,
        title: job.title || "",
        companyName: job.companyName || job.consultancyName || "",
      },
      totalApplicants: applicants.length,
      applicants,
    });
  } catch (error) {
    console.error("getAllApplicantsByJob error:", error);

    return res.status(500).json({
      message: "Failed to fetch all applicants",
      error: error.message,
    });
  }
};

/* ================= UPDATE APPLICATION STATUS ================= */

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Use Applied, Under Review, Shortlisted, Rejected, or Hired",
      });
    }

    const application = await Application.findById(applicationId).populate({
      path: "job",
      populate: {
        path: "recruiter",
        model: "Recruiter",
      },
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    application.status = status;
    await application.save();

    const {
      applicantName,
      applicantEmail,
      applicantPhone,
      applicantLocation,
      applicantResume,
      applicantResumeUrl,
    } = await getApplicantDetails(application.applicant);

    const color = getStatusColor(status);
    let mailWarning = null;

    /* ===== MAIL TO APPLICANT ===== */
    if (applicantEmail) {
      const applicantStatusEmailHtml = `
        <div style="font-family: Arial; padding:20px;">
          <h2 style="color:${color};">Application Status Updated</h2>

          <p>Hello <strong>${applicantName || "Candidate"}</strong>,</p>

          <p>Your application status has been updated.</p>

          <div style="border:1px solid #ddd; padding:15px; border-radius:10px; margin-top:10px;">
            <p><strong>Job Title:</strong> ${application.job?.title || "N/A"}</p>
            <p><strong>Company:</strong> ${
              application.job?.companyName ||
              application.job?.consultancyName ||
              "N/A"
            }</p>
            <p><strong>Status:</strong> <span style="color:${color}; font-weight:bold;">${status}</span></p>
          </div>

          <p style="margin-top:15px;">You can track the application status from your dashboard.</p>

          <p style="margin-top:20px;">
            Regards,<br/>
            <strong>Job Portal Team</strong>
          </p>
        </div>
      `;

      const applicantMailResult = await sendMailSafe(
        {
          from: process.env.EMAIL_USER,
          to: applicantEmail,
          subject: `Application Status Updated - ${application.job?.title || "Job"}`,
          html: applicantStatusEmailHtml,
        },
        "status update applicant mail"
      );

      if (!applicantMailResult.success) {
        mailWarning = "Status updated, but applicant email notification failed";
      }
    }

    /* ===== MAIL TO RECRUITER ===== */
    const recruiterEmail =
      application.job?.recruiter?.email || application.job?.contactEmail || "";
    const recruiterName =
      application.job?.recruiter?.fullName ||
      application.job?.recruiter?.name ||
      "Recruiter";

    if (recruiterEmail) {
      const recruiterStatusEmailHtml = `
        <div style="font-family: Arial; padding:20px;">
          <h2 style="color:${color};">Applicant Status Updated</h2>

          <p>Hello <strong>${recruiterName}</strong>,</p>

          <p>The application status has been changed successfully.</p>

          <div style="border:1px solid #ddd; padding:15px; border-radius:10px; margin-top:10px;">
            <p><strong>Job Title:</strong> ${application.job?.title || "N/A"}</p>
            <p><strong>Applicant Name:</strong> ${applicantName || "N/A"}</p>
            <p><strong>Applicant Email:</strong> ${applicantEmail || "N/A"}</p>
            <p><strong>Applicant Phone:</strong> ${applicantPhone || "N/A"}</p>
            <p><strong>Location:</strong> ${applicantLocation || "N/A"}</p>
            <p><strong>Resume:</strong> ${
              applicantResumeUrl
                ? `<a href="${applicantResumeUrl}" target="_blank" rel="noopener noreferrer">${formatResumeName(
                    applicantResume
                  )}</a>`
                : "Not uploaded"
            }</p>
            <p><strong>Updated Status:</strong> <span style="color:${color}; font-weight:bold;">${status}</span></p>
          </div>

          <p style="margin-top:20px;">
            Regards,<br/>
            <strong>Job Portal Team</strong>
          </p>
        </div>
      `;

      const recruiterMailResult = await sendMailSafe(
        {
          from: process.env.EMAIL_USER,
          to: recruiterEmail,
          subject: `Applicant Status Updated - ${application.job?.title || "Job"}`,
          html: recruiterStatusEmailHtml,
        },
        "status update recruiter mail"
      );

      if (!recruiterMailResult.success && !mailWarning) {
        mailWarning = "Status updated, but recruiter email notification failed";
      }
    }

    return res.status(200).json({
      message: mailWarning || "Application status updated successfully",
      application,
      mailWarning,
    });
  } catch (error) {
    console.error("updateApplicationStatus error:", error);

    return res.status(500).json({
      message: "Failed to update application status",
      error: error.message,
    });
  }
};