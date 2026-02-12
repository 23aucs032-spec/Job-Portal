import {
  Search,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Shield,
  Clock,
  Award,
  Briefcase,
  Building2,
  LayoutDashboard,
  Plus,
} from "lucide-react";

/* ================= Job Seeker Features ================= */
export const jobSeekerFeatures = [
  {
    icon: Search,
    title: "Smart Job Matching",
    description:
      "AI-powered algorithms match you with relevant opportunities based on your skills.",
  },
  {
    icon: FileText,
    title: "Resume Builder",
    description:
      "Create professional resumes using our intuitive builder and modern templates.",
  },
  {
    icon: MessageSquare,
    title: "Direct Communication",
    description:
      "Connect directly with hiring managers and recruiters through secure messaging.",
  },
  {
    icon: Award,
    title: "Skill Assessment",
    description:
      "Showcase your skills with verified tests and earn badges employers trust.",
  },
];

/* ================= Employer Features ================= */
export const employerFeatures = [
  {
    icon: Users,
    title: "Talent Pool Access",
    description:
      "Access a large pool of pre-screened candidates and find the perfect fit.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track hiring performance with detailed analytics and engagement insights.",
  },
  {
    icon: Shield,
    title: "Verified Candidates",
    description:
      "All candidates go through verification to ensure trusted hiring.",
  },
  {
    icon: Clock,
    title: "Quick Hiring",
    description:
      "Reduce time-to-hire by up to 60% with automated screening tools.",
  },
];

/* ================= Dashboard Navigation ================= */
export const NAVIGATION_MENU = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "post-job",
    label: "Post Job",
    icon: Plus,
  },
  {
    id: "manage-jobs",
    label: "Manage Jobs",
    icon: Briefcase,
  },
  {
    id: "company-profile",
    label: "Company Profile",
    icon: Building2,
  },
];

/* ================= Filters ================= */
export const CATEGORIES = [
  { value: "Engineering", label: "Engineering" },
  { value: "Design", label: "Design" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "IT & Software", label: "IT & Software" },
  { value: "Customer-Service", label: "Customer Service" },
  { value: "Product", label: "Product" },
  { value: "Operations", label: "Operations" },
  { value: "Finance", label: "Finance" },
  { value: "HR", label: "HR" },
  { value: "Other", label: "Other" },
];

export const JOB_TYPES = [
  { value: "Remote", label: "Remote" },
  { value: "Full-Time", label: "Full-Time" },
  { value: "Part-Time", label: "Part-Time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
];

export const SALARY_RANGES = [
  "Less than $1,000",
  "$1,000 - $15,000",
  "More than $15,000",
];
