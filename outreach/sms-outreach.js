#!/usr/bin/env node
/**
 * SMS Outreach to Dental Practices
 * Uses Twilio to send targeted SMS messages
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Twilio credentials from environment
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER || '+15126015437';

// SMS Message - short and compelling
const MESSAGE = `Hi! Quick question - is your dental practice missing calls when staff are busy with patients?

We've helped practices recover $40K+/year with AI that answers every call 24/7.

Free 7-day trial: local-lift.onrender.com

Reply STOP to opt out.`;

// Load leads
const csvPath = path.join(__dirname, 'leads-export.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n').slice(1); // Skip header

// Parse leads with phone numbers
const leads = lines.map(line => {
    const parts = line.split(',');
    return {
        email: parts[0],
        firstName: parts[1],
        lastName: parts[2],
        practice: parts[3]?.replace(/"/g, ''),
        phone: parts[6],
        brs: parseInt(parts[7]) || 0
    };
}).filter(l => l.phone && l.phone.startsWith('+') && l.brs >= 65);

console.log(`Found ${leads.length} leads with high BRS and phone numbers`);

// Send SMS via Twilio API
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
        return { success: !json.error_code, sid: json.sid, error: json.error_message };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

// Main execution
async function main() {
    const results = { sent: 0, failed: 0, errors: [] };
    const batchSize = 20; // Send in batches
    const toSend = leads.slice(0, batchSize);

    console.log(`\nSending SMS to ${toSend.length} top leads...\n`);

    for (const lead of toSend) {
        console.log(`Sending to ${lead.practice} (${lead.phone})...`);
        const result = await sendSMS(lead.phone, MESSAGE);

        if (result.success) {
            console.log(`  ✓ Sent (${result.sid})`);
            results.sent++;
        } else {
            console.log(`  ✗ Failed: ${result.error}`);
            results.failed++;
            results.errors.push({ phone: lead.phone, error: result.error });
        }

        // Rate limit - wait 1 second between messages
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\n========== RESULTS ==========`);
    console.log(`Sent: ${results.sent}`);
    console.log(`Failed: ${results.failed}`);

    // Save results
    fs.writeFileSync(
        path.join(__dirname, 'sms-results.json'),
        JSON.stringify({ ...results, timestamp: new Date().toISOString() }, null, 2)
    );
}

main().catch(console.error);
