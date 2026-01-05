#!/usr/bin/env node
/**
 * SMS Blast - All remaining leads with BRS >= 50
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = '+15126015437';

// Alternate message to avoid seeming repetitive
const MESSAGE = `Did you know 85% of dental patients who can't reach you will call your competitor?

DentalCall AI answers every call in under 1 second, 24/7.

Free trial (no card required): local-lift.onrender.com

Reply STOP to opt out`;

const csvPath = path.join(__dirname, 'leads-export.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n').slice(1);

// Get unique phone numbers we haven't messaged yet (BRS 50-54)
const alreadySent = new Set();
const leads = lines.map(line => {
    const parts = line.split(',');
    return {
        practice: parts[3]?.replace(/"/g, ''),
        phone: parts[6],
        brs: parseInt(parts[7]) || 0
    };
}).filter(l => {
    if (!l.phone || !l.phone.startsWith('+')) return false;
    if (alreadySent.has(l.phone)) return false;
    alreadySent.add(l.phone);
    return l.brs >= 50 && l.brs < 55;
});

console.log(`Found ${leads.length} additional leads to message\n`);

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
    for (const lead of leads) {
        const result = await sendSMS(lead.phone, MESSAGE);
        if (result.success) {
            sent++;
            process.stdout.write(`\rSent: ${sent}/${leads.length}`);
        } else failed++;
        await new Promise(r => setTimeout(r, 1100));
    }
    console.log(`\n\nRemaining blast complete: ${sent} sent, ${failed} failed`);
    console.log(`GRAND TOTAL SMS SENT: ${200 + sent}`);
}

main();
