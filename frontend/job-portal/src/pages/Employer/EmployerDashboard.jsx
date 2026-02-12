import React from "react";
import {
  Users,
  Briefcase,
  PlusCircle,
  Building
} from "lucide-react";

const EmployerDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Employer Dashboard 🏢
        </h1>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <PlusCircle size={18} />
          Post New Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Jobs Posted"
          value="8"
          icon={<Briefcase />}
          color="bg-indigo-600"
        />
        <DashboardCard
          title="Total Applicants"
          value="124"
          icon={<Users />}
          color="bg-green-600"
        />
        <DashboardCard
          title="Active Jobs"
          value="5"
          icon={<Briefcase />}
          color="bg-blue-600"
        />
        <DashboardCard
          title="Company Profile"
          value="Completed"
          icon={<Building />}
          color="bg-orange-600"
        />
      </div>

      {/* Applicants */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Recent Applicants
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2">Candidate</th>
              <th>Position</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="py-3">Karthik P</td>
              <td>Frontend Developer</td>
              <td className="text-blue-600 font-medium">
                New
              </td>
            </tr>
            <tr className="border-t">
              <td className="py-3">Rahul S</td>
              <td>Backend Developer</td>
              <td className="text-green-600 font-medium">
                Interview Scheduled
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
    <div className={`p-3 rounded-full text-white ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  </div>
);

export default EmployerDashboard;
