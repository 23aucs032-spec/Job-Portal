/*const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, (req, res) => {
  res.json({
    message: "Dashboard data loaded",
    user: req.user,
  });
});

module.exports = router; */


// routes/dashboardRoutes.js

const express = require("express");
const {
  getDashboardData,
} = require("../controllers/dashboardcontroller");

const router = express.Router();

// GET - dashboard data
router.get("/", getDashboardData);

module.exports = router;
