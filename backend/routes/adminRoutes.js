const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

// Admin Login
router.post("/login", adminController.adminLogin);

// Dashboard Stats
router.get("/stats", adminAuth, adminController.getStats);

// Users
router.get("/users", adminAuth, adminController.getUsers);
router.delete("/users/:id", adminAuth, adminController.deleteUser);

// Recruiters
router.get("/recruiters", adminAuth, adminController.getRecruiters);
router.delete("/recruiters/:id", adminAuth, adminController.deleteRecruiter);

// Jobs
router.get("/jobs", adminAuth, adminController.getJobs);
router.put("/jobs/approve/:id", adminAuth, adminController.approveJob);
router.put("/jobs/reject/:id", adminAuth, adminController.rejectJob);
router.delete("/jobs/:id", adminAuth, adminController.deleteJob);

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const admin = await Admin.create({ fullName, email, password });
    res.status(201).json({ message: "Admin created", admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;