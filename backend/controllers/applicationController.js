const Application = require("../models/Application");

exports.applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user.id; // make sure JWT contains user id

    // Check if already applied
    const existing = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existing) {
      return res.status(400).json({
        message: "You already applied for this job",
      });
    }

    // Create application
    const application = new Application({
      job: jobId,
      applicant: userId,
      resume: req.body.resume || "",
    });

    await application.save();

    res.status(201).json({
      message: "Job applied successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Application failed" });
  }
};

exports.getApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const applications = await Application.find({ job: jobId })
      .populate({
        path: "applicant",
        select: "fullName email mobile city skills resume" // pick fields you need
      })
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch applicants" });
  }
};