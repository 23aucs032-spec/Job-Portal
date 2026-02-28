const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const recruiterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    companyName: String,
    employeesRange: String,
    designation: String,
    pincode: String,
    address: String,
    phone: String,
    website: String,
    description: String,
    logo: String,
  },
  { timestamps: true }
);

// Hash password before saving
recruiterSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare password during login
recruiterSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Recruiter", recruiterSchema);