import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";

const JobDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [applied, setApplied] = useState(false);

  const token = localStorage.getItem("token");


  /* ===============================
     FETCH JOB DETAILS
  =============================== */
  useEffect(() => {

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


        // ✅ CHECK ALREADY APPLIED
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



  /* ===============================
     APPLY FUNCTION
  =============================== */
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


      // ✅ IF ALREADY APPLIED
      if (data.message === "You already applied for this job") {

        setApplied(true);

        return;

      }


      if (!res.ok) {

        throw new Error(data.message || "Failed to apply");

      }


      setApplied(true);


      // Success message hide
      setTimeout(() => setApplied(true), 3000);


    }

    catch (err) {

      console.error(err);

      alert(err.message);

    }

  };



  /* ===============================
     LOADING & ERROR
  =============================== */

  if (loading)
    return <p className="p-10 text-white">Loading...</p>;

  if (error)
    return <p className="p-10 text-red-500">{error}</p>;

  if (!job)
    return <p className="p-10 text-white">No job found</p>;



  return (

    <div className="relative flex items-start justify-center min-h-screen p-10 text-white bg-black/80">


      {/* SUCCESS MESSAGE */}
      {applied && (

        <motion.div

          initial={{ y: -50, opacity: 0 }}

          animate={{ y: 0, opacity: 1 }}

          exit={{ y: -50, opacity: 0 }}

          className="absolute z-50 px-6 py-2 text-white transform -translate-x-1/2 bg-green-600 rounded shadow-lg top-4 left-1/2"

        >

          ✅ Applied successfully!

        </motion.div>

      )}



      <motion.div

        initial={{ opacity: 0, y: 40 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ duration: 0.6 }}

        className="flex flex-col w-full max-w-4xl gap-6 p-8 border border-gray-700 shadow-lg rounded-xl bg-black/70"

      >


        {/* DASHBOARD BUTTON */}
        <div className="absolute top-6 right-6">

          <button

            onClick={() => navigate("/jobseeker/dashboard")}

            className="px-4 py-2 font-semibold transition bg-blue-600 rounded hover:bg-blue-700"

          >

            Dashboard

          </button>

        </div>



        {/* JOB HEADER */}
        <div className="flex items-start justify-between">

          <div>

            <h1 className="mb-2 text-4xl font-bold">

              {job.title}

            </h1>

            <p className="text-lg text-gray-400">

              {job.companyName}

            </p>

            <p className="text-gray-400">

              {job.location}

            </p>

            <p className="mt-1 text-sm text-gray-500">

              Posted on:

              {" "}

              {new Date(job.createdAt).toLocaleDateString()}

            </p>

          </div>


          <div className="flex flex-col items-end gap-2">

            <img

              src={
                job.companyLogo ||

                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }

              alt="Company Logo"

              className="object-cover w-20 h-20 rounded-md"

            />

            <button className="flex items-center gap-2 mt-2 text-gray-400 hover:text-yellow-400">

              <Bookmark size={20} />

              Save

            </button>

          </div>

        </div>



        {/* JOB STATS */}
        <div className="flex flex-wrap gap-6 mt-4">

          <p>

            <span className="font-semibold">Experience:</span>

            {" "}

            {job.minExp} - {job.maxExp} yrs

          </p>


          <p>

            <span className="font-semibold">Salary:</span>

            {" "}

            ₹{job.minSalary} - ₹{job.maxSalary}

          </p>


          <p>

            <span className="font-semibold">Work Mode:</span>

            {" "}

            {job.workMode}

          </p>


          <p>

            <span className="font-semibold">Department:</span>

            {" "}

            {job.department}

          </p>


          <p>

            <span className="font-semibold">Role Category:</span>

            {" "}

            {job.roleCategory}

          </p>


          <p>

            <span className="font-semibold">Education:</span>

            {" "}

            {job.education}

          </p>


          <p>

            <span className="font-semibold">Industry:</span>

            {" "}

            {job.industry}

          </p>


          <p>

            <span className="font-semibold">Company Type:</span>

            {" "}

            {job.companyType}

          </p>


          <p>

            <span className="font-semibold">Apply Before:</span>

            {" "}

            {job.applyBefore

              ? new Date(job.applyBefore).toLocaleDateString()

              : "N/A"}

          </p>


          <p>

            <span className="font-semibold">Contact Email:</span>

            {" "}

            {job.contactEmail}

          </p>

        </div>



        {/* SKILLS */}
        {job.skills?.length > 0 && (

          <div>

            <h2 className="mb-2 text-2xl font-semibold">

              Skills Required

            </h2>


            <div className="flex flex-wrap gap-2">

              {job.skills.map((skill, idx) => (

                <span

                  key={idx}

                  className="px-3 py-1 text-sm bg-gray-800 rounded"

                >

                  {skill}

                </span>

              ))}

            </div>

          </div>

        )}



        {/* JOB DESCRIPTION */}
        <div>

          <h2 className="mb-2 text-2xl font-semibold">

            Job Description

          </h2>


          <p className="text-gray-300 whitespace-pre-line">

            {job.jobDescription}

          </p>

        </div>



        {/* RESPONSIBILITIES */}
        {job.responsibilities?.length > 0 && (

          <div>

            <h2 className="mb-2 text-2xl font-semibold">

              Responsibilities

            </h2>


            <ul className="space-y-1 text-gray-300 list-disc list-inside">

              {job.responsibilities.map((item, idx) => (

                <li key={idx}>{item}</li>

              ))}

            </ul>

          </div>

        )}



        {/* APPLY BUTTON */}
        <div className="flex flex-col items-start gap-2 mt-6">


          {applied ? (

            <button

              disabled

              className="px-6 py-3 font-semibold bg-gray-500 rounded"

            >

              ✅ Already Applied

            </button>

          ) : (

            <button

              onClick={handleApply}

              className="px-6 py-3 font-semibold transition bg-green-600 rounded hover:bg-green-700"

            >

              Apply Now

            </button>

          )}


        </div>


      </motion.div>


    </div>

  );

};

export default JobDetails;
