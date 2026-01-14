
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Wallet = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [phone, setPhone] = useState(localStorage.getItem('userPhone') || '');

    useEffect(() => {
        // In a real app, phone comes from Auth Context. For now, reading from localStorage or prompt
        // Assuming Login.jsx saves 'userPhone'
        if (!phone) return;

        const fetchWallet = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/gamification/wallet/${phone}`);
                setUserData(response.data);
            } catch (err) {
                console.error("Error fetching wallet", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWallet();
    }, [phone]);

    if (!phone) return <div className="p-10 text-center text-gray-500">Please Login to view your wallet.</div>;
    if (loading) return <div className="p-10 text-center">Loading Wallet...</div>;

    return (
        <div className="min-h-screen bg-royal-gradient py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                {/* Credit Card Design */}
                <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white shadow-2xl mb-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-xl font-light opacity-90">Civic Credit Balance</h3>
                                <h1 className="text-6xl font-bold mt-2">{userData?.credits || 0}</h1>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold bg-white text-orange-600 px-3 py-1 rounded-full uppercase tracking-wider">
                                    Reputation: {userData?.reputation || 100}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-sm opacity-75 uppercase tracking-widest mb-1">Card Holder</p>
                                <p className="text-xl font-medium tracking-wide">Citizen {phone.slice(-4)}</p>
                            </div>
                            <div className="text-3xl">🛡️</div>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <h3 className="text-2xl font-bold text-gray-800 mb-6 px-2">Transaction History</h3>
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                    {userData?.history?.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {userData.history.map((tx) => (
                                <div key={tx._id} className="p-6 flex justify-between items-center hover:bg-orange-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl
                                            ${tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {tx.amount > 0 ? '↓' : '↑'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{tx.reason}</p>
                                            <p className="text-sm text-gray-500">{new Date(tx.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className={`font-bold text-xl ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 text-center text-gray-400">No transactions yet. Start submitting legitimate grievances!</div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Wallet;
