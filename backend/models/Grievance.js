
import { Schema, model } from 'mongoose';

const grievanceSchema = new Schema({
  name: String,
  phone: String, // Added Phone Number
  code: String,
  email: String,
  message: String,
  department: String,
  address: String,
  trackingId: { type: String, unique: true, required: true },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Processing", "Resolved", "Rejected"]
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Low',
  },
  // New Fields
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  images: [String],
  feedback: String,
  escalationLevel: { type: Number, default: 0 }, // 0: Officer, 1: Head, 2: Admin
  logs: [{
    action: String,
    by: String, // User/Admin Name or ID
    timestamp: { type: Date, default: Date.now },
    remarks: String
  }],
  createdAt: { type: Date, default: Date.now },

});

export default model('Grievance', grievanceSchema);
