#!/usr/bin/env node
/**
 * IMMEDIATE follow-up to leads who answered calls
 */

const { execSync } = require('child_process');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = '+15126015437';

// HOT leads who answered our calls
const hotLeads = [
    { phone: '+13106051541', name: 'Lee Dental Studio' },
    { phone: '+18138386218', name: 'Orlando Dental Center' },
    { phone: '+13107219231', name: 'San Francisco Dental Group' }
];

const MESSAGE = `Thanks for taking our call!

As discussed, here's your exclusive link to start:
→ $199/mo (60% off, locked forever)
→ Go live in 10 minutes
→ 30-day money back guarantee

Start now: local-lift.onrender.com/signup.html

Questions? Call me directly: 650-201-5786

- Colin, DentalCall AI`;

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
    console.log('📱 Sending follow-up to HOT leads...\n');
    for (const lead of hotLeads) {
        const result = await sendSMS(lead.phone, MESSAGE);
        console.log(`${result.success ? '✓' : '✗'} ${lead.name}`);
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log('\nFollow-up sent to call answerers!');
}

main();
