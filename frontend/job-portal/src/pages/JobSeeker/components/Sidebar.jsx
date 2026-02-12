import { Briefcase, Bookmark, User, LogOut } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r min-h-screen p-5">
      <h2 className="text-xl font-bold text-blue-600 mb-8">
        JobPortal
      </h2>

      <nav className="space-y-4 text-sm">
        <SidebarItem icon={<Briefcase size={18} />} label="Dashboard" />
        <SidebarItem icon={<Bookmark size={18} />} label="Saved Jobs" />
        <SidebarItem icon={<User size={18} />} label="Profile" />
        <SidebarItem icon={<LogOut size={18} />} label="Logout" />
      </nav>
    </div>
  );
};

const SidebarItem = ({ icon, label }) => (
  <div className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100">
    {icon}
    <span>{label}</span>
  </div>
);

export default Sidebar;
