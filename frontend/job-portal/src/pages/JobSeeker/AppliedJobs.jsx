import { useJobs } from "../../context/JobContext";
import { useNavigate } from "react-router-dom";

const AppliedJobs = () => {
  const { jobs } = useJobs(); // ✅ now safe
  const navigate = useNavigate();

  if (!jobs || jobs.length === 0) {
    return <p>No jobs available</p>;
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">
        Recommended Jobs
      </h2>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() =>
              navigate(`/dashboard/jobseeker/job/${job.id}`)
            }
            className="p-5 bg-white border rounded-lg cursor-pointer hover:shadow-md"
          >
            <h3 className="text-lg font-semibold text-blue-600">
              {job.title}
            </h3>

            <p className="text-sm text-gray-600">
              {job.company} • {job.location}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Experience: {job.experience}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppliedJobs;
