import express from 'express';
const router = express.Router();
import Grievance from '../models/Grievance.js';
import User from '../models/User.js';
import CreditTransaction from '../models/CreditTransaction.js';
import axios from "axios";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const generateTrackingId = () => {
  const prefix = 'GRV';
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${random}`;
};

const classifyGrievancePriority = async (message) => {
  try {
    const response = await axios.post("http://localhost:5002/classify-priority", { message });
    return response.data.priority || "Low";
  } catch (error) {
    console.error("Priority classification failed:", error.message);
    return "Low";
  }
};


router.post('/submit', upload.array('images', 3), async (req, res) => {
  try {
    const { name, email, message, department, address, code, location } = req.body;
    let locationData = location;

    // Parse location if it comes as string (multipart/form-data often sends JSON as string)
    if (typeof location === 'string') {
      try {
        locationData = JSON.parse(location);
      } catch (e) { }
    }

    const trackingId = generateTrackingId();
    const priority = await classifyGrievancePriority(message);

    const imagePaths = req.files ? req.files.map(file => file.path) : [];

    // Link to User if phone exists
    let userId = null;
    if (req.body.phone) {
      const user = await User.findOne({ phone: req.body.phone });
      if (user) userId = user._id;
    }

    const grievance = new Grievance({
      name,
      phone: req.body.phone,
      email,
      message,
      department,
      trackingId,
      status: "Pending",
      address,
      priority,
      code,
      location: locationData,
      images: imagePaths,
      logs: [{ action: "Submitted", by: "Citizen", remarks: "Grievance submitted" }]
    });

    await grievance.save();
    res.status(201).json({ message: 'Grievance submitted successfully', trackingId: grievance.trackingId });

  } catch (err) {
    console.error("Error in /submit:", err);
    res.status(500).json({ error: 'Failed to submit grievance' });
  }
});

// List Grievances (Optional: Filter by status)
router.get('/list', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const grievances = await Grievance.find(filter).sort({ createdAt: -1 });
    res.json(grievances);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving grievances' });
  }
});

router.get('/track/:trackingId', async (req, res) => {
  try {
    const grievance = await Grievance.findOne({ trackingId: req.params.trackingId });
    if (!grievance) {
      return res.status(404).json({ error: 'Grievance not found' });
    }
    res.json(grievance);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving grievance' });
  }
});

// Admin Verification Route (Triggers Credit Engine)
router.post('/verify/:id', async (req, res) => {
  const { status, remarks, adminName } = req.body; // status: 'Verified' or 'Rejected'

  if (!['Verified', 'Rejected'].includes(status)) {
    return res.status(400).json({ error: "Invalid status. Must be Verified or Rejected" });
  }

  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) return res.status(404).json({ error: "Grievance not found" });

    // Prevent double verification
    if (grievance.status !== 'Pending') {
      return res.status(400).json({ error: "Grievance already processed" });
    }

    grievance.status = status;
    grievance.logs.push({
      action: status,
      by: adminName || "Admin",
      remarks: remarks || `Grievance marked as ${status}`,
      timestamp: new Date()
    });

    await grievance.save();

    // Credit Engine Logic
    if (grievance.phone) {
      const user = await User.findOne({ phone: grievance.phone });
      if (user) {
        let creditChange = 0;
        let reason = "";
        let type = "";

        if (status === 'Verified') {
          creditChange = 10;
          reason = "Grievance Verified";
          type = "VERIFIED_GRIEVANCE";
        } else if (status === 'Rejected') {
          creditChange = -15; // Penalty
          reason = "Grievance Rejected (Spam/Invalid)";
          type = "SPAM_PENALTY";
          user.reputation_score = Math.max(0, user.reputation_score - 5);
        }

        if (creditChange !== 0) {
          user.civic_credits += creditChange;
          await user.save();

          await CreditTransaction.create({
            userId: user._id,
            grievanceId: grievance._id,
            amount: creditChange,
            type: type,
            reason: reason
          });
        }
      }
    }

    res.json({ message: `Grievance ${status} successfully`, creditUpdate: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const departmentCounts = await Grievance.aggregate([
      {
        $group: {
          _id: "$department",
          resolved: {
            $sum: {
              $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0],
            },
          },
          unresolved: {
            $sum: {
              $cond: [{ $eq: ["$status", "Processing"] }, 1, 0],
            },
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", "Pending"] }, 1, 0],
            }
          }
        },
      },
    ]);
    const statusCounts = await Grievance.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      statusCounts,
      departmentCounts,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

export default router;
