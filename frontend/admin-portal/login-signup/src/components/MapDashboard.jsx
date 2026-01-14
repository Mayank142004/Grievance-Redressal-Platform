
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const MapDashboard = () => {
    const [grievances, setGrievances] = useState([]);

    // Mock District Data (Lat/Lng) - In real app, use GeoJSON for Rajasthan Districts
    const districts = [
        { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
        { name: 'Jodhpur', lat: 26.2389, lng: 73.0243 },
        { name: 'Udaipur', lat: 24.5854, lng: 73.7125 },
        { name: 'Kota', lat: 25.2138, lng: 75.8648 },
        { name: 'Ajmer', lat: 26.4499, lng: 74.6399 },
        { name: 'Bikaner', lat: 28.0229, lng: 73.3119 }
    ];

    useEffect(() => {
        // Fetch stats logic would go here
        // For now, mocking random counts
    }, []);

    return (
        <div className="h-[500px] w-full bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700 relative z-0">
            <div className="absolute top-4 right-4 z-[500] bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-600">
                <h3 className="text-white font-bold mb-2">District Stats</h3>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-300 text-sm">High Grievances</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-300 text-sm">Low Grievances</span>
                </div>
            </div>

            <MapContainer center={[26.5, 74.0]} zoom={6} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {districts.map((district) => {
                    const count = Math.floor(Math.random() * 50); // Mock count
                    const color = count > 30 ? 'red' : count > 10 ? 'yellow' : 'green';

                    return (
                        <CircleMarker
                            key={district.name}
                            center={[district.lat, district.lng]}
                            radius={20 + (count / 2)}
                            pathOptions={{ color: color, fillColor: color, fillOpacity: 0.6 }}
                        >
                            <Popup>
                                <div className="p-2 text-center">
                                    <h3 className="font-bold text-lg">{district.name}</h3>
                                    <p>Total Grievances: {count}</p>
                                    <p>Resolved: {Math.floor(count * 0.6)}</p>
                                    <p>Pending: {count - Math.floor(count * 0.6)}</p>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapDashboard;
