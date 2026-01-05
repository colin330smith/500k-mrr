#!/usr/bin/env node
/**
 * Call warm leads directly to close
 */

const { execSync } = require('child_process');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = '+15126015437';
const FORWARD_TO = '+16502015786';

// TwiML for the call
const TWIML = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Matthew">
        Hello! This is your final call back from DentalCall AI.
        We have your exclusive founders offer at just $199 per month ready to activate.
        That's 60% off our normal rate, locked in forever.
        Stay on the line to speak with someone who can get you set up in the next 10 minutes.
    </Say>
    <Dial timeout="60">
        <Number>${FORWARD_TO}</Number>
    </Dial>
    <Say voice="Polly.Matthew">
        Sorry we missed you. Visit local-lift.onrender.com/checkout.html or call 650-201-5786 to claim your spot. Thank you!
    </Say>
</Response>`;

// Top warm leads
const leads = [
    { phone: '+18138386218', name: 'Orlando Dental Center' },
    { phone: '+13106051541', name: 'Lee Dental Studio' }
];

async function makeCall(to, name) {
    const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH}`).toString('base64');
    const twimlEncoded = encodeURIComponent(TWIML);

    const cmd = `curl -s -X POST "https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Calls.json" \
        -H "Authorization: Basic ${auth}" \
        -d "From=${FROM_NUMBER}" \
        -d "To=${to}" \
        -d "Twiml=${twimlEncoded}"`;

    try {
        const result = execSync(cmd, { encoding: 'utf-8' });
        const json = JSON.parse(result);
        return { success: !!json.sid, sid: json.sid };
    } catch (e) {
        return { success: false };
    }
}

async function main() {
    console.log('📞 CALLING WARM LEADS TO CLOSE...\n');
    console.log('CALLS WILL CONNECT TO: 650-201-5786');
    console.log('BE READY TO CLOSE!\n');

    for (const lead of leads) {
        console.log(`Calling ${lead.name}...`);
        const result = await makeCall(lead.phone, lead.name);
        if (result.success) {
            console.log(`  ✓ Call initiated`);
        } else {
            console.log(`  ✗ Failed`);
        }
        // Wait 45 seconds between calls
        await new Promise(r => setTimeout(r, 45000));
    }

    console.log('\n=== CALLS COMPLETE ===');
}

main();
