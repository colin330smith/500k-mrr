#!/usr/bin/env node
/**
 * Urgent Follow-up SMS - Send NOW to top leads
 * Creates urgency with limited-time offer
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = '+15126015437';

// FOMO-inducing follow-up
const MESSAGE = `Last chance today: We're closing our January pilot program at midnight.

3 dental practices signed up already this week.

Get 50% off your first month + priority onboarding:
local-lift.onrender.com

Questions? Call 650-201-5786

Reply STOP to opt out`;

const csvPath = path.join(__dirname, 'leads-export.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n').slice(1);

// Only send to top 50 leads by BRS
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
}).slice(0, 50);

console.log(`Sending urgent follow-up to ${leads.length} top leads...\n`);

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
            console.log(`✓ ${lead.practice}`);
        }
        await new Promise(r => setTimeout(r, 1100));
    }
    console.log(`\nUrgent follow-up sent to ${sent} top leads!`);
}

main();
