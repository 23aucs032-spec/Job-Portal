const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const recruiterSchema = new mongoose.Schema(
  {
    accountType: {
      type: String,
      enum: ["company/business", "individual/proprietor"],
      required: true,
      default: "company/business",
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    hiringFor: {
      type: String,
      enum: ["your company", "a consultancy"],
      required: true,
      default: "your company",
      trim: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    industry: {
      type: String,
      required: true,
      trim: true,
    },

    employeesRange: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    companyAddress: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

recruiterSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

recruiterSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Recruiter", recruiterSchema);