const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  companyName: String,
  companyLogo: String,

  minExp: Number,
  maxExp: Number,

  minSalary: Number,
  maxSalary: Number,

  workMode: String,         
  department: String,       
  location: String,         
  companyType: String,      
  roleCategory: String,     
  education: String,        
  industry: String,         

  skills: [String],

  // 🔽 Newly Added Fields
  jobDescription: String,
  responsibilities: [String],
  applyBefore: Date,
  contactEmail: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Job", jobSchema);
