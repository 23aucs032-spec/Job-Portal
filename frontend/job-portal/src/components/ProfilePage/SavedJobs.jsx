/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Trash2, Eye } from "lucide-react";

const SavedJobs = () => {

  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);


  /* ================= LOAD SAVED JOBS ================= */

 useEffect(() => {

  const fetchSavedJobs = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/saved-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      const jobs = data.map((item) => item.job);

      setSavedJobs(jobs);

    } catch (error) {

      console.log(error);

    }

  };

  fetchSavedJobs();

}, []);


  /* ================= REMOVE JOB ================= */

  const removeJob = async (id) => {

  try {

    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:5000/api/saved-jobs/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    setSavedJobs(savedJobs.filter((job) => job._id !== id));

  } catch (error) {

    console.log(error);

  }

};


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
    show: { opacity: 1, y: 0 }
  };


  return (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-10 text-white bg-black"
    >

      {/* PAGE TITLE */}

      <motion.h2
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-center gap-2 mb-8 text-3xl font-semibold text-center"
      >
        <Bookmark size={28} />
        Saved Jobs
      </motion.h2>


      {/* EMPTY STATE */}

      {savedJobs.length === 0 && (

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg text-center text-gray-400"
        >
          No saved jobs yet
        </motion.p>

      )}


      {/* JOB LIST */}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col max-w-4xl gap-6 mx-auto"
      >

        <AnimatePresence>

          {savedJobs.map((job) => (

            <motion.div
              key={job._id}
              variants={card}
              whileHover={{
                scale: 1.02,
                borderColor: "#3b82f6"
              }}
              exit={{ opacity: 0, y: 20 }}
              className="p-6 border border-gray-700 rounded-xl bg-[#111] shadow-lg transition"
            >

              <div className="flex items-center justify-between">

                {/* LEFT SIDE */}

                <div>

                  <h3 className="text-lg font-semibold text-blue-400">
                    {job.title}
                  </h3>

                  <p className="text-gray-300">
                    {job.companyName}
                  </p>

                  <p className="text-sm text-gray-400">
                    📍 {job.location}
                  </p>

                </div>


                {/* COMPANY LOGO */}

                <img
                  src={
                    job.companyLogo ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  className="p-1 bg-white rounded-lg w-14 h-14"
                  alt="logo"
                />

              </div>


              {/* ACTION BUTTONS */}

              <div className="flex gap-4 mt-5">

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    navigate(`/find-job/${job._id}`)
                  }
                  className="flex items-center gap-2 px-4 py-1 bg-blue-600 rounded"
                >
                  <Eye size={16}/>
                  View
                </motion.button>


                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeJob(job._id)}
                  className="flex items-center gap-2 px-4 py-1 bg-red-600 rounded"
                >
                  <Trash2 size={16}/>
                  Remove
                </motion.button>

              </div>

            </motion.div>

          ))}

        </AnimatePresence>

      </motion.div>

    </motion.div>

  );

};

export default SavedJobs;