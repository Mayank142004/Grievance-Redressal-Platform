
import { Schema, model } from 'mongoose';

const leaderboardSchema = new Schema({
    period: { type: String, required: true }, // e.g., "WEEKLY_2024_50" or "MONTHLY_2024_12"
    type: { type: String, enum: ['WEEKLY', 'MONTHLY', 'ALL_TIME'], required: true },
    entries: [{
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        name: String,
        score: Number, // Could be credits earned in that period or impact score
        rank: Number
    }],
    generatedAt: { type: Date, default: Date.now }
});

export default model('Leaderboard', leaderboardSchema);
