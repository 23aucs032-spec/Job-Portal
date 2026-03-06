/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bookmark } from "lucide-react";
import { motion } from "framer-motion";

const FindJobs = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const params = new URLSearchParams(location.search);

  const keyword = params.get("keyword") || "";
  const jobLocation = params.get("location") || "";
  const experience = params.get("experience") || "";

  /* ================= ANIMATION VARIANTS ================= */

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const card = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  useEffect(() => {

    const fetchJobs = async () => {

      try {

        const res = await axios.get(
          "http://localhost:5000/api/jobs/search",
          {
            params: {
              keyword,
              location: jobLocation,
              experience,
            },
          }
        );

        setJobs(res.data || []);

      } catch (error) {

        console.error(
          "Job fetch error:",
          error.response?.data || error.message
        );

      }

    };

    fetchJobs();

  }, [keyword, jobLocation, experience]);


  const handleJobClick = (id) => {

    navigate(`/find-job/${id}`);

  };


  return (

    <motion.div
      className="min-h-screen bg-[#020617] p-10"
      variants={container}
      initial="hidden"
      animate="show"
    >

      {/* TITLE */}

      <motion.h2
        variants={item}
        className="mb-8 text-3xl font-semibold text-center text-white"
      >
        Job Details
      </motion.h2>


      {jobs.length === 0 && (

        <motion.p
          variants={item}
          className="text-lg text-center text-gray-400"
        >
          No jobs found
        </motion.p>

      )}


      <div className="flex flex-col max-w-5xl gap-6 mx-auto">

        {jobs.map((job) => (

          <motion.div
            key={job._id}
            variants={card}
            whileHover={{
              scale: 1.02,
              borderColor: "#3b82f6"
            }}
            onClick={() => handleJobClick(job._id)}
            className="transition border border-gray-700 cursor-pointer bg-black/80 rounded-xl p-7 hover:shadow-lg"
          >

            <div className="flex justify-between">


              {/* LEFT SIDE */}

              <div>

                <motion.h2
                  variants={item}
                  className="text-xl font-semibold text-blue-400"
                >
                  {job.title}
                </motion.h2>


                <motion.p
                  variants={item}
                  className="mt-1 text-sm text-gray-300"
                >
                  {job.companyName}
                </motion.p>


                <motion.div
                  variants={item}
                  className="flex gap-6 mt-2 text-xs text-gray-400"
                >

                  <span>
                    🧳 {job.minExp}-{job.maxExp} yrs
                  </span>

                  <span>
                    📍 {job.location}
                  </span>

                  <span>
                    💰 {job.minSalary}-{job.maxSalary} LPA
                  </span>

                </motion.div>


                {/* SKILLS */}

                {job.skills && (

                  <motion.div
                    variants={item}
                    className="flex flex-wrap gap-2 mt-3"
                  >

                    {job.skills.map((skill, index) => (

                      <motion.span
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        className="px-2 py-1 text-xs text-blue-400 border border-blue-700 rounded bg-blue-500/10"
                      >
                        {skill}
                      </motion.span>

                    ))}

                  </motion.div>

                )}


                {/* DESCRIPTION */}

                {job.jobDescription && (

                  <motion.p
                    variants={item}
                    className="mt-2 text-xs text-gray-400 line-clamp-2"
                  >
                    {job.jobDescription}
                  </motion.p>

                )}

              </div>


              {/* RIGHT SIDE */}

              <div className="flex flex-col items-center gap-3">

                <motion.img
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  src={
                    job.companyLogo ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  className="p-1 bg-white rounded w-14 h-14"
                />

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-400"
                >
                  <Bookmark size={16} />
                  Save
                </motion.button>

              </div>

            </div>

          </motion.div>

        ))}

      </div>

    </motion.div>

  );

};

export default FindJobs;