const express = require("express");
const Job = require("../models/Job");
const auth = require("../middleware/authMiddleware");

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

module.exports = router;
