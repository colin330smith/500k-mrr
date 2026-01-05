#!/usr/bin/env node
/**
 * URGENT CLOSING - Final offer, expires in 1 hour
 * Send to warm leads with checkout link
 */

const { execSync } = require('child_process');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = '+15126015437';

// Warm leads from previous calls
const warmLeads = [
    { phone: '+18138386218', name: 'Orlando Dental Center' },
    { phone: '+13106051541', name: 'Lee Dental Studio' },
    { phone: '+16191318663', name: 'Brown Family Dental' },
    { phone: '+16198129469', name: 'San Diego Family Dental' },
    { phone: '+14081739738', name: 'Irvine Dental Group' }
];

const MESSAGE = `FINAL HOURS: $199/mo offer expires tonight

Your dental practice was selected for our founders deal:
• AI answers every call 24/7
• Books appointments automatically
• 60% off forever ($199 vs $499)

Pay now & go live in 10 min:
local-lift.onrender.com/checkout.html

Or call 650-201-5786 - we'll set you up over the phone

Only 2 spots left at this price`;

async function sendSMS(to, message) {
    const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString('base64');
    const cmd = `curl -s -X POST "https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json" \
        -H "Authorization: Basic ${auth}" \
        -d "From=${FROM_NUMBER}" \
        -d "To=${to}" \
        --data-urlencode "Body=${message}"`;
    try {
        const result = execSync(cmd, { encoding: 'utf-8' });
        return { success: !JSON.parse(result).error_code };
    } catch (e) {
        return { success: false };
    }
}

async function main() {
    console.log('🔥 URGENT CLOSE - Sending final offers...\n');

    let sent = 0;
    for (const lead of warmLeads) {
        const result = await sendSMS(lead.phone, MESSAGE);
        if (result.success) {
            sent++;
            console.log(`✓ ${lead.name}`);
        } else {
            console.log(`✗ ${lead.name}`);
        }
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\n=== SENT: ${sent}/${warmLeads.length} ===`);
    console.log('Checkout: local-lift.onrender.com/checkout.html');
}

main();
