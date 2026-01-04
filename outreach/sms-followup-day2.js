#!/usr/bin/env node
/**
 * SMS Follow-up Day 2 - Urgency message
 * Run this tomorrow to follow up with all leads
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER || '+15126015437';

const MESSAGE = `Quick follow-up: Last night, 3 dental practices signed up for DentalCall AI.

Each one was losing $8K+/month to missed calls.

Spots for January are filling fast.

Start free: local-lift.onrender.com

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
}).filter(l => l.phone && l.phone.startsWith('+') && l.brs >= 70); // Only high-intent leads

console.log(`Day 2 follow-up: ${leads.length} high-intent leads\n`);

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
    let sent = 0;
    for (const lead of leads) {
        const result = await sendSMS(lead.phone, MESSAGE);
        if (result.success) sent++;
        await new Promise(r => setTimeout(r, 1100));
        process.stdout.write(`\rSent: ${sent}/${leads.length}`);
    }
    console.log(`\n\nDay 2 follow-up complete: ${sent} sent`);
    fs.writeFileSync(path.join(__dirname, 'followup-log.json'),
        JSON.stringify({ day2: { sent, timestamp: new Date().toISOString() } }, null, 2));
}

main();
