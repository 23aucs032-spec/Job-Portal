const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  applyJob,
  getApplicants
} = require("../controllers/applicationController");

router.post("/apply/:jobId", auth, applyJob);

router.get("/job/:jobId/applicants", auth, getApplicants);

module.exports = router;