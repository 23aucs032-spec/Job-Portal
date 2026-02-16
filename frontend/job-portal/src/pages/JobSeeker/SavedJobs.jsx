import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const SavedJobs = () => {

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);


  useEffect(() => {

    const saved =
      JSON.parse(localStorage.getItem("savedJobs")) || [];

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJobs(saved);

  }, []);



  const removeJob = (id) => {

    const updated =
      jobs.filter((job) => job._id !== id);

    setJobs(updated);

    localStorage.setItem(
      "savedJobs",
      JSON.stringify(updated)
    );

  };



  return (

    <div className="min-h-screen bg-black text-white p-8">

      {/* Header */}

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >

        <h2 className="text-4xl font-bold mb-2 text-cyan-400">
          Saved Jobs
        </h2>

        <p className="text-gray-400 mb-8">
          View and manage your saved opportunities
        </p>

      </motion.div>



      {jobs.length === 0 ? (

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400"
        >
          You have not saved any jobs yet.
        </motion.p>

      ) : (

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          className="flex flex-col gap-6"
        >


          {jobs.map((job) => (

            <motion.div

              key={job._id}

              variants={{
                hidden: {
                  opacity: 0,
                  y: 40
                },
                visible: {
                  opacity: 1,
                  y: 0
                }
              }}

              whileHover={{
                scale: 1.02,
                borderColor: "#22d3ee",
                boxShadow: "0px 0px 20px rgba(34,211,238,0.4)"
              }}

              transition={{
                duration: 0.4
              }}

              onClick={() => navigate(`/job/${job._id}`)}

              className="bg-black/80 border border-gray-700 rounded-xl p-6 cursor-pointer transition-all duration-300"
            >


              <div className="flex justify-between items-start">


                {/* LEFT */}

                <div>

                  <h2 className="text-xl text-cyan-400 font-semibold mb-2">
                    {job.title}
                  </h2>


                  <p className="text-gray-300">
                    {job.companyName}
                  </p>


                  <p className="text-sm text-gray-400 mt-1">
                    📍 {job.location}
                  </p>


                  <p className="text-sm text-gray-400">
                    💰 ₹{job.minSalary} - ₹{job.maxSalary}
                  </p>

                </div>



                {/* RIGHT */}

                <motion.button

                  whileHover={{ scale: 1.15 }}

                  whileTap={{ scale: 0.9 }}

                  onClick={(e) => {

                    e.stopPropagation();

                    removeJob(job._id);

                  }}

                  className="text-red-400 hover:text-red-600 font-semibold"
                >

                  Remove

                </motion.button>


              </div>


            </motion.div>

          ))}


        </motion.div>

      )}


    </div>

  );

};

export default SavedJobs;
