const express = require("express");
const router = express.Router();

const applicationController = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/apply", authMiddleware, applicationController.applyJob);

router.get(
  "/my-applied-jobs",
  authMiddleware,
  applicationController.getMyAppliedJobs
);

router.get(
  "/job/:jobId/applicants",
  authMiddleware,
  applicationController.getApplicantsByJob
);

module.exports = router;