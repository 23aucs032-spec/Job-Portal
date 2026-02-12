const Job = require("../models/Job");
const Application = require("../models/Application");

// Helper function for trend
const getTrend = (current, previous) => {
    if (previous === 0) 
        return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
};

exports.getEmployerAnalytics = async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ message: "Access denied" });
        }

        const companyId = req.user._id;

        const now = new Date();
        const last7Days = new Date();
        last7Days.setDate(now.getDate() - 7);

        const prev7Days = new Date();
        prev7Days.setDate(now.getDate() - 14);

        // Total active jobs
        const totalActiveJobs = await Job.countDocuments({
            company: companyId,
            isClosed: false
        });

        // Jobs posted in last 7 days
        const currentJobs = await Job.countDocuments({
            company: companyId,
            createdAt: { $gte: last7Days }
        });

        // Jobs posted in previous 7 days
        const previousJobs = await Job.countDocuments({
            company: companyId,
            createdAt: { $gte: prev7Days, $lt: last7Days }
        });

        // Total applications
        const totalApplications = await Application.countDocuments({
            company: companyId
        });

        // Applications in last 7 days
        const currentApplications = await Application.countDocuments({
            company: companyId,
            createdAt: { $gte: last7Days }
        });

        // Applications in previous 7 days
        const previousApplications = await Application.countDocuments({
            company: companyId,
            createdAt: { $gte: prev7Days, $lt: last7Days }
        });

        // Trend calculation
        const jobTrend = getTrend(currentJobs, previousJobs);
        const applicationTrend = getTrend(
            currentApplications,
            previousApplications
        );

        // Most recent jobs
        const recentJobs = await Job.find({ company: companyId })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            analytics: {
                totalActiveJobs,
                totalApplications,
                jobTrend,
                applicationTrend,
                recentJobs
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch analytics",
            error: error.message
        });
    }
};
