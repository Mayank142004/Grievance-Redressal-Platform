import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import './index.css';
import Dashboard from "./components/Dashboard"; // This will be the Admin Dashboard
import DepartmentOfficerDashboard from "./components/DepartmentOfficerDashboard";
import DepartmentHeadDashboard from "./components/DepartmentHeadDashboard";
import GrievanceDashboard from "./components/GrievancesDashboard";
import Announcements from "./components/Announcements";
import VerificationDashboard from "./components/VerificationDashboard";

function App() {
  const [isAuthenticated, setAuthenticated] = useState(false);

  return (
    <>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/admin/login" element={<Login setAuthenticated={setAuthenticated} />} />
        <Route path="/admin/signup" element={<Signup />} />

        {/* Role-based Dashboards */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/dashboard/officer" element={<DepartmentOfficerDashboard />} />
        <Route path="/admin/dashboard/head" element={<DepartmentHeadDashboard />} />
        <Route path="/admin/dashboard/verification" element={<VerificationDashboard />} />

        <Route path="/admin/dashboard/Grievances" element={<GrievanceDashboard />} />
        <Route path="/admin/dashboard/announcements" element={<Announcements />} />
      </Routes>
    </>
  );
}
export default App;