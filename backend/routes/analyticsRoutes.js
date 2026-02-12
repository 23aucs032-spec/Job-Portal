const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getEmplyerAnalytics } = require("../controllers/analyticsController");

router.get("/overview", protect, getEmplyerAnalytics);

module.exports = router;