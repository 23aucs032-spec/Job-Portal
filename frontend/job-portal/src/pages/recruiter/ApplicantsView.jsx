import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const ApplicationViewer = () => {

  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchApplicants = async () => {

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {

        // Fetch Job Details

        const jobRes = await fetch(
          `http://localhost:5000/api/jobs/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const jobData = await jobRes.json();

        setJob(jobData);



        // Fetch Applicants

        const res = await fetch(
          `http://localhost:5000/api/jobs/${jobId}/applicants`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setApplicants(data);


      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    fetchApplicants();

  }, [jobId, navigate]);



  if (loading)
    return (

      <div className="min-h-screen flex justify-center items-center bg-slate-950">

        <motion.h2

          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}

          className="text-cyan-400 text-xl font-semibold"
        >

          Loading Applicants...

        </motion.h2>

      </div>

    );



  return (

    <div className="min-h-screen bg-slate-950 text-white p-10">


      {/* Header */}

      <div className="flex justify-between items-center mb-10">

        <h1 className="text-3xl font-bold">
          Manage Applications
        </h1>


        <motion.button

          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}

          onClick={() => navigate("/recruiter/dashboard")}

          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-semibold"
        >

          Recruiter Dashboard

        </motion.button>

      </div>



      {/* Job Title */}

      {job && (

        <motion.h2

          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}

          className="text-xl text-cyan-400 mb-8"
        >

          Job: {job.title}

        </motion.h2>

      )}



      {/* Applicants List */}

      <div className="max-w-4xl space-y-6">


        {applicants.length === 0 ? (

          <p className="text-gray-400">
            No applicants yet
          </p>

        ) : (

          applicants.map((applicant, index) => (

            <motion.div

              key={applicant._id}

              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}

              transition={{ delay: index * 0.1 }}

              whileHover={{
                scale: 1.02
              }}

              className="bg-slate-900 border border-slate-700 p-6 rounded-xl hover:border-cyan-400 transition-all duration-300"
            >


              {/* Name */}

              <h2 className="text-xl font-semibold">

                {applicant.fullName}

              </h2>



              {/* Email */}

              <p className="text-gray-400 mb-3">

                {applicant.email}

              </p>



              {/* Mobile */}

              <p className="text-sm">

                <span className="font-semibold">
                  Mobile:
                </span>

                <span className="text-gray-300 ml-2">

                  {applicant.mobile}

                </span>

              </p>



              {/* City */}

              <p className="text-sm mb-4">

                <span className="font-semibold">
                  City:
                </span>

                <span className="text-gray-300 ml-2">

                  {applicant.city}

                </span>

              </p>



              {/* Resume Button */}

              {applicant.resume && (

                <motion.a

                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}

                  href={`http://localhost:5000/${applicant.resume}`}

                  target="_blank"

                  rel="noreferrer"

                  className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold"
                >

                  View Resume

                </motion.a>

              )}

            </motion.div>

          ))

        )}

      </div>

    </div>

  );

};


export default ApplicationViewer;
