const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const recruiterController = require("../controllers/recruiterController");

router.post("/register", recruiterController.registerRecruiter);

router.post("/login", recruiterController.loginRecruiter);

// Protected routes
router.get("/profile", authMiddleware, recruiterController.getProfile);
router.put("/profile", authMiddleware, recruiterController.updateProfile);

module.exports = router;