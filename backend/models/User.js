
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    phone: { type: String, required: true, unique: true },
    name: { type: String, default: "Citizen" },
    email: String,
    reputation_score: { type: Number, default: 100 },
    civic_credits: { type: Number, default: 0 },
    badges: [String], // e.g., ["Gold Contributor", "Early Adopter"]
    joinedAt: { type: Date, default: Date.now }
});

export default model('User', userSchema);
