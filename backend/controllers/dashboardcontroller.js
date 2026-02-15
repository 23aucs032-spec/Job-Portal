
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
