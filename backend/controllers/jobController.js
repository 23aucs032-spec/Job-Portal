const Job = require("../models/Job");

// GET ALL JOBS
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// FILTER JOBS (Naukri style)
exports.filterJobs = async (req, res) => {
  try {
    const {
      experience,
      workMode,
      department,
      location,
      salary,
      companyType,
      roleCategory,
      education,
      industry,
    } = req.body;

    let query = {};

    if (experience)
      query.minExp = { $gte: Number(experience) };

    if (workMode?.length)
      query.workMode = { $in: workMode };

    if (department?.length)
      query.department = { $in: department };

    if (location?.length)
      query.location = { $in: location };

    if (companyType?.length)
      query.companyType = { $in: companyType };

    if (roleCategory?.length)
      query.roleCategory = { $in: roleCategory };

    if (education?.length)
      query.education = { $in: education };

    if (industry?.length)
      query.industry = { $in: industry };

    // SALARY SLAB LOGIC
    if (salary?.length) {
      let salaryConditions = [];

      salary.forEach((range) => {
        if (range === "0-3")
          salaryConditions.push({ maxSalary: { $lte: 300000 } });

        if (range === "3-6")
          salaryConditions.push({
            maxSalary: { $gt: 300000, $lte: 600000 },
          });

        if (range === "6-10")
          salaryConditions.push({
            maxSalary: { $gt: 600000, $lte: 1000000 },
          });

        if (range === "10-15")
          salaryConditions.push({ maxSalary: { $gt: 1000000 } });
      });

      query.$or = salaryConditions;
    }

    const jobs = await Job.find(query);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE JOB (for testing)
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      postedBy: req.user.id, // Add this
    });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
