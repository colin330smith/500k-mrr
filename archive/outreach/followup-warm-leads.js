#!/usr/bin/env node
const { execSync } = require('child_process');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const FROM = '+15126015437';

const warmLeads = [
    { phone: '+18138386218', name: 'Orlando Dental Center' },
    { phone: '+13106051541', name: 'Lee Dental Studio' }
];

const MESSAGE = `Hi! Thanks for taking our call about DentalCall AI. Ready to start your free trial? Reply YES or call 650-201-5786 - setup takes 10 minutes.`;

const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString('base64');

warmLeads.forEach(lead => {
    const cmd = `curl -s -X POST "https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json" -H "Authorization: Basic ${auth}" -d "From=${FROM}" -d "To=${lead.phone}" --data-urlencode "Body=${MESSAGE}"`;
    try {
        execSync(cmd);
        console.log(`✓ Sent to ${lead.name} (${lead.phone})`);
    } catch (e) {
        console.log(`✗ Failed: ${lead.name}`);
    }
});

console.log('\nWarm lead follow-ups sent!');
