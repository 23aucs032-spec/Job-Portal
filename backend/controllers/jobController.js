const mongoose = require("mongoose");
const Job = require("../models/Job");

const {
  allDepartments = [],
  allLocations = [],
  allCompanyTypes = [],
  allRoleCategories = [],
  allEducation = [],
  allIndustries = [],
  allWorkModes = [],
} = require("../data/filtersData");

/* ===============================
   HELPERS
=============================== */
const cleanString = (value) => {
  if (value === undefined || value === null) return "";
  return String(value).trim();
};

const cleanArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item).trim())
    .filter((item) => item !== "");
};

const toNumberOrNull = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const getFieldCounts = async (fieldName) => {
  const results = await Job.aggregate([
    {
      $match: {
        [fieldName]: { $exists: true, $nin: [null, ""] },
      },
    },
    {
      $group: {
        _id: `$${fieldName}`,
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1, _id: 1 },
    },
  ]);

  return results
    .filter((item) => item._id !== null && item._id !== "")
    .map((item) => ({
      name: item._id,
      count: item.count,
    }));
};

const mergeCounts = async (fieldName, masterList = []) => {
  const counts = await getFieldCounts(fieldName);

  const countMap = {};
  counts.forEach((item) => {
    countMap[item.name] = item.count;
  });

  const allNames = [
    ...new Set([...masterList, ...counts.map((item) => item.name)]),
  ];

  return allNames
    .filter((name) => name && String(name).trim() !== "")
    .map((name) => ({
      name,
      count: countMap[name] || 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

/* ===============================
   SALARY RANGE HELPER
=============================== */
const salaryRangeDefinitions = [
  { name: "0-3 LPA", value: "0-3", min: 0, max: 3 },
  { name: "3-6 LPA", value: "3-6", min: 3, max: 6 },
  { name: "6-10 LPA", value: "6-10", min: 6, max: 10 },
  { name: "10-15 LPA", value: "10-15", min: 10, max: 15 },
  { name: "15-25 LPA", value: "15-25", min: 15, max: 25 },
  { name: "25-50 LPA", value: "25-50", min: 25, max: 50 },
];

const getSalaryRangeValue = (minSalary, maxSalary) => {
  const min = Number(minSalary);
  const max = Number(maxSalary);

  if (Number.isNaN(min) || Number.isNaN(max)) return null;

  for (const range of salaryRangeDefinitions) {
    if (min >= range.min && max <= range.max) {
      return range.value;
    }
  }

  return null;
};

const getSalaryCountsData = async () => {
  const jobs = await Job.find(
    {
      minSalary: { $ne: null },
      maxSalary: { $ne: null },
    },
    { minSalary: 1, maxSalary: 1 }
  );

  const countMap = {};

  salaryRangeDefinitions.forEach((range) => {
    countMap[range.value] = 0;
  });

  jobs.forEach((job) => {
    const rangeValue = getSalaryRangeValue(job.minSalary, job.maxSalary);
    if (rangeValue) {
      countMap[rangeValue] += 1;
    }
  });

  return salaryRangeDefinitions.map((range) => ({
    name: range.name,
    value: range.value,
    count: countMap[range.value] || 0,
  }));
};

const buildJobPayload = (body, recruiterId) => {
  return {
    companyName: cleanString(body.companyName),
    consultancyName: cleanString(body.consultancyName),
    companyLogo: cleanString(body.companyLogo),
    hiringFor: cleanString(body.hiringFor),
    title: cleanString(body.title),
    workMode: cleanString(body.workMode),
    department: cleanString(body.department),
    location: cleanString(body.location),
    companyType: cleanString(body.companyType),
    roleCategory: cleanString(body.roleCategory),
    education: cleanString(body.education),
    industry: cleanString(body.industry),
    minExp: toNumberOrNull(body.minExp) ?? 0,
    maxExp: toNumberOrNull(body.maxExp) ?? 0,
    minSalary: toNumberOrNull(body.minSalary) ?? 0,
    maxSalary: toNumberOrNull(body.maxSalary) ?? 0,
    skills: cleanArray(body.skills),
    perks: cleanArray(body.perks),
    responsibilities: cleanArray(body.responsibilities),
    jobDescription: cleanString(body.jobDescription),
    applyBefore: body.applyBefore || null,
    contactEmail: cleanString(body.contactEmail),
    recruiter: recruiterId,
  };
};

/* ===============================
   GET MY JOBS
=============================== */
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json(jobs);
  } catch (err) {
    console.error("getMyJobs error:", err);
    res.status(500).json({
      message: "Failed to fetch your jobs",
      error: err.message,
    });
  }
};

/* ===============================
   GET JOBS BY RECRUITER ID
=============================== */
exports.getJobsByRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
      return res.status(400).json({ message: "Invalid recruiter id" });
    }

    const jobs = await Job.find({ recruiter: recruiterId }).sort({
      createdAt: -1,
    });

    res.status(200).json(jobs);
  } catch (err) {
    console.error("getJobsByRecruiter error:", err);
    res.status(500).json({
      message: "Failed to fetch recruiter jobs",
      error: err.message,
    });
  }
};

/* ===============================
   GET ALL JOBS
=============================== */
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error("getAllJobs error:", err);
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: err.message,
    });
  }
};

/* ===============================
   GET JOB BY ID
=============================== */
exports.getJobById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(job);
  } catch (err) {
    console.error("getJobById error:", err);
    res.status(500).json({
      message: "Failed to fetch job",
      error: err.message,
    });
  }
};

/* ===============================
   GET LATEST JOBS
=============================== */
exports.getLatestJobs = async (req, res) => {
  try {
    const latestJobs = await Job.find().sort({ createdAt: -1 }).limit(8);
    res.status(200).json(latestJobs);
  } catch (error) {
    console.error("getLatestJobs error:", error);
    res.status(500).json({
      message: "Failed to fetch latest jobs",
      error: error.message,
    });
  }
};

/* ===============================
   FILTER JOBS
=============================== */
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

    const query = {};

    if (experience !== undefined && experience !== null && experience !== "") {
      const exp = Number(experience);
      if (!Number.isNaN(exp)) {
        query.minExp = { $lte: exp };
        query.maxExp = { $gte: exp };
      }
    }

    if (Array.isArray(workMode) && workMode.length > 0) {
      query.workMode = { $in: workMode };
    }

    if (Array.isArray(department) && department.length > 0) {
      query.department = { $in: department };
    }

    if (Array.isArray(location) && location.length > 0) {
      query.location = { $in: location };
    }

    if (Array.isArray(companyType) && companyType.length > 0) {
      query.companyType = { $in: companyType };
    }

    if (Array.isArray(roleCategory) && roleCategory.length > 0) {
      query.roleCategory = { $in: roleCategory };
    }

    if (Array.isArray(education) && education.length > 0) {
      query.education = { $in: education };
    }

    if (Array.isArray(industry) && industry.length > 0) {
      query.industry = { $in: industry };
    }

    if (Array.isArray(salary) && salary.length > 0) {
      const salaryConditions = [];

      salary.forEach((range) => {
        if (range === "0-3") {
          salaryConditions.push({
            minSalary: { $gte: 0 },
            maxSalary: { $lte: 3 },
          });
        } else if (range === "3-6") {
          salaryConditions.push({
            minSalary: { $gte: 3 },
            maxSalary: { $lte: 6 },
          });
        } else if (range === "6-10") {
          salaryConditions.push({
            minSalary: { $gte: 6 },
            maxSalary: { $lte: 10 },
          });
        } else if (range === "10-15") {
          salaryConditions.push({
            minSalary: { $gte: 10 },
            maxSalary: { $lte: 15 },
          });
        } else if (range === "15-25") {
          salaryConditions.push({
            minSalary: { $gte: 15 },
            maxSalary: { $lte: 25 },
          });
        } else if (range === "25-50") {
          salaryConditions.push({
            minSalary: { $gte: 25 },
            maxSalary: { $lte: 50 },
          });
        }
      });

      if (salaryConditions.length > 0) {
        query.$or = salaryConditions;
      }
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    console.error("filterJobs error:", err);
    res.status(500).json({
      message: "Failed to filter jobs",
      error: err.message,
    });
  }
};

/* ===============================
   CREATE JOB
=============================== */
exports.createJob = async (req, res) => {
  try {
    const payload = buildJobPayload(req.body, req.user.id);

    if (!payload.title) {
      return res.status(400).json({ message: "Job title is required" });
    }

    if (!payload.companyName && !payload.consultancyName) {
      return res.status(400).json({
        message: "Either company name or consultancy name is required",
      });
    }

    if (!payload.department) {
      return res.status(400).json({ message: "Department is required" });
    }

    if (!payload.location) {
      return res.status(400).json({ message: "Location is required" });
    }

    if (!payload.workMode) {
      return res.status(400).json({ message: "Work mode is required" });
    }

    const job = await Job.create(payload);

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (err) {
    console.error("createJob error:", err);
    res.status(500).json({
      message: "Failed to create job",
      error: err.message,
    });
  }
};

/* ===============================
   UPDATE JOB
=============================== */
exports.updateJob = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const existingJob = await Job.findById(req.params.id);

    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (existingJob.recruiter?.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    const payload = buildJobPayload(req.body, existingJob.recruiter);

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (err) {
    console.error("updateJob error:", err);
    res.status(500).json({
      message: "Failed to update job",
      error: err.message,
    });
  }
};

/* ===============================
   DELETE JOB
=============================== */
exports.deleteJob = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const existingJob = await Job.findById(req.params.id);

    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (existingJob.recruiter?.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("deleteJob error:", err);
    res.status(500).json({
      message: "Failed to delete job",
      error: err.message,
    });
  }
};

/* ===============================
   APPLY JOB
=============================== */
exports.applyJob = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (!Array.isArray(job.applicants)) {
      job.applicants = [];
    }

    const alreadyApplied = job.applicants.some(
      (applicantId) => applicantId.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    job.applicants.push(req.user.id);
    await job.save();

    res.status(200).json({ message: "Applied successfully", job });
  } catch (err) {
    console.error("applyJob error:", err);
    res.status(500).json({
      message: "Failed to apply for job",
      error: err.message,
    });
  }
};

/* ===============================
   GET SIMILAR JOBS
=============================== */
exports.getSimilarJobs = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const currentJob = await Job.findById(jobId);

    if (!currentJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    const similarJobs = await Job.find({
      _id: { $ne: jobId },
      $or: [
        { department: currentJob.department },
        { roleCategory: currentJob.roleCategory },
        { location: currentJob.location },
        { workMode: currentJob.workMode },
        { industry: currentJob.industry },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json(similarJobs);
  } catch (error) {
    console.error("getSimilarJobs error:", error);
    res.status(500).json({
      message: "Failed to fetch similar jobs",
      error: error.message,
    });
  }
};

/* ===============================
   FILTER COUNTS
=============================== */
exports.getDepartmentCounts = async (req, res) => {
  try {
    const data = await mergeCounts("department", allDepartments);
    res.status(200).json(data);
  } catch (error) {
    console.error("getDepartmentCounts error:", error);
    res.status(500).json({
      message: "Failed to fetch department counts",
      error: error.message,
    });
  }
};

exports.getLocationCounts = async (req, res) => {
  try {
    const data = await mergeCounts("location", allLocations);
    res.status(200).json(data);
  } catch (error) {
    console.error("getLocationCounts error:", error);
    res.status(500).json({
      message: "Failed to fetch location counts",
      error: error.message,
    });
  }
};

exports.getCompanyTypeCounts = async (req, res) => {
  try {
    const data = await mergeCounts("companyType", allCompanyTypes);
    res.status(200).json(data);
  } catch (error) {
    console.error("getCompanyTypeCounts error:", error);
    res.status(500).json({
      message: "Failed to fetch company type counts",
      error: error.message,
    });
  }
};

exports.getRoleCategoryCounts = async (req, res) => {
  try {
    const data = await mergeCounts("roleCategory", allRoleCategories);
    res.status(200).json(data);
  } catch (error) {
    console.error("getRoleCategoryCounts error:", error);
    res.status(500).json({
      message: "Failed to fetch role category counts",
      error: error.message,
    });
  }
};

exports.getEducationCounts = async (req, res) => {
  try {
    const data = await mergeCounts("education", allEducation);
    res.status(200).json(data);
  } catch (error) {
    console.error("getEducationCounts error:", error);
    res.status(500).json({
      message: "Failed to fetch education counts",
      error: error.message,
    });
  }
};

exports.getIndustryCounts = async (req, res) => {
  try {
    const data = await mergeCounts("industry", allIndustries);
    res.status(200).json(data);
  } catch (error) {
    console.error("getIndustryCounts error:", error);
    res.status(500).json({
      message: "Failed to fetch industry counts",
      error: error.message,
    });
  }
};

exports.getWorkModeCounts = async (req, res) => {
  try {
    const data = await mergeCounts("workMode", allWorkModes);
    res.status(200).json(data);
  } catch (error) {
    console.error("getWorkModeCounts error:", error);
    res.status(500).json({
      message: "Failed to fetch work mode counts",
      error: error.message,
    });
  }
};

exports.getSalaryCounts = async (req, res) => {
  try {
    const data = await getSalaryCountsData();
    res.status(200).json(data);
  } catch (error) {
    console.error("getSalaryCounts error:", error);
    res.status(500).json({
      message: "Failed to fetch salary counts",
      error: error.message,
    });
  }
};