const twilio = require('twilio');
const fs = require('fs');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const FROM_NUMBER = '+16502015786';

const leads = JSON.parse(fs.readFileSync('../leads/medspa/sample-leads.json', 'utf8'));

const message = (name) => `Hi! I noticed ${name} might be losing revenue to no-shows and slow lead follow-up.

Our AI recovers $8K+/mo for med spas by:
- Following up on no-shows instantly
- Responding to leads in <5 min 24/7
- Reactivating lapsed clients

Free 14-day trial: medspa-revai.onrender.com

Reply STOP to opt out.`;

async function sendSMS() {
    console.log('📱 Starting MedSpa RevAI outreach...\n');

    let sent = 0;
    let failed = 0;

    for (const lead of leads) {
        if (!lead.phone) continue;

        try {
            await client.messages.create({
                body: message(lead.name),
                from: FROM_NUMBER,
                to: lead.phone
            });
            console.log(`✓ ${lead.name} (${lead.city})`);
            sent++;

            // Rate limit
            await new Promise(r => setTimeout(r, 1000));
        } catch (e) {
            console.log(`✗ ${lead.name}: ${e.message}`);
            failed++;
        }
    }

    console.log(`\n=== OUTREACH COMPLETE ===`);
    console.log(`Sent: ${sent}`);
    console.log(`Failed: ${failed}`);
}

sendSMS();
