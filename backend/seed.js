
import mongoose from 'mongoose';
import Grievance from './models/Grievance.js';
import dotenv from 'dotenv';
dotenv.config();

const sampleGrievances = [
    // PENDING & OVERDUE (Should be escalated)
    {
        name: "Ramesh Kumar",
        email: "ramesh@example.com",
        message: "Serious water contamination in Sector 4 pipeline.",
        department: "Water Supply",
        trackingId: "GRV-SEED-001",
        status: "Pending",
        priority: "High",
        location: { lat: 26.9124, lng: 75.7873, address: "Sector 4, Jaipur" },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        escalationLevel: 2, // Already Admin Level
        logs: []
    },
    {
        name: "Sita Devi",
        email: "sita@example.com",
        message: "Street lights not working for a week.",
        department: "Electricity Board",
        trackingId: "GRV-SEED-002",
        status: "Pending",
        priority: "Medium",
        location: { lat: 26.2389, lng: 73.0243, address: "Main Road, Jodhpur" },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        escalationLevel: 1, // Head Level
        logs: []
    },
    // RECENT PENDING
    {
        name: "Vikram Singh",
        email: "vikram@example.com",
        message: "Potholes on highway near toll plaza.",
        department: "Public Works Department",
        trackingId: "GRV-SEED-003",
        status: "Pending",
        priority: "Medium",
        location: { lat: 24.5854, lng: 73.7125, address: "NH-8, Udaipur" },
        createdAt: new Date(), // Today
        escalationLevel: 0,
        logs: []
    },
    // RESOLVED
    {
        name: "Anita Raj",
        email: "anita@example.com",
        message: "Garbage collection missed for 2 days.",
        department: "Sanitation",
        trackingId: "GRV-SEED-004",
        status: "Resolved",
        priority: "Low",
        location: { lat: 25.2138, lng: 75.8648, address: "Kota Industrial Area" },
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        escalationLevel: 0,
        logs: [{ action: "Resolved", by: "Officer Sharma", remarks: "Vehicle sent." }]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        // Clear existing seeds only to avoid duplicates
        await Grievance.deleteMany({ trackingId: { $regex: 'GRV-SEED' } });

        await Grievance.insertMany(sampleGrievances);
        console.log("Database seeded with sample grievances!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
