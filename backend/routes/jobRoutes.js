const express = require("express");
const Job = require("../models/Job");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User"); // if you want to store applicants

const router = express.Router();

/* =========================
   GET ALL JOBS (Public for Job Seekers)
========================= */
router.get("/all", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

/* =========================
   FILTER JOBS (Naukri Style)
========================= */
router.post("/filter", async (req, res) => {
  try {
    const {
      experience,
      workMode,
      department,
      location,
      salary,
      companyType,
      roleCategory,
      education,
      industry,
    } = req.body;

    let query = {};

    if (experience) query.minExp = { $gte: Number(experience) };
    if (workMode?.length) query.workMode = { $in: workMode };
    if (department?.length) query.department = { $in: department };
    if (location?.length) query.location = { $in: location };
    if (companyType?.length) query.companyType = { $in: companyType };
    if (roleCategory?.length) query.roleCategory = { $in: roleCategory };
    if (education?.length) query.education = { $in: education };
    if (industry?.length) query.industry = { $in: industry };

    /* SALARY SLABS */
    if (salary?.length) {
      let salaryConditions = [];

      salary.forEach((range) => {
        if (range === "0-3") salaryConditions.push({ maxSalary: { $lte: 300000 } });
        if (range === "3-6")
          salaryConditions.push({ maxSalary: { $gt: 300000, $lte: 600000 } });
        if (range === "6-10")
          salaryConditions.push({ maxSalary: { $gt: 600000, $lte: 1000000 } });
        if (range === "10-15") salaryConditions.push({ maxSalary: { $gt: 1000000 } });
      });

      query.$or = salaryConditions;
    }

    const jobs = await Job.find(query);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Filter failed" });
  }
});

/* =========================
   CREATE JOB (Recruiter only)
========================= */
router.post("/", auth, async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      recruiter: req.user.id,
    });

    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Job creation failed" });
  }
});

/* =========================
   GET JOBS POSTED BY RECRUITER
========================= */
router.get("/", auth, async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* =========================
   GET SINGLE JOB (Public for Job Seekers)
========================= */
router.get("/job/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Fetch single job failed" });
  }
});

/* =========================
   GET SINGLE JOB (also allow /:id for frontend)
========================= */
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Fetch single job failed" });
  }
});

/* =========================
   APPLY FOR A JOB (Job Seeker only)
========================= */
router.post("/:id/apply", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check if user already applied
    if (job.applicants && job.applicants.includes(req.user.id)) {
      return res.status(400).json({ message: "You already applied for this job" });
    }

    // Add applicant
    job.applicants = job.applicants || [];
    job.applicants.push(req.user.id);

    await job.save();

    res.json({ message: "Applied successfully" });
  } catch (err) {
    res.status(500).json({ message: "Job application failed", error: err.message });
  }
});

/* =========================
   DELETE JOB (Recruiter only)
========================= */
router.delete("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      recruiter: req.user.id,
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* =========================
   UPDATE JOB (Recruiter only)
========================= */
router.put("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.user.id },
      req.body,
      { new: true }
    );

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

/* =========================
   APPLY FOR JOB (Job Seeker)
========================= */
router.post("/:id/apply", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check if user already applied
    if (job.applicants?.includes(req.user.id)) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    // Add user to applicants array
    job.applicants = job.applicants || [];
    job.applicants.push(req.user.id);
    await job.save();

    res.status(200).json({ message: "Applied successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Job application failed" });
  }
});


/* =========================
   VIEW APPLICANTS (Recruiter only)
========================= */
// routes/jobRoutes.js
router.get("/:id/applicants", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("applicants", "-password"); // exclude passwords

    if (!job) return res.status(404).json({ message: "Job not found" });

    // Only recruiter who posted the job can see applicants
    if (req.user.role !== "recruiter" || job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Send applicant info
    res.json(job.applicants);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applicants", error: err.message });
  }
});


module.exports = router;
