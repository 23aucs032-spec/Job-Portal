/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bookmark,
  MapPin,
  Briefcase,
  IndianRupee,
  ArrowLeft
} from "lucide-react";

const JobDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH JOB ================= */

  useEffect(() => {

    window.scrollTo(0,0);

    const fetchJob = async () => {

      try {

        const res = await fetch(
          `http://localhost:5000/api/jobs/${id}`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {},
          }
        );

        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();

        setJob(data);

        if (token && data.applicants?.length > 0) {

          const userId =
            JSON.parse(atob(token.split(".")[1])).id;

          if (data.applicants.includes(userId)) {
            setApplied(true);
          }

        }

      }

      catch (err) {

        setError(err.message);

      }

      finally {

        setLoading(false);

      }

    };

    fetchJob();

  }, [id, token]);


  /* ================= FETCH SIMILAR JOBS ================= */

  useEffect(() => {

    const fetchSimilar = async () => {

      try {

        const res = await fetch(
          `http://localhost:5000/api/jobs/similar/${id}`
        );

        const data = await res.json();

        setSimilarJobs(data);

      }

      catch (error) {

        console.log(error);

      }

    };

    fetchSimilar();

  }, [id]);


  /* ================= APPLY ================= */

  const handleApply = async () => {

    try {

      if (!token) {

        alert("You must login first!");

        navigate("/login");

        return;

      }

      const res = await fetch(
        `http://localhost:5000/api/jobs/${id}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.message === "You already applied for this job") {

        setApplied(true);

        return;

      }

      if (!res.ok) throw new Error(data.message);

      setApplied(true);

    }

    catch (err) {

      alert(err.message);

    }

  };


  /* ================= SAVE JOB ================= */

  const handleSaveJob = async (e, job) => {

    e.stopPropagation();

    try {

      if (!token) {

        alert("Please login first");

        navigate("/login");

        return;

      }

      const res = await fetch(
        "http://localhost:5000/api/saved-jobs/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobId: job._id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {

        if (data.message === "Job already saved") {
          alert("Job already saved");
          return;
        }

        throw new Error(data.message);
      }

      alert("Job Saved Successfully");

    }

    catch (error) {

      alert("Unable to save job");

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
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
    >

      <div className="flex flex-col w-full max-w-5xl gap-6">

        {/* SUCCESS MESSAGE */}

        {applied && (

          <motion.div
            initial={{ y:-50, opacity:0 }}
            animate={{ y:0, opacity:1 }}
            className="fixed z-50 px-6 py-2 text-white transform -translate-x-1/2 bg-green-600 rounded shadow-lg top-4 left-1/2"
          >
            ✅ Applied successfully!
          </motion.div>

        )}

        {/* BACK BUTTON */}

        <div className="flex justify-end">

          <button
            onClick={()=>navigate("/jobseeker/dashboard")}
            className="flex items-center gap-2 px-4 py-2 transition bg-gray-800 border border-gray-600 rounded-full hover:bg-blue-600"
          >
            <ArrowLeft size={16}/>
            Dashboard
          </button>

        </div>


        {/* =====================================================
            CARD 1 : JOB HEADER
        ===================================================== */}

        <div className="bg-[#111] border border-gray-700 rounded-xl p-6 shadow-lg">

          <div className="flex items-start justify-between">

            <div>

              <h1 className="text-2xl font-bold">
                {job.title}
              </h1>

              <div className="flex items-center gap-2 mt-2 text-gray-400">
                {job.companyName}
              </div>

              <div className="flex gap-6 mt-4 text-gray-400">

                <div className="flex items-center gap-1">
                  <Briefcase size={16}/>
                  {job.minExp} - {job.maxExp} yrs
                </div>

                <div className="flex items-center gap-1">
                  <IndianRupee size={16}/>
                  ₹{job.minSalary} - ₹{job.maxSalary}
                </div>

                <div className="flex items-center gap-1">
                  <MapPin size={16}/>
                  {job.location}
                </div>

              </div>

              <div className="flex gap-6 mt-4 text-sm text-gray-500">

                <span>
                  Posted: {new Date(job.createdAt).toLocaleDateString()}
                </span>

              </div>

              <div className="flex gap-4 mt-5">

                {applied ? (

                  <button
                    disabled
                    className="px-6 py-2 text-gray-400 border border-gray-600 rounded-full"
                  >
                    Already Applied
                  </button>

                ) : (

                  <button
                    onClick={handleApply}
                    className="px-6 py-2 bg-blue-600 rounded-full hover:bg-blue-700"
                  >
                    Apply Now
                  </button>

                )}

              </div>

            </div>


            <div className="flex flex-col items-end gap-3">

              <img
                src={
                  job.companyLogo ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="logo"
                className="w-16 h-16 rounded-lg"
              />

              <button
                onClick={(e)=>handleSaveJob(e,job)}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-400"
              >
                <Bookmark size={16}/>
                Save
              </button>

            </div>

          </div>

        </div>


        {/* =====================================================
            CARD 2 : JOB DESCRIPTION
        ===================================================== */}

        <div className="bg-[#111] border border-gray-700 rounded-xl p-6 shadow-lg">

          <h2 className="mb-4 text-xl font-semibold">
            Job description
          </h2>

          <p className="text-gray-300 whitespace-pre-line">
            {job.jobDescription}
          </p>

          {job.responsibilities?.length > 0 && (

            <div className="mt-6">

              <h3 className="mb-2 font-semibold">
                Responsibilities
              </h3>

              <ul className="space-y-1 text-gray-300 list-disc list-inside">

                {job.responsibilities.map((item,idx)=>(
                  <li key={idx}>{item}</li>
                ))}

              </ul>

            </div>

          )}

          {job.skills?.length > 0 && (

            <div className="flex flex-wrap gap-2 mt-6">

              {job.skills.map((skill,index)=>(
                <span
                  key={index}
                  className="px-2 py-1 text-xs text-blue-400 border border-blue-700 rounded bg-blue-500/10"
                >
                  {skill}
                </span>
              ))}

            </div>

          )}

          <div className="grid gap-4 mt-6 text-gray-300 md:grid-cols-2">

            <p><b>Work Mode:</b> {job.workMode}</p>
            <p><b>Department:</b> {job.department}</p>
            <p><b>Role Category:</b> {job.roleCategory}</p>
            <p><b>Education:</b> {job.education}</p>
            <p><b>Industry:</b> {job.industry}</p>
            <p><b>Company Type:</b> {job.companyType}</p>
            <p><b>Contact Email:</b> {job.contactEmail}</p>

            <p>
              <b>Apply Before:</b>{" "}
              {job.applyBefore
                ? new Date(job.applyBefore).toLocaleDateString()
                : "N/A"}
            </p>

          </div>

        </div>


        {/* =====================================================
            CARD 3 : ABOUT COMPANY
        ===================================================== */}

        <div className="bg-[#111] border border-gray-700 rounded-xl p-6 shadow-lg">

          <h2 className="mb-3 text-xl font-semibold">
            About company
          </h2>

          <p className="text-gray-300">
            {job.companyDescription ||
              "Company description not available."}
          </p>

        </div>


        {/* =====================================================
            CARD 4 : SIMILAR JOBS
        ===================================================== */}

        <div className="bg-[#111] border border-gray-700 rounded-xl p-6 shadow-lg">

          <h2 className="mb-6 text-xl font-semibold">
            Similar Jobs
          </h2>

          <div className="flex flex-col gap-6">

            {similarJobs.length === 0 && (
              <p className="text-gray-400">
                No similar jobs found
              </p>
            )}

            {similarJobs.map((item)=> (

              <div
                key={item._id}
                onClick={()=>navigate(`/find-job/${item._id}`)}
                className="transition border border-gray-700 cursor-pointer bg-black/80 rounded-xl p-7 hover:shadow-lg hover:border-blue-500"
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

                    {/* SAVE BUTTON */}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();   // ❗ prevents card click
                      handleSaveJob(e, item);
                    }}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-400"
                  >
                    <Bookmark size={16} />
                    Save
                  </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </motion.div>

  );

};

export default JobDetails;