/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import LoadingScreen from "./pages/LandingPage/components/LoadingScreen";
import LandingPage from "./pages/LandingPage/LandingPage";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";
import FindJobs from "./pages/LandingPage/components/FindJobs";
import FindJobDetails from "./pages/LandingPage/components/FindJobDetails";

// Job Seeker Pages
import JobSeekerDashboard from "./pages/JobSeeker/JobSeekerDashboard";
import AppliedJobs from "./pages/JobSeeker/AppliedJobs";
import JobDetails from "./pages/JobSeeker/JobDetails";
import SavedJobs from "./components/ProfilePage/SavedJobs";
import Profile from "./components/ProfilePage/UserProfile";

// Employer Pages
import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import JobPostingForm from "./pages/recruiter/JobPostingForm";
import ManageJobs from "./pages/recruiter/ManageJobs";
import EditJob from "./pages/recruiter/EditJob";
import ApplicationViewer from "./pages/recruiter/ApplicantsView";
import AllApplicants from "./pages/recruiter/AllApplicants";
import RegisterStep1 from "./pages/recruiter/RegisterStep1";
import RegisterStep2 from "./pages/recruiter/RegisterStep2";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterLogin from "./pages/recruiter/RecruiterLogin";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";

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

        {/* ================= FIND JOBS ================= */}
        <Route path="/find-jobs" element={<FindJobs />} />
        <Route path="/find-job/:id" element={<FindJobDetails />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* ================= JOB SEEKER ROUTES ================= */}
        <Route element={<ProtectedRoute requireRole="jobseeker" />}>
          <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard />} />
          <Route path="/applied-jobs" element={<AppliedJobs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
        </Route>

        {/* ================= EMPLOYER ROUTES ================= */}
        <Route element={<ProtectedRoute requireRole="employer" />}>
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/manage-jobs" element={<ManageJobs />} />
        </Route>

        {/* ================= RECRUITER PUBLIC ROUTES ================= */}
        <Route path="/recruiter/login" element={<RecruiterLogin />} />
        <Route path="/recruiter/register" element={<RegisterStep1 />} />
        <Route path="/recruiter/register-step2" element={<RegisterStep2 />} />

        {/* ================= RECRUITER PROTECTED ROUTES ================= */}
        <Route element={<ProtectedRoute requireRole="recruiter" />}>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/profile" element={<RecruiterProfile />} />
          <Route path="/post-job" element={<JobPostingForm />} />
          <Route path="/edit-job/:id" element={<EditJob />} />
          <Route path="/manage-jobs" element={<ManageJobs />} />
          <Route path="/applicants/:jobId" element={<ApplicationViewer />} />
          <Route
            path="/applicants/:jobId/all"
            element={<AllApplicants />}
          />
        </Route>

        {/* ================= FALLBACK ROUTE ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "13px",
          },
        }}
      />
    </>
  );
};

export default App;