/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bookmark,
  MapPin,
  Briefcase,
  IndianRupee,
  Star,
  ArrowLeft
} from "lucide-react";

const FindJobDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  /* ================= FETCH JOB ================= */
  
  useEffect(() => {

    window.scrollTo(0,0); // scroll top when job changes

    const fetchJob = async () => {

      try {

        setLoading(true);

        const res = await fetch(`http://localhost:5000/api/jobs/${id}`);

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();
        setJob(data);

      } catch (err) {

        setError(err.message);

      } finally {

        setLoading(false);

      }

    };

    fetchJob();

  }, [id]);


  /* ================= FETCH SIMILAR JOBS ================= */

  useEffect(() => {

    const fetchSimilar = async () => {

      try {

        const res = await fetch(
          `http://localhost:5000/api/jobs/similar/${job._id}`
        );

        const data = await res.json();
        setSimilarJobs(data);

      } catch (error) {

        console.log(error);

      }

    };

    if (job) fetchSimilar();

  }, [job]);


  /* ================= ANIMATION VARIANTS ================= */

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const card = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };


  /* ================= SAVE JOB ================= */

const handleSaveJob = async (e, job) => {

  e.stopPropagation();

  try {

    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://localhost:5000/api/saved-jobs/save",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId: job._id
        })
      }
    );

    const data = await res.json();

    alert(data.message);

  } catch (error) {

    console.log(error);

  }

};


  /* ================= LOADING ================= */

  if (loading)
    return <p className="p-10 text-white">Loading...</p>;

  if (error)
    return <p className="p-10 text-red-500">{error}</p>;

  if (!job)
    return <p className="p-10 text-white">No job found</p>;


  return (

    <motion.div
      className="flex justify-center min-h-screen p-8 text-white bg-black"
      variants={container}
      initial="hidden"
      animate="show"
    >

      <div className="flex flex-col w-full max-w-5xl gap-6">

        {/* ================= TOP RIGHT DROPDOWN ================= */}

        <div className="flex justify-end">

          <div className="relative">

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
            >
            </button>

            {menuOpen && (

              <div className="absolute right-0 z-50 w-40 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">

                <button
                  onClick={() => navigate("/find-jobs")}
                  className="w-full px-4 py-2 text-left hover:bg-gray-700"
                >
                  Back to Jobs
                </button>

                <button
                  onClick={() => navigate("/jobseeker/dashboard")}
                  className="w-full px-4 py-2 text-left hover:bg-gray-700"
                >
                  Dashboard
                </button>

              </div>

            )}

          </div>

        </div>


        {/* =====================================================
            CARD 1 : JOB HEADER
        ===================================================== */}

        <motion.div
          variants={card}
          className="bg-[#111] border border-gray-700 rounded-xl p-6 shadow-lg"
        >

          <div className="flex items-start justify-between">

            <div>

              <motion.h1 variants={item} className="text-2xl font-bold">
                {job.title}
              </motion.h1>

              <motion.div
                variants={item}
                className="flex items-center gap-2 mt-2 text-gray-400"
              >

                <p>{job.companyName}</p>

                <Star size={14} className="text-yellow-400"/>

                <span className="text-sm">
                  {job.rating || "3.9"}
                </span>

                <span className="text-sm text-gray-500">
                  {job.reviews || "4704"} Reviews
                </span>

              </motion.div>


              <motion.div
                variants={item}
                className="flex gap-6 mt-4 text-gray-400"
              >

                <div className="flex items-center gap-1">
                  <Briefcase size={16}/>
                  {job.minExp} - {job.maxExp} years
                </div>

                <div className="flex items-center gap-1">
                  <IndianRupee size={16}/>
                  {job.minSalary
                    ? `₹${job.minSalary} - ₹${job.maxSalary}`
                    : "Not Disclosed"}
                </div>

                <div className="flex items-center gap-1">
                  <MapPin size={16}/>
                  {job.location}
                </div>

              </motion.div>


              <motion.div
                variants={item}
                className="flex gap-6 mt-4 text-sm text-gray-500"
              >

                <span>
                  Posted:{" "}
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>

                <span>
                  Openings: {job.openings || 1}
                </span>

                <span>
                  Applicants: {job.applicants || "100+"}
                </span>

              </motion.div>


              <motion.div
                variants={item}
                className="flex gap-4 mt-5"
              >

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/signup")}
                  className="px-6 py-2 text-blue-400 border border-blue-500 rounded-full hover:bg-blue-500 hover:text-white"
                >
                  Register to apply
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="px-6 py-2 bg-blue-600 rounded-full hover:bg-blue-700"
                >
                  Login to apply
                </motion.button>

              </motion.div>

            </div>


            <div className="flex flex-col items-end gap-3">

              <motion.img
                variants={item}
                src={
                  job.companyLogo ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="logo"
                className="w-16 h-16 rounded-lg"
              />

              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={(e)=>handleSaveJob(e,job)}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-400"
              >
                <Bookmark size={16}/>
                Save
              </motion.button>

            </div>

          </div>

        </motion.div>


        {/* =====================================================
            CARD 2 : JOB DETAILS
        ===================================================== */}

        <motion.div
          variants={card}
          className="bg-[#111] border border-gray-700 rounded-xl p-6 shadow-lg"
        >

          <h2 className="mb-4 text-xl font-semibold">
            Job description
          </h2>

          <p className="text-gray-300 whitespace-pre-line">
            {job.jobDescription}
          </p>

          <div className="grid gap-4 mt-6 text-gray-300 md:grid-cols-2">

            <p><span className="font-semibold">Work Mode:</span> {job.workMode}</p>
            <p><span className="font-semibold">Department:</span> {job.department}</p>
            <p><span className="font-semibold">Education:</span> {job.education}</p>
            <p><span className="font-semibold">Industry:</span> {job.industry}</p>
            <p><span className="font-semibold">Company Type:</span> {job.companyType}</p>

            <p>
              <span className="font-semibold">Apply Before:</span>{" "}
              {job.applyBefore
                ? new Date(job.applyBefore).toLocaleDateString()
                : "N/A"}
            </p>

          </div>

        </motion.div>


        {/* =====================================================
            CARD 3 : ABOUT COMPANY
        ===================================================== */}

        <motion.div
          variants={card}
          className="bg-[#111] border border-gray-700 rounded-xl p-6 shadow-lg"
        >

          <h2 className="mb-3 text-xl font-semibold">
            About company
          </h2>

          <p className="leading-relaxed text-gray-300">
            {job.companyDescription ||
              "Company description not available."}
          </p>

        </motion.div>


        {/* =====================================================
            CARD 4 : SIMILAR JOBS
        ===================================================== */}

        <motion.div
          variants={card}
          className="bg-[#111] border border-gray-700 rounded-xl p-6 shadow-lg"
        >

          <h2 className="mb-6 text-xl font-semibold">
            Similar Jobs
          </h2>

          <div className="flex flex-col gap-6">

            {similarJobs.length === 0 && (
              <p className="text-sm text-gray-400">
                No similar jobs found
              </p>
            )}

            {similarJobs.map((item) => (

              <motion.div
                key={item._id}
                whileHover={{ scale: 1.02, borderColor:"#3b82f6" }}
                onClick={() => navigate(`/find-job/${item._id}`)}
                className="transition border border-gray-700 cursor-pointer bg-black/80 rounded-xl p-7 hover:shadow-lg"
              >

                <div className="flex justify-between">

                  <div>

                    <h2 className="text-xl font-semibold text-blue-400">
                      {item.title}
                    </h2>

                    <p className="mt-1 text-sm text-gray-300">
                      {item.companyName}
                    </p>

                    <div className="flex gap-6 mt-2 text-xs text-gray-400">

                      <span>
                        🧳 {item.minExp}-{item.maxExp} yrs
                      </span>

                      <span>
                        📍 {item.location}
                      </span>

                      <span>
                        💰 {item.minSalary}-{item.maxSalary} LPA
                      </span>

                    </div>

                  </div>

                  <div className="flex flex-col items-center gap-3">

                    <img
                      src={
                        item.companyLogo ||
                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      }
                      className="p-1 bg-white rounded w-14 h-14"
                    />

                    <button
                      onClick={(e)=>handleSaveJob(e,item)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-400"
                    >
                      <Bookmark size={16}/>
                      Save
                    </button>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        </motion.div>

      </div>

    </motion.div>

  );

};

export default FindJobDetails;