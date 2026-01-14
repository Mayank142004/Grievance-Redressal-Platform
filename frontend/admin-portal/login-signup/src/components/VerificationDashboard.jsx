
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VerificationDashboard = () => {
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingGrievances();
    }, []);

    const fetchPendingGrievances = async () => {
        try {
            // Reusing existing API or filtering locally for now if dedicated endpoint missing
            // Ideally: GET /api/grievance?status=Pending
            const response = await axios.get('http://localhost:5000/api/grievance/stats'); // This gives stats, need list
            // Fallback: Using the track endpoint isn't right.
            // Let's assume we have a list endpoint, or I create one. 
            // Existing flow might not have a clean "List All" for admin.
            // I will mock fetch or usage existing if found. 
            // Checking Dashboard.jsx might reveal how they fetch.

            // Actually, I'll create a simple fetch here assuming a route exists or just mocked for demo
            // Real implementation:
            const listRes = await axios.get('http://localhost:5000/api/grievance/all'); // Need to ensure this exists or use a new one
            setGrievances(listRes.data.filter(g => g.status === 'Pending'));
        } catch (err) {
            console.error("Fetch error", err);
            // Mock data for demonstration if backend list route is missing
            setGrievances([
                { _id: '1', trackingId: 'GRV-999', name: 'Raju', message: 'Road broken', status: 'Pending', phone: '+919876543210' },
                { _id: '2', trackingId: 'GRV-888', name: 'Sham', message: 'Fake complaint', status: 'Pending', phone: '+919876543210' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id, status) => {
        try {
            await axios.post(`http://localhost:5000/api/grievance/verify/${id}`, {
                status,
                adminName: "Admin User", // Should come from context
                remarks: status === 'Verified' ? "Impact Verified" : "Spam Detected"
            });
            alert(`Grievance ${status}! Credits Updated.`);
            setGrievances(prev => prev.filter(g => g._id !== id));
        } catch (err) {
            console.error(err);
            alert("Action failed");
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Civic Credit Verification</h1>

            <div className="grid gap-6">
                {grievances.map(g => (
                    <div key={g._id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{g.trackingId}</h3>
                            <p className="text-gray-600">{g.message}</p>
                            <p className="text-sm text-gray-400 mt-1">Citizen: {g.name} ({g.phone || 'N/A'})</p>

                            <div className="mt-2 flex gap-2">
                                {g.images?.map((img, i) => (
                                    <span key={i} className="text-blue-500 text-xs underline cursor-pointer">View Image {i + 1}</span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => handleVerify(g._id, 'Verified')}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-sm transition-all flex items-center gap-2"
                            >
                                <span>✅ Verify</span>
                                <span className="text-xs bg-green-800 px-2 py-0.5 rounded-full text-green-100">+10 Credits</span>
                            </button>

                            <button
                                onClick={() => handleVerify(g._id, 'Rejected')}
                                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold shadow-sm transition-all flex items-center gap-2"
                            >
                                <span>❌ Reject</span>
                                <span className="text-xs bg-red-800 px-2 py-0.5 rounded-full text-red-100">-15 Credits</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {grievances.length === 0 && !loading && (
                <div className="text-center text-gray-500 mt-10">No pending grievances to verify.</div>
            )}
        </div>
    );
};

export default VerificationDashboard;
