import { NavLink } from "react-router-dom";
import { User, Users, Briefcase, Home } from "lucide-react";

const AdminSidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition ${
      isActive ? "bg-cyan-600" : ""
    }`;

  return (
    <div className="w-64 h-screen bg-black text-white p-6 fixed flex flex-col">
      <h1 className="text-2xl font-bold mb-10">Admin Panel</h1>
      <nav className="flex flex-col gap-3">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <Home size={18} /> Dashboard
        </NavLink>
        <NavLink to="/admin/users" className={linkClass}>
          <Users size={18} /> Users
        </NavLink>
        <NavLink to="/admin/recruiters" className={linkClass}>
          <User size={18} /> Recruiters
        </NavLink>
        <NavLink to="/admin/jobs" className={linkClass}>
          <Briefcase size={18} /> Jobs
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;