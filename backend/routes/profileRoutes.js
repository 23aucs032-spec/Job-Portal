const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

// Get profile
router.get("/", auth, getProfile);

// Create / Update profile
router.put("/", auth, updateProfile);

module.exports = router;