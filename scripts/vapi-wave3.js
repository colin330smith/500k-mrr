#!/usr/bin/env node
const https = require('https');
const fs = require('fs');

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID;
const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;

// Remaining leads that failed due to concurrency
const leads = [
  {"name": "Royal Bliss Med Spa", "phone": "+14705868213", "city": "Atlanta, GA"},
  {"name": "NYAH Med Spa", "phone": "+16786878444", "city": "Alpharetta, GA"},
  {"name": "SkinSpirit Buckhead", "phone": "+14047260500", "city": "Atlanta, GA"},
  {"name": "VanityMD Luxury Aesthetics", "phone": "+14048555580", "city": "Atlanta, GA"},
  {"name": "Advanced Aesthetics LV", "phone": "+17028384644", "city": "Las Vegas, NV"},
  {"name": "White Coat Aesthetics", "phone": "+17029190017", "city": "Las Vegas, NV"},
  {"name": "LuxeMD Aesthetics", "phone": "+17024787180", "city": "Las Vegas, NV"},
  {"name": "Blue Point Medical Spa", "phone": "+17023073330", "city": "Las Vegas, NV"},
  {"name": "Fabutopia Medspa & Aesthetics", "phone": "+12147251483", "city": "Dallas, TX"},
  {"name": "Medspa of Dallas", "phone": "+19729044255", "city": "Dallas, TX"},
  {"name": "It's A Secret Med Spa", "phone": "+14697890004", "city": "Dallas, TX"},
  {"name": "Park MedSpa", "phone": "+16193130495", "city": "San Diego, CA"},
  {"name": "San Diego Aesthetics", "phone": "+16193030988", "city": "La Mesa, CA"},
  {"name": "Eros Beauty and Wellness", "phone": "+16194814651", "city": "San Diego, CA"},
  {"name": "Siti Med Spa", "phone": "+16197178484", "city": "San Diego, CA"}
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
    console.log('WAVE 3 - 15 remaining leads (10s spacing)\n');
    let success = 0, fail = 0;

    for (const lead of leads) {
        console.log(`Calling: ${lead.name}...`);
        const result = await makeVapiCall(lead);
        if (result.id) {
            console.log(`  ✓ ${result.id}`);
            success++;
        } else {
            console.log(`  ✗ Concurrency limit - will retry`);
            fail++;
            // Wait extra time if we hit concurrency
            await new Promise(r => setTimeout(r, 15000));
        }
        await new Promise(r => setTimeout(r, 10000)); // 10 sec between calls
    }
    console.log(`\nWave 3 complete: ${success} success, ${fail} failed`);
}
run();
