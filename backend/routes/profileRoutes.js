const express = require("express");
const router = express.Router();
const Recruiter = require("../models/Recruiter");
const authMiddleware = require("../middleware/authMiddleware");

/* ======================
   GET LOGGED-IN RECRUITER
====================== */
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Fetch companyName and email
    const recruiter = await Recruiter
      .findById(req.user.id)
      .select("companyName email"); // <-- added email

    if (!recruiter) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    res.json({ user: recruiter });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
