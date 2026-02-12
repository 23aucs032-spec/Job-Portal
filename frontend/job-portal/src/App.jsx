/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import LoadingScreen from "./pages/LandingPage/components/LoadingScreen";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";

// Job Seeker Pages
import JobSeekerDashboard from "./pages/JobSeeker/JobSeekerDashboard";
import AppliedJobs from "./pages/JobSeeker/AppliedJobs";
import JobDetails from "./pages/JobSeeker/JobDetails";
import SavedJobs from "./pages/JobSeeker/SavedJobs";
import UserProfile from "./pages/JobSeeker/UserProfile";

// Employer Pages
import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import JobPostingForm from "./pages/recruiter/JobPostingForm";
import ManageJobs from "./pages/Employer/ManageJobs";
import ApplicationViewer from "./pages/Employer/ApplicationViewer";
import EmployerProfilePage from "./pages/Employer/EmployerProfilePage";
import RegisterStep1 from "./pages/recruiter/RegisterStep1";
import RegisterStep2 from "./pages/recruiter/RegisterStep2";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterLogin from "./pages/recruiter/RecruiterLogin";
import JobListPage from "./pages/JobSeeker/JobListPage";

// Protected Route
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasSeenLoader = sessionStorage.getItem("hasSeenLoader");
    if (hasSeenLoader === "true") {
      setLoading(false);
    }
  }, []);

  const handleFinish = () => {
    sessionStorage.setItem("hasSeenLoader", "true");
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen onFinish={handleFinish} />;
  }

  return (
    <>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* ================= JOB SEEKER ================= */}
        <Route element={<ProtectedRoute requireRoles="jobseeker" />}>
          <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard />}>
            <Route index element={<AppliedJobs />} />
            <Route path="applied-jobs" element={<AppliedJobs />} />
            <Route path="saved-jobs" element={<SavedJobs />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="job/:jobId" element={<JobDetails />} />
            
          </Route>
        </Route>

        {/* ================= EMPLOYER ================= */}
        <Route element={<ProtectedRoute requireRoles="employer" />}>
          <Route
            path="/employer/dashboard"
            element={<EmployerDashboard />}
          />
          
          <Route path="/manage-jobs" element={<ManageJobs />} />
          <Route path="/applicants" element={<ApplicationViewer />} />


          <Route path="/jobs" element={<JobListPage />} />
          
          <Route
            path="/company-profile"
            element={<EmployerProfilePage />}
          />
        </Route>

        <Route path="/recruiter/login" element={<RecruiterLogin />} />  
        <Route path="/recruiter/register" element={<RegisterStep1 />} />
        <Route path="/recruiter/register-step2" element={<RegisterStep2 />} />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
        <Route path="/post-job" element={<JobPostingForm />} />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{ style: { fontSize: "13px" } }}
      />
    </>
  );
};

export default App;
