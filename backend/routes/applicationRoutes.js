/*const express = require("express");
const Application = require("../models/Application");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:jobId", protect, async (req, res) => {
  try {
    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user.id,
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/employer", protect, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("job")
      .populate("applicant");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; */



const express = require("express");
const router = express.Router();
const {
  applyJob,
  getAppliedJobs,
} = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/apply/:jobId", authMiddleware, applyJob);
router.get("/applied", authMiddleware, getAppliedJobs);

module.exports = router;

