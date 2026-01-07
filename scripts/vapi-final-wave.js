#!/usr/bin/env node
const https = require('https');

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID;
const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;

// More leads from previous searches that weren't called
const leads = [
  {"name": "Estevez Aesthetics", "phone": "+17026095915", "city": "Las Vegas, NV"},
  {"name": "Simply Radiant", "phone": "+17022746559", "city": "Las Vegas, NV"},
  {"name": "RejuvLV Wellness", "phone": "+17023219766", "city": "Las Vegas, NV"},
  {"name": "Seamless Aesthetics", "phone": "+17026022534", "city": "North Las Vegas, NV"},
  {"name": "Holistic Beauty Med Spa", "phone": "+16199528294", "city": "San Diego, CA"},
  {"name": "Ageless & Beautiful", "phone": "+16192990264", "city": "San Diego, CA"},
  {"name": "La Jolla Skin", "phone": "+18585001116", "city": "San Diego, CA"}
];

async function makeVapiCall(lead) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            assistantId: VAPI_ASSISTANT_ID,
            phoneNumberId: VAPI_PHONE_NUMBER_ID,
            customer: { number: lead.phone, name: lead.name },
            assistantOverrides: {
                firstMessage: `Hi, this is a quick call for ${lead.name}. I'm an AI assistant reaching out because we help med spas recover over 8 thousand dollars per month in lost revenue from no-shows. Do you have 30 seconds to hear how it works?`
            }
        });
        const options = {
            hostname: 'api.vapi.ai', path: '/call/phone', method: 'POST',
            headers: { 'Authorization': `Bearer ${VAPI_API_KEY}`, 'Content-Type': 'application/json', 'Content-Length': data.length }
        };
        const req = https.request(options, (res) => {
            let body = ''; res.on('data', chunk => body += chunk);
            res.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({ error: body }); } });
        });
        req.on('error', reject); req.write(data); req.end();
    });
}

async function run() {
    console.log('FINAL WAVE - 7 leads (15s spacing)\n');
    let success = 0;

    for (const lead of leads) {
        console.log(`Calling: ${lead.name}...`);
        const result = await makeVapiCall(lead);
        if (result.id) {
            console.log(`  ✓ ${result.id}`);
            success++;
        } else {
            console.log(`  ✗ ${JSON.stringify(result).substring(0, 100)}`);
        }
        await new Promise(r => setTimeout(r, 15000));
    }
    console.log(`\nFinal wave: ${success}/${leads.length} calls placed`);
}
run();
