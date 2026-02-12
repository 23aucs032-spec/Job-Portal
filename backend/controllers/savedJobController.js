/*import SavedJob from "../models/SaveJob.js";

export const saveJob = async (req, res) => {
  try {
    const exists = await SavedJob.findOne({
      job: req.params.jobId,
      user: req.user._id,
    });

    if (exists) {
      return res.status(400).json({ message: "Job already saved" });
    }

    const saved = await SavedJob.create({
      job: req.params.jobId,
      user: req.user._id,
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500
    .json({ message: err.message });
  }
};

export const unsaveJob = async (req, res) => {
  try {
    await SavedJob.findOneAndDelete({
      job: req.params.jobId,
      user: req.user._id,
    });

    res.json({ message: "Job removed from saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMySavedJobs = async (req, res) => {
  try {
    const jobs = await SavedJob.find({ user: req.user._id })
      .populate("job");

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
*/


const SavedJob = require("../models/SaveJob");

const saveJob = async (req, res) => {
  try {
    const exists = await SavedJob.findOne({
      job: req.params.jobId,
      user: req.user._id,
    });

    if (exists) {
      return res.status(400).json({ message: "Job already saved" });
    }

    const saved = await SavedJob.create({
      job: req.params.jobId,
      user: req.user._id,
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const unsaveJob = async (req, res) => {
  try {
    await SavedJob.findOneAndDelete({
      job: req.params.jobId,
      user: req.user._id,
    });

    res.json({ message: "Job removed from saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMySavedJobs = async (req, res) => {
  try {
    const jobs = await SavedJob.find({ user: req.user._id })
      .populate("job");

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  saveJob,
  unsaveJob,
  getMySavedJobs
};
