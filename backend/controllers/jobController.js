const Job = require("../models/Job");

exports.createJob = async (req, res) => {
  try {
    const {
      jobType,
      companyName,
      consultancyName,
      hiringFor,
      title,
      minExp,
      maxExp,
      minSalary,
      maxSalary,
      skills,
      perks,
    } = req.body;

    // Basic validation
    if (!jobType || !title) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    if (jobType === "company" && !companyName) {
      return res
        .status(400)
        .json({ message: "Company name is required" });
    }

    if (jobType === "consultancy" && !consultancyName) {
      return res
        .status(400)
        .json({ message: "Consultancy name is required" });
    }

    const job = new Job({
      jobType,
      companyName,
      consultancyName,
      hiringFor,
      title,
      minExp,
      maxExp,
      minSalary,
      maxSalary,
      skills,
      perks,
    });

    await job.save();

    res.status(201).json({
      message: "Job posted successfully",
      job,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
