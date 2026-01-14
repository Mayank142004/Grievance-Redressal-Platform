
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const OfficerDashboard = () => {
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('admin') || '{}');

    // Simulate Backend Call (Replace with actual API)
    useEffect(() => {
        // Mock Data for Demo - In real app fetch from /api/grievance?department=...
        setTimeout(() => {
            setGrievances([
                { id: 'GRV-001', desc: 'Water leakage', loc: 'Sec 4', status: 'Pending', daysPending: 1, user: 'HIDDEN' },
                { id: 'GRV-002', desc: 'Street light broken', loc: 'Main Road', status: 'Pending', daysPending: 3, user: 'HIDDEN' },
                { id: 'GRV-003', desc: 'Garbage dump', loc: 'Market Area', status: 'Resolved', daysPending: 0, user: 'HIDDEN' },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleSolve = (id) => {
        // API call to solve
        const updated = grievances.map(g => g.id === id ? { ...g, status: 'Resolved' } : g);
        setGrievances(updated);
        console.log(`Solved ${id}`);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Officer Dashboard</h1>
                <p className="text-gray-600">Department: {user.department || 'General'}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                    <h3>Pending Tasks</h3>
                    <p className="text-4xl font-bold">{grievances.filter(g => g.status === 'Pending').length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                    <h3>Resolved</h3>
                    <p className="text-4xl font-bold">{grievances.filter(g => g.status === 'Resolved').length}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <h2 className="p-6 bg-gray-100 font-bold border-b">Assigned Grievances</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-4 border-b">Tracking ID</th>
                                <th className="p-4 border-b">Description</th>
                                <th className="p-4 border-b">Location</th>
                                <th className="p-4 border-b">Status</th>
                                <th className="p-4 border-b">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grievances.map(g => (
                                <tr key={g.id} className="hover:bg-gray-50">
                                    <td className="p-4 border-b font-mono">{g.id}</td>
                                    <td className="p-4 border-b">{g.desc}</td>
                                    <td className="p-4 border-b">{g.loc}</td>
                                    <td className="p-4 border-b">
                                        <span className={`px-2 py-1 rounded text-xs font-bold 
                                            ${g.status === 'Pending' ? (g.daysPending > 2 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800') : 'bg-green-100 text-green-800'}`}>
                                            {g.status} {g.daysPending > 2 && '⚠️ (Escalated)'}
                                        </span>
                                    </td>
                                    <td className="p-4 border-b">
                                        {g.status === 'Pending' && (
                                            <button
                                                onClick={() => handleSolve(g.id)}
                                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                                            >
                                                Mark Resolved
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">* Note: Citizen personal details are hidden for privacy.</p>
        </div>
    );
};

export default OfficerDashboard;
