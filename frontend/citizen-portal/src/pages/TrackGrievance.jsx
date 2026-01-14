
import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const TrackGrievance = () => {
  const [trackingId, setTrackingId] = useState('');
  const [grievance, setGrievance] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGrievance(null);

    try {
      const response = await axios.get(`http://localhost:5000/api/grievance/track/${trackingId}`);
      setGrievance(response.data);
    } catch (err) {
      setError('Grievance not found or invalid Tracking ID');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-royal-gradient py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Track Your Grievance</h2>
          <div className="h-1 w-24 bg-orange-500 mx-auto rounded-full"></div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-orange-100 mb-8">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter Tracking ID (e.g., GRV-123456)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1 bg-gray-50 text-gray-800 rounded-xl p-4 border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg transform active:scale-95"
            >
              {loading ? 'Searching...' : 'Track Status'}
            </button>
          </form>
          {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-center font-medium border border-red-100">{error}</div>}
        </div>

        {grievance && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-2xl shadow-xl border-l-8 border-l-orange-500 relative overflow-hidden"
          >
            {/* Watermark */}
            <div className="absolute top-0 right-0 text-9xl text-gray-50 opacity-10 pointer-events-none font-black">
              RAJ
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start mb-8 relative z-10">
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{grievance.trackingId}</h3>
                <p className="text-gray-500 text-sm font-medium">Submitted on: {new Date(grievance.createdAt).toLocaleDateString()}</p>
              </div>
              <div className={`mt-4 md:mt-0 px-6 py-2 rounded-full font-bold text-sm shadow-sm
                ${grievance.status === 'Resolved' ? 'bg-green-100 text-green-700 border border-green-200' :
                  grievance.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-red-100 text-red-700 border border-red-200'}`}
              >
                {grievance.status.toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 relative z-10">
              <div className="bg-orange-50/50 p-4 rounded-xl">
                <span className="block text-orange-800 text-xs uppercase tracking-wider font-bold mb-1">Department</span>
                <span className="text-xl font-semibold text-gray-900">{grievance.department}</span>
              </div>
              <div className="bg-orange-50/50 p-4 rounded-xl">
                <span className="block text-orange-800 text-xs uppercase tracking-wider font-bold mb-1">Location</span>
                <span className="text-xl font-semibold text-gray-900">{grievance.location?.address || "Coordinates recorded"}</span>
              </div>
              <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <span className="block text-gray-500 text-xs uppercase tracking-wider font-bold mb-2">Description</span>
                <p className="text-lg leading-relaxed">{grievance.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TrackGrievance;
