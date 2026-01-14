
import express from 'express';
import User from '../models/User.js';
import CreditTransaction from '../models/CreditTransaction.js';
import Leaderboard from '../models/Leaderboard.js';

const router = express.Router();

// 1. Sync User on Login (Create if not exists)
router.post('/user/sync', async (req, res) => {
    const { phone, name } = req.body;
    if (!phone) return res.status(400).send("Phone is required");

    try {
        let user = await User.findOne({ phone });
        if (!user) {
            user = new User({ phone, name, civic_credits: 0, reputation_score: 100 });
            // Signup Bonus
            user.civic_credits += 10;
            await user.save();

            // Log Transaction
            await CreditTransaction.create({
                userId: user._id,
                amount: 10,
                type: 'SIGNUP_BONUS',
                reason: 'Welcome Bonus'
            });
            console.log(`New user created: ${phone}`);
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get Wallet Balance & History
router.get('/wallet/:phone', async (req, res) => {
    const { phone } = req.params;
    try {
        const user = await User.findOne({ phone });
        if (!user) return res.status(404).send("User not found");

        const history = await CreditTransaction.find({ userId: user._id }).sort({ timestamp: -1 }).limit(20);
        res.json({
            credits: user.civic_credits,
            reputation: user.reputation_score,
            history
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Get Leaderboard (Top 10)
router.get('/leaderboard', async (req, res) => {
    try {
        // Determine current leaderboard period (e.g., "MONTHLY_YYYY_MM")
        // For now, simpler: Dynamic Query from User Collection

        const topUsers = await User.find({ civic_credits: { $gt: 0 } })
            .sort({ civic_credits: -1 })
            .limit(10)
            .select('name civic_credits badges'); // Privacy: Don't show phone

        res.json(topUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;
