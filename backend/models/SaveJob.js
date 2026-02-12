//import mongoose from "mongoose";
const mongoose = require("mongoose");

const savedJobSchema = new mongoose.Schema(
    {
        jobseeker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", require: true },
    } , { timestamps: true }
);


const SavedJob = mongoose.model("SavedJob", savedJobSchema);

//export default SavedJob;

module.exports = SavedJob;