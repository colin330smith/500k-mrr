#!/usr/bin/env node
/**
 * DIRECT ACTION SMS - Reply YES to start
 * This bypasses the broken Stripe links
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = '+15126015437';

// DIRECT ACTION - get them to reply
const MESSAGE = `FINAL OFFER - Dental AI that answers every call 24/7

First 5 practices get 60% OFF ($199/mo instead of $499)

Reply YES to claim your spot - we'll call you in 5 mins to set up your free trial

Or call now: 650-201-5786`;

const csvPath = path.join(__dirname, 'leads-export.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n').slice(1);

// Get ALL unique phone numbers
const uniquePhones = new Set();
const leads = lines.map(line => {
    const parts = line.split(',');
    return {
        practice: parts[3]?.replace(/"/g, ''),
        phone: parts[6],
        brs: parseInt(parts[7]) || 0
    };
}).filter(l => {
    if (!l.phone || !l.phone.startsWith('+')) return false;
    if (uniquePhones.has(l.phone)) return false;
    uniquePhones.add(l.phone);
    return true;
});

console.log(`Sending DIRECT ACTION SMS to ${leads.length} leads...\n`);

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
    console.log(`\n\n=== DIRECT ACTION SMS COMPLETE ===`);
    console.log(`Sent to ${sent} leads`);
    console.log(`\nNOW MONITOR FOR "YES" REPLIES!`);
    console.log(`Run: node check-sms-replies.js`);
}

main();
