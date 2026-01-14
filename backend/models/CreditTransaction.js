
import { Schema, model } from 'mongoose';

const creditTransactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    grievanceId: { type: Schema.Types.ObjectId, ref: 'Grievance' }, // Optional, as some credits might be bonuses
    amount: { type: Number, required: true }, // Positive for credit, Negative for debit
    type: {
        type: String,
        enum: ['VERIFIED_GRIEVANCE', 'RESOLUTION_BONUS', 'SPAM_PENALTY', 'DUPLICATE_PENALTY', 'SIGNUP_BONUS', 'MANUAL_ADJUSTMENT'],
        required: true
    },
    reason: String,
    timestamp: { type: Date, default: Date.now }
});

export default model('CreditTransaction', creditTransactionSchema);
