const Job = require("../models/Job");


// ===============================
// GET MY JOBS
// ===============================

exports.getMyJobs = async (req, res) => {

  try {

    const jobs = await Job.find({
      postedBy: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json(jobs);

  }

  catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};



// ===============================
// GET ALL JOBS
// ===============================

exports.getAllJobs = async (req, res) => {

  try {

    const jobs = await Job.find()
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);

  }

  catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};




// ===============================
// FILTER JOBS (NAUKRI STYLE)
// ===============================

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
      industry

    } = req.body;


    let query = {};



    // ===============================
    // EXPERIENCE FILTER
    // ===============================

    if (experience && experience > 0) {

      query.minExp = {

        $lte: Number(experience)

      };

    }




    // ===============================
    // WORK MODE FILTER
    // ===============================

    if (workMode && workMode.length > 0) {

      query.workMode = {

        $in: workMode

      };

    }




    // ===============================
    // DEPARTMENT FILTER
    // ===============================

    if (department && department.length > 0) {

      query.department = {

        $in: department

      };

    }




    // ===============================
    // LOCATION FILTER
    // ===============================

    if (location && location.length > 0) {

      query.location = {

        $in: location

      };

    }




    // ===============================
    // COMPANY TYPE FILTER
    // ===============================

    if (companyType && companyType.length > 0) {

      query.companyType = {

        $in: companyType

      };

    }




    // ===============================
    // ROLE CATEGORY FILTER
    // ===============================

    if (roleCategory && roleCategory.length > 0) {

      query.roleCategory = {

        $in: roleCategory

      };

    }




    // ===============================
    // EDUCATION FILTER
    // ===============================

    if (education && education.length > 0) {

      query.education = {

        $in: education

      };

    }




    // ===============================
    // INDUSTRY FILTER
    // ===============================

    if (industry && industry.length > 0) {

      query.industry = {

        $in: industry

      };

    }




    // ===============================
    // SALARY FILTER
    // ===============================

    if (salary && salary.length > 0) {

      let salaryConditions = [];



      salary.forEach(range => {

        if (range === "0-3") {

          salaryConditions.push({

            maxSalary: { $lte: 300000 }

          });

        }



        if (range === "3-6") {

          salaryConditions.push({

            maxSalary: {

              $gt: 300000,
              $lte: 600000

            }

          });

        }



        if (range === "6-10") {

          salaryConditions.push({

            maxSalary: {

              $gt: 600000,
              $lte: 1000000

            }

          });

        }



        if (range === "10-15") {

          salaryConditions.push({

            maxSalary: {

              $gt: 1000000

            }

          });

        }

      });



      query.$or = salaryConditions;

    }




    // ===============================
    // FETCH JOBS
    // ===============================

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 });



    res.status(200).json(jobs);

  }

  catch (err) {

    res.status(500).json({

      error: err.message

    });

  }

};




// ===============================
// CREATE JOB
// ===============================

exports.createJob = async (req, res) => {

  try {

    const job = await Job.create({

      ...req.body,

      postedBy: req.user.id

    });



    res.status(201).json(job);

  }

  catch (err) {

    res.status(500).json({

      error: err.message

    });

  }

};

// ===============================
// GET SIMILAR JOBS
// ===============================

exports.getSimilarJobs = async (req, res) => {

  try {

    const jobId = req.params.id;

    const currentJob = await Job.findById(jobId);

    if (!currentJob) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    const similarJobs = await Job.find({

      _id: { $ne: jobId },

      $or: [
        { department: currentJob.department },
        { roleCategory: currentJob.roleCategory },
        { location: currentJob.location }
      ]

    })
    .limit(5)
    .sort({ createdAt: -1 });

    res.status(200).json(similarJobs);

  }

  catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};