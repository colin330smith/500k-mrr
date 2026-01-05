#!/usr/bin/env node
/**
 * Mass checkout push - 30 top leads
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = '+15126015437';

const MESSAGE = `🦷 Dental AI Special - EXPIRES MIDNIGHT

Your practice selected for $199/mo founders rate (reg $499)

What you get:
→ AI answers every call 24/7
→ Books appointments automatically
→ Setup in 10 minutes

Pay & go live NOW:
local-lift.onrender.com/checkout.html

Call 650-201-5786 for help

Reply STOP to opt out`;

// Read leads
const csvPath = path.join(__dirname, 'leads-export.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n').slice(1);

// Top 30 by BRS score
const uniquePhones = new Set();
const leads = lines.map(line => {
    const parts = line.split(',');
    return {
        practice: parts[3]?.replace(/"/g, ''),
        phone: parts[6],
        brs: parseInt(parts[7]) || 0
    };
}).filter(l => {
    if (!l.phone || !l.phone.startsWith('+') || l.brs < 70) return false;
    if (uniquePhones.has(l.phone)) return false;
    uniquePhones.add(l.phone);
    return true;
}).slice(0, 30);

console.log(`Sending checkout push to ${leads.length} leads...\n`);

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
    let sent = 0;
    for (const lead of leads) {
        const result = await sendSMS(lead.phone, MESSAGE);
        if (result.success) {
            sent++;
            process.stdout.write(`\rSent: ${sent}/${leads.length}`);
        }
        await new Promise(r => setTimeout(r, 1100));
    }
    console.log(`\n\n=== CHECKOUT PUSH COMPLETE ===`);
    console.log(`Sent: ${sent}/${leads.length}`);
    console.log(`Checkout URL: local-lift.onrender.com/checkout.html`);
}

main();
