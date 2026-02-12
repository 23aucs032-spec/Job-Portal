import React from "react";
import { MapPin, Briefcase, IndianRupee, Bookmark } from "lucide-react";

const JobListPage = () => {
  const jobs = [
    {
      id: 1,
      title: "Web Development Trainee",
      company: "Qadir IT Services",
      experience: "0-1 Yrs",
      location: "Chennai",
      salary: "2-3 LPA",
      skills: ["HTML", "CSS", "JavaScript", "React"],
      posted: "3 weeks ago",
    },
    {
      id: 2,
      title: "React JS Developer",
      company: "Posguru",
      experience: "0-2 Yrs",
      location: "Chennai",
      salary: "3-5 LPA",
      skills: ["React", "Redux", "Bootstrap"],
      posted: "1 day ago",
    },
    {
      id: 3,
      title: "PHP Developer",
      company: "Maxester",
      experience: "0-2 Yrs",
      location: "Faridabad",
      salary: "2-4 LPA",
      skills: ["PHP", "WordPress", "MySQL"],
      posted: "3 weeks ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-6 px-6">
      <div className="max-w-7xl mx-auto flex gap-6">

        {/* ================= LEFT FILTER SIDEBAR ================= */}
        <div className="w-1/4 bg-white p-5 rounded-xl shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4">All Filters</h2>

          {/* Experience */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Experience</h3>
            <input type="range" min="0" max="10" className="w-full" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>0 Yrs</span>
              <span>10 Yrs</span>
            </div>
          </div>

          {/* Work Mode */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Work Mode</h3>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Work from Office
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remote
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Hybrid
              </label>
            </div>
          </div>

          {/* Salary */}
          <div>
            <h3 className="font-medium mb-2">Salary</h3>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                0-3 Lakhs
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                3-6 Lakhs
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                6-10 Lakhs
              </label>
            </div>
          </div>
        </div>

        {/* ================= RIGHT JOB LIST ================= */}
        <div className="w-3/4 space-y-4">

          {/* Top Info */}
          <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
            <p className="text-sm text-gray-600">
              1 - 20 of 100 Web Developer Jobs
            </p>
            <select className="border rounded-md px-3 py-1 text-sm">
              <option>Sort by: Relevance</option>
              <option>Newest</option>
              <option>Salary High to Low</option>
            </select>
          </div>

          {/* Job Cards */}
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">

                {/* Job Info */}
                <div>
                  <h2 className="text-lg font-semibold text-blue-600">
                    {job.title}
                  </h2>

                  <p className="text-gray-700 font-medium">
                    {job.company}
                  </p>

                  {/* Experience + Location + Salary */}
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Briefcase size={16} />
                      {job.experience}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <IndianRupee size={16} />
                      {job.salary}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-sm px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-gray-400 mt-3">
                    Posted {job.posted}
                  </p>
                </div>

                {/* Save Button */}
                <button className="text-gray-500 hover:text-blue-600">
                  <Bookmark />
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default JobListPage;
