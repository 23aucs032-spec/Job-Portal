const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
  },
  { timestamps: true }
);

recruiterSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


module.exports = mongoose.model("Recruiter", recruiterSchema);
