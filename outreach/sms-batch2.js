#!/usr/bin/env node
/**
 * SMS Outreach Batch 2 - Next 50 leads
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER || '+15126015437';

const MESSAGE = `Is your dental office missing patient calls? Our AI answers 24/7 and books appointments automatically.

Practices using it see 35% more bookings.

Try free for 7 days: local-lift.onrender.com

Reply STOP to opt out`;

const csvPath = path.join(__dirname, 'leads-export.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n').slice(1);

const leads = lines.map(line => {
    const parts = line.split(',');
    return {
        practice: parts[3]?.replace(/"/g, ''),
        phone: parts[6],
        brs: parseInt(parts[7]) || 0
    };
}).filter(l => l.phone && l.phone.startsWith('+') && l.brs >= 60);

// Get leads 21-70 (skip first 20 already sent)
const toSend = leads.slice(20, 70);
console.log(`Sending SMS to ${toSend.length} leads (batch 2)...\n`);

async function sendSMS(to, message) {
    const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString('base64');
    const cmd = `curl -s -X POST "https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json" \
        -H "Authorization: Basic ${auth}" \
        -d "From=${FROM_NUMBER}" \
        -d "To=${to}" \
        --data-urlencode "Body=${message}"`;
    try {
        const result = execSync(cmd, { encoding: 'utf-8' });
        const json = JSON.parse(result);
        return { success: !json.error_code, sid: json.sid };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

async function main() {
    let sent = 0, failed = 0;
    for (const lead of toSend) {
        console.log(`Sending to ${lead.practice} (${lead.phone})...`);
        const result = await sendSMS(lead.phone, MESSAGE);
        if (result.success) {
            console.log(`  ✓ Sent`);
            sent++;
        } else {
            console.log(`  ✗ Failed`);
            failed++;
        }
        await new Promise(r => setTimeout(r, 1100));
    }
    console.log(`\n=== BATCH 2 COMPLETE ===`);
    console.log(`Sent: ${sent} | Failed: ${failed}`);
    console.log(`Total SMS sent today: ${20 + sent}`);
}

main();
