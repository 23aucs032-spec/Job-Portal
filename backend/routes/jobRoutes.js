const express = require("express");
const router = express.Router();

const jobController = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");

/* ===============================
   COUNT ROUTES
=============================== */
router.get("/department-count", jobController.getDepartmentCounts);
router.get("/location-count", jobController.getLocationCounts);
router.get("/company-type-count", jobController.getCompanyTypeCounts);
router.get("/role-category-count", jobController.getRoleCategoryCounts);
router.get("/education-count", jobController.getEducationCounts);
router.get("/industry-count", jobController.getIndustryCounts);
router.get("/work-mode-count", jobController.getWorkModeCounts);
router.get("/salary-count", jobController.getSalaryCounts);

/* ===============================
   STATIC / PUBLIC ROUTES
=============================== */
router.get("/latest", jobController.getLatestJobs);
router.get("/search", jobController.searchJobs);
router.get("/similar/:id", jobController.getSimilarJobs);
router.get("/my/jobs", authMiddleware, jobController.getMyJobs);

/* ===============================
   RECRUITER JOB ROUTE
=============================== */
router.get(
  "/recruiter/:recruiterId",
  authMiddleware,
  jobController.getJobsByRecruiter
);

router.get("/", jobController.getAllJobs);
router.post("/filter", jobController.filterJobs);

/* ===============================
   PROTECTED ROUTES
=============================== */
router.post("/", authMiddleware, jobController.createJob);
router.put("/:id", authMiddleware, jobController.updateJob);
router.delete("/:id", authMiddleware, jobController.deleteJob);

/* ===============================
   DYNAMIC ROUTE LAST
=============================== */
router.get("/:id", jobController.getJobById);

module.exports = router;