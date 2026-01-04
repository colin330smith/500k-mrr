#!/usr/bin/env node
/**
 * Check for SMS replies from dental practices
 */

const { execSync } = require('child_process');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;

console.log('Checking for incoming SMS messages...\n');

const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString('base64');
const cmd = `curl -s "https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json?To=%2B15126015437&PageSize=50" \
    -H "Authorization: Basic ${auth}"`;

try {
    const result = execSync(cmd, { encoding: 'utf-8' });
    const data = JSON.parse(result);

    if (data.messages && data.messages.length > 0) {
        console.log(`Found ${data.messages.length} incoming messages:\n`);

        data.messages.forEach(msg => {
            const date = new Date(msg.date_created).toLocaleString();
            console.log(`From: ${msg.from}`);
            console.log(`Date: ${date}`);
            console.log(`Body: ${msg.body}`);
            console.log('---');
        });

        // Find interested leads (not STOP)
        const interested = data.messages.filter(m =>
            !m.body.toLowerCase().includes('stop') &&
            !m.body.toLowerCase().includes('unsubscribe') &&
            !m.body.toLowerCase().includes('quit') &&
            !m.body.toLowerCase().includes('cancel')
        );

        if (interested.length > 0) {
            console.log(`\n🔥 ${interested.length} INTERESTED LEADS:`);
            interested.forEach(m => {
                console.log(`  ${m.from}: "${m.body}"`);
            });
        }
    } else {
        console.log('No incoming messages yet.');
    }
} catch (e) {
    console.error('Error:', e.message);
}
