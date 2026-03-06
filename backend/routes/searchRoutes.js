const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

router.get("/suggest", async (req, res) => {
  try {
    const { q, type } = req.query;

    if (!q) return res.json([]);

    const regex = new RegExp(q, "i");
    let suggestions = new Set();

    // 🔹 SKILLS AUTOCOMPLETE (ONLY SKILLS)
    if (type === "skills") {

      const jobs = await Job.find({ skills: regex })
        .select("skills")
        .limit(10);

      jobs.forEach((job) => {
        if (job.skills && Array.isArray(job.skills)) {

          job.skills.forEach((skill) => {
            if (regex.test(skill)) {
              suggestions.add(skill);
            }
          });

        }
      });

    }

    // 🔹 COMPANY AUTOCOMPLETE (ONLY COMPANIES)
    else if (type === "companies") {

      const jobs = await Job.find({ companyName: regex })
        .select("companyName")
        .limit(10);

      jobs.forEach((job) => {

        if (job.companyName && regex.test(job.companyName)) {
          suggestions.add(job.companyName);
        }

      });

    }

    // 🔹 LOCATION AUTOCOMPLETE
    else if (type === "location") {

      const jobs = await Job.find({ location: regex })
        .select("location")
        .limit(10);

      jobs.forEach((job) => {

        if (job.location && regex.test(job.location)) {
          suggestions.add(job.location);
        }

      });

    }

    // 🔹 DEFAULT SEARCH
    else {

      const jobs = await Job.find({
        $or: [
          { skills: regex },
          { companyName: regex },
          { location: regex }
        ]
      })
        .select("skills companyName location")
        .limit(10);

      jobs.forEach((job) => {

        if (job.companyName) suggestions.add(job.companyName);
        if (job.location) suggestions.add(job.location);

        if (job.skills && Array.isArray(job.skills)) {
          job.skills.forEach((skill) => {
            if (regex.test(skill)) suggestions.add(skill);
          });
        }

      });

    }

    res.json(Array.from(suggestions));

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: err.message });

  }
});

module.exports = router;