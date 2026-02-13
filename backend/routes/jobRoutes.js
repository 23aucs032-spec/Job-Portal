const express = require("express");
const Job = require("../models/Job");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   GET ALL JOBS (Public for Job Seekers)
   ⚠️ MUST BE ABOVE "/:id"
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
   POST JOB
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
   GET ONLY MY JOBS
========================= */
router.get("/", auth, async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiter: req.user.id,
    });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* =========================
   GET SINGLE JOB
========================= */
router.get("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      recruiter: req.user.id,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Fetch single job failed" });
  }
});

/* =========================
   DELETE JOB
========================= */
router.delete("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      recruiter: req.user.id,
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* =========================
   UPDATE JOB
========================= */
router.put("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      {
        _id: req.params.id,
        recruiter: req.user.id,
      },
      req.body,
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
