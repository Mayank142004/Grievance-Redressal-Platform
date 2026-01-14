
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CitizenDashboard = () => {
    // Mock data - replace with API call
    const [stats, setStats] = useState({
        total: 0,
        resolved: 0,
        pending: 0
    });

    useEffect(() => {
        // Fetch stats for the logged-in user
        // For now, using dummy data
        setStats({ total: 5, resolved: 2, pending: 3 });
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 text-white">
            <h2 className="text-3xl font-bold mb-8 text-center text-yellow-500">My Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-800 p-6 rounded-xl border-l-4 border-blue-500 shadow-lg"
                >
                    <h3 className="text-xl text-gray-400 mb-2">Total Submitted</h3>
                    <p className="text-4xl font-bold text-white">{stats.total}</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-800 p-6 rounded-xl border-l-4 border-green-500 shadow-lg"
                >
                    <h3 className="text-xl text-gray-400 mb-2">Resolved</h3>
                    <p className="text-4xl font-bold text-green-400">{stats.resolved}</p>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-800 p-6 rounded-xl border-l-4 border-yellow-500 shadow-lg"
                >
                    <h3 className="text-xl text-gray-400 mb-2">Pending</h3>
                    <p className="text-4xl font-bold text-yellow-400">{stats.pending}</p>
                </motion.div>
            </div>

            <div className="flex justify-center gap-6">
                <Link to="/submit">
                    <button className="bg-gradient-to-r from-yellow-600 to-yellow-800 px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all transform hover:-translate-y-1">
                        Submit New Grievance
                    </button>
                </Link>
                <Link to="/track">
                    <button className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all transform hover:-translate-y-1">
                        Track Status
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default CitizenDashboard;
