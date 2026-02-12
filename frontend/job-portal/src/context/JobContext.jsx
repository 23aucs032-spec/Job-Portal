import { createContext, useContext, useState } from "react";

const JobContext = createContext(null);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Frontend Developer",
      company: "DCE",
      location: "Chennai",
      experience: "1-3 Years",
    },
    {
      id: 2,
      title: "Backend Developer",
      company: "TechCorp",
      location: "Bangalore",
      experience: "2-4 Years",
    },
  ]);

  return (
    <JobContext.Provider value={{ jobs, setJobs }}>
      {children}
    </JobContext.Provider>
  );
};

// ✅ SAFE fallback hook (no crash)
// eslint-disable-next-line react-refresh/only-export-components
export const useJobs = () => {
  return useContext(JobContext) || { jobs: [], setJobs: () => {} };
};
