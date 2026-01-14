
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import MapDashboard from "./MapDashboard";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 125, resolved: 80, pending: 40, critical: 5 });
  const [user, setUser] = useState({ name: 'Administrator' });

  useEffect(() => {
    // In a real app, verify Admin role here
    const savedUser = JSON.parse(localStorage.getItem('admin') || '{}');
    if (savedUser) setUser(savedUser);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-6 relative">
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-900">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Chief Minister's Dashboard</h1>
          <p className="text-gray-500 text-sm">State-wide Grievance Oversight • Rajasthan</p>
        </div>
        <div className="flex gap-4">
          <Link to="/admin/dashboard/Grievances" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Manage All Grievances
          </Link>
          <Link to="/admin/dashboard/announcements" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition">
            Announcements
          </Link>
          <Link to="/admin/dashboard/verification" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
            Verify & Reward
          </Link>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </header>

      <div className="space-y-6">
        {/* Interactive Map */}
        <section className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Grievance Density Map</h2>
          <MapDashboard />
        </section>

        {/* Global Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border-blue-500 border-t-4">
            <h3 className="text-gray-500 font-semibold">Total Grievances</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-xs text-green-500 mt-2">▲ 12% from last month</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-green-500 border-t-4">
            <h3 className="text-gray-500 font-semibold">Resolved</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.resolved}</p>
            <p className="text-xs text-gray-400 mt-2">64% Resolution Rate</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-yellow-500 border-t-4">
            <h3 className="text-gray-500 font-semibold">Pending</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
            <p className="text-xs text-yellow-600 mt-2">Requires Attention</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-red-500 border-t-4">
            <h3 className="text-gray-500 font-semibold">Critical Escalations</h3>
            <p className="text-3xl font-bold text-red-600">{stats.critical}</p>
            <p className="text-xs text-red-400 mt-2">Exceeded SLA (48hrs)</p>
          </div>
        </section>

        {/* Unsolved / Escalated Problems Table */}
        <section className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <span className="bg-red-100 p-1 rounded">⚠️</span> Pending Escalations
            <span className="text-sm font-normal text-gray-500 ml-2">(Not resolved by Departments)</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 border-b">ID</th>
                  <th className="p-3 border-b">Issue</th>
                  <th className="p-3 border-b">Department</th>
                  <th className="p-3 border-b">Pending Days</th>
                  <th className="p-3 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 text-red-600 font-bold">GRV-999</td>
                  <td className="p-3">Sewerage Block - Main Market</td>
                  <td className="p-3">Public Works</td>
                  <td className="p-3 font-bold">5 Days</td>
                  <td className="p-3">
                    <button className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-black">Issue Show Cause</button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 text-red-600 font-bold">GRV-888</td>
                  <td className="p-3">No Water Supply - Sector 8</td>
                  <td className="p-3">Water Board</td>
                  <td className="p-3 font-bold">3 Days</td>
                  <td className="p-3">
                    <button className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-black">Issue Show Cause</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
