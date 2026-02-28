const express = require("express");
const Job = require("../models/Job");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

/* =====================================================
   MASTER LISTS
===================================================== */
const allDepartments = [
  // SOFTWARE / IT
  "Engineering",
  "Backend Development",
  "Frontend Development",
  "Full Stack Development",
  "Mobile App Development",
  "DevOps",
  "Site Reliability Engineering",
  "Embedded Systems",
  "Game Development",
  "IT Services",

  // DATA
  "Data Science & Analytics",
  "Data Engineering",
  "Business Intelligence",
  "Artificial Intelligence & Machine Learning",
  "Big Data",

  // IT SUPPORT
  "IT & Information Security",
  "Network Administration",
  "System Administration",
  "Technical Support",

  // PRODUCT
  "Product Management",
  "Program Management",
  "Project Management",

  // DESIGN
  "Design & Creative",
  "UI / UX Design",
  "Graphic Design",
  "Animation & Video",

  // SALES
  "Sales & Business Development",
  "Inside Sales",
  "Field Sales",
  "Channel Sales",
  "Enterprise Sales",
  "Retail Sales",

  // MARKETING
  "Marketing & Communication",
  "Digital Marketing",
  "Content Marketing",
  "Brand Management",
  "SEO / SEM",
  "Social Media Marketing",

  // HR
  "Human Resources",
  "Talent Acquisition",
  "HR Operations",
  "Training & Development",

  // FINANCE
  "Finance & Accounting",
  "Accounts Payable",
  "Accounts Receivable",
  "Audit & Taxation",
  "Investment Banking",

  // CUSTOMER
  "Customer Success",
  "Customer Support",
  "Customer Service",

  // OPERATIONS
  "Operations & Support",
  "Business Operations",
  "Office Administration",

  // LEGAL
  "Legal & Compliance",
  "Company Secretary",

  // HEALTHCARE
  "Healthcare & Medical",
  "Doctor",
  "Nursing",
  "Pharmacy",

  // EDUCATION
  "Education & Training",
  "Teaching",
  "Professor / Lecturer",

  // ENGINEERING CORE
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Electronics Engineering",

  // MANUFACTURING
  "Manufacturing",
  "Production",
  "Quality Assurance",

  // SUPPLY CHAIN
  "Supply Chain & Logistics",
  "Procurement",
  "Warehouse",

  // BANKING
  "Banking & Financial Services",
  "Insurance",
  "Risk Management",

  // RETAIL
  "Retail & Store Operations",

  // HOSPITALITY
  "Hospitality & Travel",
  "Hotel Management",
  "Airlines",

  // MEDIA
  "Media & Entertainment",
  "Journalism",

  // OTHERS
  "Administration",
  "Research & Development",
  "Consulting",
  "Freelance",
  "Others"
];

const allLocations = [
  // ===== METRO CITIES =====
  "Bangalore / Bengaluru",
  "Mumbai",
  "Delhi",
  "New Delhi",
  "Gurgaon",
  "Noida",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",

  // ===== TAMIL NADU (ALL DISTRICTS) =====
  "Ariyalur",
  "Chengalpattu",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kallakurichi",
  "Kancheepuram",
  "Kanniyakumari",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Mayiladuthurai",
  "Nagapattinam",
  "Namakkal",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Ranipet",
  "Salem",
  "Sivaganga",
  "Tenkasi",
  "Thanjavur",
  "The Nilgiris",
  "Theni",
  "Thiruvallur",
  "Thiruvarur",
  "Thoothukudi",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tirupathur",
  "Tiruppur",
  "Tiruvannamalai",
  "Vellore",
  "Viluppuram",
  "Virudhunagar",

  // ===== KARNATAKA =====
  "Mysore",
  "Mangalore",
  "Hubli",
  "Belgaum",
  "Electronic City",
  "Whitefield",

  // ===== MAHARASHTRA =====
  "Navi Mumbai",
  "Thane",
  "Nagpur",
  "Nashik",
  "Aurangabad",

  // ===== GUJARAT =====
  "Ahmedabad",
  "Surat",
  "Vadodara",
  "Rajkot",

  // ===== UTTAR PRADESH =====
  "Lucknow",
  "Kanpur",
  "Ghaziabad",
  "Greater Noida",
  "Agra",
  "Varanasi",

  // ===== TELANGANA =====
  "Cyberabad",
  "Warangal",

  // ===== ANDHRA PRADESH =====
  "Visakhapatnam",
  "Vijayawada",

  // ===== KERALA =====
  "Kochi",
  "Trivandrum",
  "Kozhikode",

  // ===== PUNJAB =====
  "Chandigarh",
  "Mohali",
  "Ludhiana",
  "Amritsar",

  // ===== RAJASTHAN =====
  "Jaipur",
  "Udaipur",
  "Jodhpur",

  // ===== MADHYA PRADESH =====
  "Indore",
  "Bhopal",
  "Gwalior",

  // ===== ODISHA =====
  "Bhubaneswar",
  "Cuttack",

  // ===== JHARKHAND =====
  "Ranchi",
  "Jamshedpur",

  // ===== NORTH EAST =====
  "Guwahati",

  // ===== REMOTE =====
  "Remote",
  "Work From Home",
  "Hybrid",
  "Anywhere in India"
];

const allCompanyTypes = [
  "Startup",
  "Foreign MNC",
  "Indian MNC",
  "Product Based",
  "Service Based",
  "Government",
  "Public Sector",
  "Private Limited",
  "Mid Size Company",
  "Large Enterprise",
  "Unicorn",
  "Non-Profit Organization",
  "Consulting Firm"
];

const allRoleCategories = [
  "Retail & B2C Sales",
  "BD / Pre Sales",
  "Voice / Blended",
  "Enterprise & B2B Sales",
  "Sales Support & Operations",
  "Customer Success & Service",
  "Software Development",
  "Finance & Accounting - Other",
  "Other Hospital Staff",
  "Healthcare & Life Sciences",
  "Operations",
  "Operations, Maintenance & Support",
  "Business Process Quality",
  "Content, Editorial & Journalism",
  "Legal & Regulatory - Other",
  "BFSI, Investments & Trading",
  "Non Voice",
  "Data Science & Machine Learning",
  "Engineering",
  "Back Office",
  "Quality Assurance and Testing",
  "Accounting & Taxation",
  "Employee Relations",
  "Human Resources - Other",
  "Digital Marketing",
  "Marketing",
  "Production & Manufacturing",
  "Quality Assurance - Other",
  "Fashion & Accessories",
  "Other Design",
  "Administration",
  "Management Consulting",
  "Other Consulting",
  "Journalism",
  "Pharmaceutical & Biotechnology",
  "Research & Development",
  "Security Services - Other",
  "Administration & Staff",
  "Other"
];

const allEducation = [
  // ===== ANY =====
  "Any Graduate",
  "Any Postgraduate",
  "Graduation Not Required",

  // ===== ARTS =====
  "Bachelor of Arts (B.A)",
  "Master of Arts (M.A)",
  "Bachelor of Fine Arts (BFA)",

  // ===== SCIENCE =====
  "Bachelor of Science (B.Sc)",
  "Master of Science (M.Sc)",

  // ===== COMMERCE =====
  "Bachelor of Commerce (B.Com)",
  "Master of Commerce (M.Com)",

  // ===== ENGINEERING =====
  "Bachelor of Technology (B.Tech)",
  "Bachelor of Engineering (B.E)",
  "Master of Technology (M.Tech)",
  "Master of Engineering (M.E)",

  // ===== MANAGEMENT =====
  "Bachelor of Business Administration (BBA)",
  "Master of Business Administration (MBA/PGDM)",

  // ===== MEDICAL =====
  "MBBS",
  "Medical-MS/MD",
  "Bachelor of Pharmacy (B.Pharm)",
  "Bachelor of Ayurvedic Medicine (BAMS)",
  "Bachelor of Homeopathic Medicine (BHMS)",
  "Bachelor of Veterinary Science (BVSc)",

  // ===== LAW =====
  "LLB",
  "LLM",

  // ===== DIPLOMA =====
  "Diploma",
  "Post Graduate Diploma",
  "Integrated PG",

  // ===== PROFESSIONAL =====
  "CA",
  "CS",
  "ICWA",
  "Others"
];

const allIndustries = [
  // IT & SOFTWARE
  "IT Services & Consulting",
  "Software Product",
  "Internet / E-Commerce",
  "SaaS",
  "Cloud Computing",
  "Cyber Security",
  "Artificial Intelligence",
  "Data Analytics",

  // SALES / MARKETING
  "Advertising & Marketing",
  "Digital Marketing",
  "Market Research",
  "Public Relations",

  // FINANCE
  "Banking",
  "Financial Services",
  "Insurance",
  "Investment Banking",
  "FinTech",

  // HEALTHCARE
  "Pharmaceutical & Life Sciences",
  "Medical Devices",
  "Hospital & Healthcare",
  "Biotechnology",

  // EDUCATION
  "Education / Training",
  "EdTech",
  "E-Learning",

  // MANUFACTURING
  "Automobile",
  "Manufacturing",
  "Industrial Equipment",
  "Electronics",

  // TELECOM
  "Telecom / ISP",

  // REAL ESTATE
  "Real Estate",
  "Infrastructure",
  "Construction",

  // MEDIA
  "Media & Entertainment",
  "Gaming",
  "Animation",

  // CONSULTING
  "Management Consulting",
  "Recruitment / Staffing",
  "Legal Services",

  // RETAIL
  "Retail",
  "FMCG",
  "Consumer Electronics",

  // LOGISTICS
  "Logistics & Supply Chain",
  "Transportation",

  // ENERGY
  "Oil & Gas",
  "Renewable Energy",
  "Power",

  // GOVERNMENT
  "Government",
  "Public Sector",

  // OTHER
  "Hospitality",
  "Travel & Tourism",
  "Non-Profit",
  "Others"
];

/* =====================================================
   GET ALL JOBS (Public)
===================================================== */
// ✅ GET all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const job = new Job({ ...req.body, recruiter: req.user.id });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error("Job creation error:", err); // <-- log full error
    res.status(500).json({ message: "Job creation failed", error: err.message });
  }
});

/* =====================================================
   GENERIC COUNT FUNCTION (Reusable)
===================================================== */
const getCountFromDB = async (field) => {
  return await Job.aggregate([
    { $match: { [field]: { $exists: true, $ne: "" } } },
    { $group: { _id: { $toLower: `$${field}` }, count: { $sum: 1 } } }
  ]);
};

/* =====================================================
   DEPARTMENT COUNT
===================================================== */
router.get("/department-count", async (req, res) => {
  try {
    const dbCounts = await getCountFromDB("department");
    const map = {};
    dbCounts.forEach(item => { map[item._id] = item.count; });

    const result = allDepartments.map(dep => ({
      name: dep,
      count: map[dep.toLowerCase()] || 0
    }));

    res.json(result);
  } catch {
    res.status(500).json([]);
  }
});

/* =====================================================
   LOCATION COUNT
===================================================== */
router.get("/location-count", async (req, res) => {
  try {
    const locations = await Job.aggregate([
      {
        $group: {
          _id: "$location",
          count: { $sum: 1 }
        }
      },
      { $project: { _id: 0, location: "$_id", count: 1 } },
      { $sort: { count: -1 } }
    ]);

    res.json(locations);
  } catch (error) {
    console.error("Location count error:", error);
    res.status(500).json({ error: "Server error fetching locations" });
  }
});

/* =====================================================
   COMPANY TYPE COUNT
===================================================== */
router.get("/company-type-count", async (req, res) => {
  try {
    const dbCounts = await getCountFromDB("companyType");
    const map = {};
    dbCounts.forEach(item => { map[item._id] = item.count; });

    const result = allCompanyTypes.map(type => ({
      name: type,
      count: map[type.toLowerCase()] || 0
    }));

    res.json(result);
  } catch {
    res.status(500).json([]);
  }
});

/* =====================================================
   ROLE CATEGORY COUNT
===================================================== */
router.get("/role-category-count", async (req, res) => {
  try {
    const dbCounts = await getCountFromDB("roleCategory");
    const map = {};
    dbCounts.forEach(item => { map[item._id] = item.count; });

    const result = allRoleCategories.map(role => ({
      name: role,
      count: map[role.toLowerCase()] || 0
    }));

    res.json(result);
  } catch {
    res.status(500).json([]);
  }
});

/* =====================================================
   SALARY COUNT
===================================================== */
router.get("/salary-count", async (req, res) => {
  try {
    const ranges = [
      { label: "0-3 Lakhs", min: 0, max: 3 },
      { label: "3-6 Lakhs", min: 3, max: 6 },
      { label: "6-10 Lakhs", min: 6, max: 10 },
      { label: "10-15 Lakhs", min: 10, max: 15 },
      { label: "15-25 Lakhs", min: 15, max: 25 },
      { label: "25-50 Lakhs", min: 25, max: 50 }
    ];

    const result = await Promise.all(
      ranges.map(async range => {
        const count = await Job.countDocuments({
          minSalary: { $lte: range.max },
          maxSalary: { $gte: range.min }
        });
        return {
          name: range.label,
          value: `${range.min}-${range.max}`,
          count
        };
      })
    );

    res.json(result);
  } catch {
    res.status(500).json([]);
  }
});

/* =====================================================
   EDUCATION COUNT
===================================================== */
router.get("/education-count", async (req, res) => {
  try {
    const dbCounts = await getCountFromDB("education");
    const map = {};
    dbCounts.forEach(item => { map[item._id] = item.count; });

    const result = allEducation.map(edu => ({
      name: edu,
      count: map[edu.toLowerCase()] || 0
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
});

/* =====================================================
   INDUSTRY COUNT
===================================================== */
router.get("/industry-count", async (req, res) => {
  try {
    const dbCounts = await getCountFromDB("industry");
    const map = {};
    dbCounts.forEach(item => { map[item._id] = item.count; });

    const result = allIndustries.map(ind => ({
      name: ind,
      count: map[ind.toLowerCase()] || 0
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
});

/* =====================================================
   FILTER JOBS
===================================================== */
router.post("/filter", async (req, res) => {
  try {
    const filters = req.body || {};
    let query = {};

    const createRegexArray = (arr) => arr.map(val => new RegExp("^" + val + "$", "i"));

    // Experience filter
    if (filters.experience > 0) {
      query.minExp = { $lte: filters.experience };
      query.maxExp = { $gte: filters.experience };
    }

    // Department filter
    if (filters.department?.length) query.department = { $in: createRegexArray(filters.department) };
    // Work Mode filter
    if (filters.workMode?.length) query.workMode = { $in: createRegexArray(filters.workMode) };
    // Company Type filter
    if (filters.companyType?.length) query.companyType = { $in: createRegexArray(filters.companyType) };
    // Role Category filter
    if (filters.roleCategory?.length) query.roleCategory = { $in: createRegexArray(filters.roleCategory) };
    // Education filter
    if (filters.education?.length)
      query.education = {
        $in: filters.education.map(val => new RegExp(val.split("(")[0].trim(), "i"))
      };
    // Industry filter
    if (filters.industry?.length) query.industry = { $in: createRegexArray(filters.industry) };
    // Salary filter
    if (filters.salary?.length) {
      query.$or = filters.salary.map(range => {
        const [min, max] = range.split("-").map(Number);
        return { minSalary: { $lte: max }, maxSalary: { $gte: min } };
      });
    }
    // Geo filter
    if (filters.lat && filters.lng && filters.kms) {
      query.locationGeo = {
        $geoWithin: { $centerSphere: [[filters.lng, filters.lat], filters.kms / 6378.1] }
      };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

/* =====================================================
   CREATE JOB
===================================================== */
router.post("/", auth, async (req, res) => {
  try {
    const job = new Job({ ...req.body, recruiter: req.user.id });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error("Job creation error:", err);
    res.status(500).json({ message: "Job creation failed", error: err.message });
  }
});

// GET jobs for a specific recruiter
router.get("/recruiter/:id", auth, async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.params.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Fetch recruiter jobs error:", err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});
/* =====================================================
   GET JOB BY ID (Public)
===================================================== */
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* =====================================================
   APPLY FOR JOB
===================================================== */
router.post("/:id/apply", auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.applicants?.includes(req.user.id))
      return res.status(400).json({ message: "Already applied" });

    job.applicants = job.applicants || [];
    job.applicants.push(req.user.id);
    await job.save();
    res.json({ message: "Applied successfully" });
  } catch (err) {
    res.status(500).json({ message: "Application failed" });
  }
});

/* =====================================================
   DELETE JOB
===================================================== */
router.delete("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, recruiter: req.user.id });
    if (!job) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* =====================================================
   UPDATE JOB
===================================================== */
router.put("/:id", auth, async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, recruiter: req.user.id },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Not found" });
    res.json(job);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
