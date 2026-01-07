#!/usr/bin/env node
/**
 * MedSpa RevAI - Vapi Outbound Wave 2
 */

const https = require('https');
const fs = require('fs');

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID;
const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;

const leads = JSON.parse(
    fs.readFileSync('/Users/colinsmith/500k-mrr/leads/medspa/wave2-leads.json', 'utf8')
).slice(0, 15); // First 15 to avoid concurrency limits

async function makeVapiCall(lead) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            assistantId: VAPI_ASSISTANT_ID,
            phoneNumberId: VAPI_PHONE_NUMBER_ID,
            customer: {
                number: lead.phone,
                name: lead.name
            },
            assistantOverrides: {
                firstMessage: `Hi, this is a quick call for ${lead.name}. I'm an AI assistant reaching out because we help med spas recover over 8 thousand dollars per month in lost revenue from no-shows. Do you have 30 seconds to hear how it works?`
            }
        });

        const options = {
            hostname: 'api.vapi.ai',
            path: '/call/phone',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${VAPI_API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(body)); }
                catch (e) { resolve({ error: body }); }
            });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function run() {
    console.log('WAVE 2 - 8 additional leads\n');
    for (const lead of leads) {
        console.log(`Calling: ${lead.name}...`);
        const result = await makeVapiCall(lead);
        console.log(result.id ? `  ✓ ${result.id}` : `  ✗ ${JSON.stringify(result)}`);
        await new Promise(r => setTimeout(r, 5000));
    }
    console.log('\nWave 2 complete!');
}

run();
