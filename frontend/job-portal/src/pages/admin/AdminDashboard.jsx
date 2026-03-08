/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, recruiters: 0, jobs: 0 });
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, [token]);

  const chartData = [
    { name: "Users", count: stats.users },
    { name: "Recruiters", count: stats.recruiters },
    { name: "Jobs", count: stats.jobs },
  ];

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 p-10 w-full text-white">
        <h2 className="text-3xl mb-6 font-bold">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center"
          >
            <h3 className="text-xl mb-2">Users</h3>
            <p className="text-3xl font-bold">{stats.users}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center"
          >
            <h3 className="text-xl mb-2">Recruiters</h3>
            <p className="text-3xl font-bold">{stats.recruiters}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center"
          >
            <h3 className="text-xl mb-2">Jobs</h3>
            <p className="text-3xl font-bold">{stats.jobs}</p>
          </motion.div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl mb-4 font-semibold">Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="count" fill="#06b6d4" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;