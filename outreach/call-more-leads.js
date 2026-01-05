#!/usr/bin/env node
/**
 * Call 10 more leads directly to close
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = '+15126015437';
const FORWARD_TO = '+16502015786';

const TWIML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Matthew">
        Hi! This is DentalCall AI calling with an exclusive offer for your dental practice.
        We help practices like yours answer every patient call 24/7 with artificial intelligence.
        No more missed calls, no more lost patients.
        We have a special founders rate of just $199 per month - that's 60% off.
        Please hold to speak with someone who can get you started today.
    </Say>
    <Dial timeout="60">
        <Number>${FORWARD_TO}</Number>
    </Dial>
    <Say voice="Polly.Matthew">
        We missed you. Call 650-201-5786 or visit local-lift.onrender.com to claim your spot. Thank you!
    </Say>
</Response>`;

// Read leads
const csvPath = path.join(__dirname, 'leads-export.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n').slice(1);

// Top 10 unique leads
const uniquePhones = new Set();
const leads = lines.map(line => {
    const parts = line.split(',');
    return {
        practice: parts[3]?.replace(/"/g, ''),
        phone: parts[6],
        brs: parseInt(parts[7]) || 0
    };
}).filter(l => {
    if (!l.phone || !l.phone.startsWith('+') || l.brs < 75) return false;
    if (uniquePhones.has(l.phone)) return false;
    uniquePhones.add(l.phone);
    return true;
}).slice(0, 10);

async function makeCall(to, name) {
    const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString('base64');
    const twimlEncoded = encodeURIComponent(TWIML);
    const cmd = `curl -s -X POST "https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Calls.json" \
        -H "Authorization: Basic ${auth}" \
        -d "From=${FROM_NUMBER}" \
        -d "To=${to}" \
        -d "Twiml=${twimlEncoded}"`;
    try {
        const result = execSync(cmd, { encoding: 'utf-8' });
        const json = JSON.parse(result);
        return { success: !!json.sid };
    } catch (e) {
        return { success: false };
    }
}

async function main() {
    console.log('📞 CALLING 10 TOP LEADS...\n');
    console.log('CALLS CONNECT TO: 650-201-5786\n');

    let initiated = 0;
    for (const lead of leads) {
        console.log(`Calling ${lead.practice}...`);
        const result = await makeCall(lead.phone, lead.name);
        if (result.success) {
            console.log(`  ✓ Call initiated`);
            initiated++;
        } else {
            console.log(`  ✗ Failed`);
        }
        await new Promise(r => setTimeout(r, 20000));
    }

    console.log(`\n=== ${initiated}/${leads.length} CALLS INITIATED ===`);
}

main();
