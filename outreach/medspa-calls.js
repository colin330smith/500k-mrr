const twilio = require('twilio');
const fs = require('fs');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const FROM_NUMBER = '+16502015786';
const SALES_NUMBER = '+16502015786'; // Forward to sales

const leads = JSON.parse(fs.readFileSync('../leads/medspa/sample-leads.json', 'utf8'));

async function makeCall(lead) {
    const twiml = `
        <Response>
            <Say voice="Polly.Joanna">
                Hi, this is a quick call for ${lead.name}.
                We help med spas recover over 8 thousand dollars per month in lost revenue from no-shows and slow lead follow-up.
                Would you like to learn more? Press 1 to speak with someone, or press 2 if this isn't a good time.
            </Say>
            <Gather numDigits="1" action="https://handler.twilio.com/twiml/medspa-response">
                <Say>Press 1 to connect, or 2 to end the call.</Say>
            </Gather>
            <Say>Thanks for your time. Visit medspa-revai.onrender.com to learn more. Goodbye!</Say>
        </Response>
    `;

    try {
        const call = await client.calls.create({
            twiml: twiml,
            to: lead.phone,
            from: FROM_NUMBER
        });
        return { success: true, sid: call.sid };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

async function runCalls() {
    console.log('📞 Starting MedSpa RevAI outbound calls...\n');

    let successful = 0;
    let failed = 0;

    for (const lead of leads.slice(0, 10)) { // Start with 10
        if (!lead.phone) continue;

        console.log(`Calling: ${lead.name}...`);
        const result = await makeCall(lead);

        if (result.success) {
            console.log(`  ✓ Call initiated (${result.sid})`);
            successful++;
        } else {
            console.log(`  ✗ Failed: ${result.error}`);
            failed++;
        }

        // Rate limit between calls
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log(`\n=== CALLS COMPLETE ===`);
    console.log(`Initiated: ${successful}`);
    console.log(`Failed: ${failed}`);
}

runCalls();
