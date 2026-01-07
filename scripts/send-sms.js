#!/usr/bin/env node
/**
 * RevAI - SMS Outreach
 * Sends SMS to med spa leads via Twilio
 */

const https = require('https');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM_NUMBER = process.env.TWILIO_PHONE || '+18334251223';

// Real leads with phone numbers
const leads = [
    { name: "BeyondSkin MedSpa", phone: "+13235226313", city: "Los Angeles" },
    { name: "Fix Me Up Medical Spa", phone: "+18182389850", city: "Burbank" },
    { name: "NassifMD MedSpa", phone: "+13102752467", city: "Beverly Hills" },
    { name: "MedBeautyLA", phone: "+12136404008", city: "Los Angeles" },
    { name: "Lux MedSpa Brickell", phone: "+13059889388", city: "Miami" },
    { name: "Med Aesthetics Miami", phone: "+13053567402", city: "Coral Gables" },
    { name: "Skin Damsel Aesthetics", phone: "+14698281732", city: "Dallas" },
    { name: "D'Allure Medspa", phone: "+14697549713", city: "Dallas" },
    { name: "Advanced Aesthetics LV", phone: "+17028384644", city: "Las Vegas" },
    { name: "Park MedSpa", phone: "+16193130495", city: "San Diego" }
];

const message = (name) => `Hi! Quick question for ${name}: what's your no-show rate?

We built an AI that recovers 70% of missed appointments automatically.

Try it free: (833) 425-1223

14-day trial: https://colin330smith.github.io/500k-mrr

Reply STOP to opt out`;

async function sendSMS(to, body) {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString('base64');
        const data = new URLSearchParams({
            From: FROM_NUMBER,
            To: to,
            Body: body
        }).toString();

        const options = {
            hostname: 'api.twilio.com',
            path: `/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(body);
                    resolve(result);
                } catch (e) {
                    resolve({ error: body });
                }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function run() {
    console.log('='.repeat(60));
    console.log('SMS OUTREACH CAMPAIGN');
    console.log('='.repeat(60));
    console.log(`\nSending to ${leads.length} leads...\n`);

    let sent = 0, failed = 0;

    for (const lead of leads) {
        console.log(`Sending to ${lead.name} (${lead.city})...`);

        try {
            const result = await sendSMS(lead.phone, message(lead.name));

            if (result.sid) {
                console.log(`  ✓ Sent - SID: ${result.sid}`);
                sent++;
            } else {
                console.log(`  ✗ Failed: ${result.message || result.error || 'Unknown error'}`);
                failed++;
            }
        } catch (e) {
            console.log(`  ✗ Error: ${e.message}`);
            failed++;
        }

        // Rate limit - 1 per second
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log('\n' + '='.repeat(60));
    console.log(`COMPLETE: ${sent} sent, ${failed} failed`);
    console.log('='.repeat(60));
}

run();
