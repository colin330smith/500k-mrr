#!/usr/bin/env node
/**
 * SMS Outreach Batch 3 - Remaining leads
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER || '+15126015437';

const MESSAGE = `Your competitors are using AI to answer every patient call. Are you still sending callers to voicemail?

DentalCall AI: 24/7 call answering + automatic booking

Free trial: local-lift.onrender.com

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
}).filter(l => l.phone && l.phone.startsWith('+') && l.brs >= 55);

// Get leads 71-109 (remaining)
const toSend = leads.slice(70);
console.log(`Sending SMS to ${toSend.length} leads (batch 3)...\n`);

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
        return { success: !json.error_code };
    } catch (e) {
        return { success: false };
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
    console.log(`\n=== BATCH 3 COMPLETE ===`);
    console.log(`Sent: ${sent} | Failed: ${failed}`);
    console.log(`TOTAL SMS SENT: ${70 + sent}`);
}

main();
