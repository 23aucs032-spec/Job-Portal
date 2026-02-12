import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Building2,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContent";
import { NAVIGATION_MENU } from "../../pages/utils/data";

const DashboardLayout = ({ activeMenu = "dashboard", children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState(activeMenu);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sidebarCollapsed = false;

  // ✅ FIX: toggleSidebar was missing
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  /* ---------------- Responsive ---------------- */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------------- Click outside ---------------- */
  useEffect(() => {
    const handleClickOutside = () => {
      if (profileDropdownOpen) setProfileDropdownOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileDropdownOpen]);

  /* ---------------- Navigation ---------------- */
  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300
        ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        }
        ${sidebarCollapsed ? "w-16" : "w-64"}
        bg-white border-r border-gray-200`}
      >
        {/* Logo */}
        <div className="flex items-center h-16 border-b border-gray-200 pl-6">
          {!sidebarCollapsed ? (
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">JobPortal</span>
            </Link>
          ) : (
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {NAVIGATION_MENU.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition
                ${
                  activeNavItem === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <item.icon className="h-5 w-5" />
              {!sidebarCollapsed && (
                <span className="ml-3">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={logout}
            className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5" />
            {!sidebarCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Top Navbar */}
        <header className="bg-white border-b p-4 flex items-center gap-4">
          {isMobile && (
            <button onClick={toggleSidebar}>
              {sidebarOpen ? <X /> : <Menu />}
            </button>
          )}
          <div>
            <h1 className="font-semibold">Welcome back!</h1>
            <p className="text-sm text-gray-500">
              Here's what's happening with you today.
            </p>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
