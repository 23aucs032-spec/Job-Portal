const mongoose = require("mongoose");

const recruiterSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    companyName: String,
    employeesRange: String,
    designation: String,
    pincode: String,
    address: String,
    role: { type: String, default: "recruiter" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recruiter", recruiterSchema);
