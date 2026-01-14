
import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';

const DepartmentHeadDashboard = () => {
    const user = JSON.parse(localStorage.getItem('admin') || '{}');

    // Mock Data
    const officerStats = [
        { name: 'Officer A', resolved: 45, pending: 5 },
        { name: 'Officer B', resolved: 30, pending: 15 },
        { name: 'Officer C', resolved: 50, pending: 2 },
    ];

    const escalations = [
        { id: 'GRV-999', officer: 'Officer B', issue: 'Sewerage Block', days: 5 },
        { id: 'GRV-888', officer: 'Officer A', issue: 'No Water', days: 3 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const handleEscalateToAdmin = (id) => {
        alert(`Forwarded Grievance ${id} to Admin (CM) with HIGH ALERT tag.`);
        // API call logic
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Department Head Dashboard</h1>
                <p className="text-gray-600">Department: {user.department || 'Public Works'}</p>
            </header>

            {/* Escalation Alerts */}
            {escalations.length > 0 && (
                <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
                    <h3 className="text-red-800 font-bold flex items-center gap-2">
                        ⚠️ High Alert Escalations ({escalations.length})
                    </h3>
                    <p className="text-sm text-red-600 mb-3">These grievances have exceeded the resolution time limit.</p>
                    <div className="space-y-2">
                        {escalations.map(e => (
                            <div key={e.id} className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                                <span><strong>{e.id}</strong> ({e.issue}) - <span className="text-gray-500">Pending {e.days} days with {e.officer}</span></span>
                                <button
                                    onClick={() => handleEscalateToAdmin(e.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-red-700"
                                >
                                    Forward to CM
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Officer Performance Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold mb-4">Officer Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={officerStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
                            <Bar dataKey="pending" fill="#ef4444" name="Pending" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Task Assignment Mock */}
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-bold mb-4">Command Center</h3>
                    <div className="space-y-4">
                        <div className="p-4 border rounded bg-gray-50">
                            <label className="block text-sm font-bold mb-1">Assign Task to Officer</label>
                            <select className="w-full p-2 border rounded mb-2">
                                <option>Select Officer...</option>
                                <option>Officer A</option>
                                <option>Officer B</option>
                            </select>
                            <textarea placeholder="Instruction message..." className="w-full p-2 border rounded mb-2"></textarea>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full font-bold">Send Command</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentHeadDashboard;
