/*const Application = require("../models/Application");
const Job = require("../models/Job");

/**
 * GET /api/dashboard/overview
 * Employer dashboard stats
 */
/*const getDashboardOverview = async (req, res) => {
  try {
    const employerId = req.user.id;

    const totalJobs = await Job.countDocuments({
      employer: employerId,
    });

    const activeJobs = await Job.countDocuments({
      employer: employerId,
      isClosed: false,
    });

    const totalApplicants = await Application.countDocuments({
      employer: employerId,
    });

    const hired = await Application.countDocuments({
      employer: employerId,
      status: "hired",
    });

    res.status(200).json({
      totalJobs,
      totalApplicants,
      hired,
      activeJobs,
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    res.status(500).json({
      message: "Failed to load dashboard overview",
    });
  }
};

module.exports = {
  getDashboardOverview,
};
 */



// controllers/dashboardController.js

const getDashboardData = (req, res) => {
  try {
    res.status(200).json({
      message: "Dashboard data loaded successfully",
      stats: {
        totalJobs: 12,
        appliedJobs: 5,
        shortlisted: 2,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { getDashboardData };
