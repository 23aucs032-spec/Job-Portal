import { useParams } from "react-router-dom";
import { useJobs } from "../../context/JobContext";

const JobDetails = () => {
  const { jobId } = useParams();
  const { jobs } = useJobs();

  const job = jobs.find((j) => j.id === Number(jobId));
  if (!job) return <p>Job not found</p>;

  return (
    <div className="max-w-4xl p-6 bg-white border rounded-lg">
      <h1 className="text-2xl font-semibold text-blue-600">
        {job.title}
      </h1>

      <p className="mt-1 text-gray-600">
        {job.company} • {job.location}
      </p>

      <div className="mt-4">
        <h3 className="mb-1 font-semibold">Job Description</h3>
        <p className="text-sm text-gray-700">
          {job.description}
        </p>
      </div>

      <div className="mt-4">
        <h3 className="mb-1 font-semibold">Key Skills</h3>
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-xs text-blue-600 rounded-full bg-blue-50"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <button className="px-6 py-2 mt-6 text-white bg-blue-600 rounded hover:bg-blue-700">
        Apply Now
      </button>
    </div>
  );
};

export default JobDetails;
