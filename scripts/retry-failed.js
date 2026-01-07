#!/usr/bin/env node
const https = require('https');

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID;
const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;

const failedLeads = [
  { name: "D'Allure Medspa", phone: "+14697549713", city: "Dallas, TX" },
  { name: "Medicos Family Clinic Med Spa", phone: "+14697820061", city: "Dallas, TX" },
  { name: "Fabutopia Medspa & Aesthetics", phone: "+12147251483", city: "Dallas, TX" },
  { name: "Medspa of Dallas", phone: "+19729044255", city: "Dallas, TX" },
  { name: "It's A Secret Med Spa", phone: "+14697890004", city: "Dallas, TX" }
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
    console.log('Retrying 5 failed Dallas calls...\n');
    for (const lead of failedLeads) {
        console.log(`Calling: ${lead.name}...`);
        const result = await makeVapiCall(lead);
        console.log(result.id ? `  ✓ ${result.id}` : `  ✗ ${JSON.stringify(result)}`);
        await new Promise(r => setTimeout(r, 10000)); // 10 sec delay
    }
    console.log('\nRetry complete!');
}
run();
