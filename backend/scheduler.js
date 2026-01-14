
import cron from 'node-cron';
import Grievance from './models/Grievance.js';

const setupScheduler = () => {
    console.log("Scheduler initialized.");

    // Run every hour
    cron.schedule('0 * * * *', async () => {
        console.log("Running Escalation Check...");
        const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

        try {
            // Find Pending grievances older than 2 days that haven't been escalated to max (2)
            const grievancesToEscalate = await Grievance.find({
                status: "Pending",
                createdAt: { $lt: twoDaysAgo },
                escalationLevel: { $lt: 2 }
            });

            for (const grievance of grievancesToEscalate) {
                grievance.escalationLevel += 1;
                grievance.logs.push({
                    action: "Escalated",
                    by: "System",
                    remarks: `Auto-escalated to Level ${grievance.escalationLevel} due to inactivity > 48hrs.`
                });
                await grievance.save();
                console.log(`Escalated Grievance ${grievance.trackingId} to Level ${grievance.escalationLevel}`);
            }
        } catch (err) {
            console.error("Escalation Job Failed:", err);
        }
    });
};

export default setupScheduler;
