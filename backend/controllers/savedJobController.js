const SavedJob = require("../models/SavedJob");


/* ================= SAVE JOB ================= */

exports.saveJob = async (req, res) => {

  try {

    const userId = req.user.id;
    const { jobId } = req.body;

    const alreadySaved = await SavedJob.findOne({
      user: userId,
      job: jobId
    });

    if (alreadySaved) {
      return res.status(400).json({ message: "Job already saved" });
    }

    const savedJob = new SavedJob({
      user: userId,
      job: jobId
    });

    await savedJob.save();

    res.json({ message: "Job saved successfully" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


/* ================= GET SAVED JOBS ================= */

exports.getSavedJobs = async (req, res) => {

  try {

    const userId = req.user.id;

    const jobs = await SavedJob.find({ user: userId })
      .populate("job");

    res.json(jobs);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


/* ================= REMOVE SAVED JOB ================= */

exports.removeSavedJob = async (req, res) => {

  try {

    const userId = req.user.id;
    const { jobId } = req.params;

    await SavedJob.findOneAndDelete({
      user: userId,
      job: jobId
    });

    res.json({ message: "Removed successfully" });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};