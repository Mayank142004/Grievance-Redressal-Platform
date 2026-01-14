
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/gamification/leaderboard');
                setUsers(response.data);
            } catch (err) {
                console.error("Error fetching leaderboard", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const getRankBadge = (index) => {
        if (index === 0) return "🥇";
        if (index === 1) return "🥈";
        if (index === 2) return "🥉";
        return `#${index + 1}`;
    }

    return (
        <div className="min-h-screen bg-royal-gradient py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto"
            >
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">Hall of Fame</h2>
                    <p className="text-gray-600">Top Citizens Impacting Rajasthan</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 flex justify-between font-bold text-orange-800 text-sm uppercase tracking-wider">
                        <span>Rank</span>
                        <span>Citizen</span>
                        <span>Civic Credits</span>
                    </div>

                    {loading ? (
                        <div className="p-10 text-center">Loading...</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {users.map((user, index) => (
                                <div key={index} className="flex items-center justify-between p-6 hover:bg-orange-50/30 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="text-3xl font-bold w-12 text-center text-orange-600">
                                            {getRankBadge(index)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 text-lg">{user.name}</p>
                                            <div className="flex gap-2 mt-1">
                                                {user.badges?.map(badge => (
                                                    <span key={badge} className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200">
                                                        {badge}
                                                    </span>
                                                ))}
                                                {index < 3 && (
                                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full border border-yellow-200">
                                                        Top Contributor
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-700">
                                        {user.civic_credits}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Leaderboard;
