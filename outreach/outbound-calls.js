#!/usr/bin/env node
/**
 * OUTBOUND CALLS - Call top leads directly via Twilio
 * This initiates calls to dental practices to pitch the service
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = '+15126015437';
const FORWARD_TO = '+16502015786'; // Your number to connect

// TwiML for the call - professional intro then connect
const TWIML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Matthew">
        Hello, this is a call from Dental Call AI. We help dental practices answer every patient call 24/7 with artificial intelligence.
        We noticed your practice may be missing calls when staff are busy with patients.
        We'd love to offer you a free trial.
        Please hold while we connect you with our team.
    </Say>
    <Dial timeout="30">
        <Number>${FORWARD_TO}</Number>
    </Dial>
    <Say voice="Polly.Matthew">
        We apologize, but our team is currently unavailable. Please visit local-lift.onrender.com or call 650-201-5786. Thank you!
    </Say>
</Response>`;

const csvPath = path.join(__dirname, 'leads-export.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n').slice(1);

// Get top 10 leads by BRS
const uniquePhones = new Set();
const leads = lines.map(line => {
    const parts = line.split(',');
    return {
        practice: parts[3]?.replace(/"/g, ''),
        phone: parts[6],
        brs: parseInt(parts[7]) || 0
    };
}).filter(l => {
    if (!l.phone || !l.phone.startsWith('+') || l.brs < 80) return false;
    if (uniquePhones.has(l.phone)) return false;
    uniquePhones.add(l.phone);
    return true;
}).slice(0, 10);

console.log(`Initiating outbound calls to ${leads.length} top leads...\n`);

async function makeCall(to) {
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
        return { success: !!json.sid, sid: json.sid };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

async function main() {
    let initiated = 0;
    for (const lead of leads) {
        console.log(`Calling ${lead.practice} (${lead.phone})...`);
        const result = await makeCall(lead.phone);
        if (result.success) {
            console.log(`  ✓ Call initiated (${result.sid})`);
            initiated++;
        } else {
            console.log(`  ✗ Failed`);
        }
        // Wait 30 seconds between calls to not overwhelm
        await new Promise(r => setTimeout(r, 30000));
    }
    console.log(`\n=== OUTBOUND CALLS COMPLETE ===`);
    console.log(`Initiated: ${initiated} calls`);
    console.log(`\nCALLS WILL CONNECT TO: 650-201-5786`);
    console.log(`BE READY TO ANSWER AND CLOSE!`);
}

main();
