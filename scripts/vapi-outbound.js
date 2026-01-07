#!/usr/bin/env node
/**
 * MedSpa RevAI - Vapi Outbound Calls
 * Makes AI-powered outbound calls to med spa leads
 */

const https = require('https');
const fs = require('fs');

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_PHONE_NUMBER_ID = process.env.VAPI_PHONE_NUMBER_ID;
const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID;

if (!VAPI_API_KEY) {
    console.error('ERROR: VAPI_API_KEY not set');
    process.exit(1);
}

// Load real leads
const leads = JSON.parse(
    fs.readFileSync('/Users/colinsmith/500k-mrr/leads/medspa/real-leads.json', 'utf8')
);

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

async function runCampaign() {
    console.log('='.repeat(60));
    console.log('MEDSPA REVAI - VAPI OUTBOUND CAMPAIGN');
    console.log('='.repeat(60));
    console.log(`\nLoaded ${leads.length} leads`);
    console.log('Starting outbound calls...\n');

    let successful = 0;
    let failed = 0;
    const results = [];

    for (const lead of leads) {
        console.log(`Calling: ${lead.name} (${lead.city})...`);

        try {
            const result = await makeVapiCall(lead);

            if (result.id) {
                console.log(`  ✓ Call initiated - ID: ${result.id}`);
                successful++;
                results.push({
                    lead: lead.name,
                    callId: result.id,
                    status: 'initiated'
                });
            } else {
                console.log(`  ✗ Failed: ${JSON.stringify(result)}`);
                failed++;
                results.push({
                    lead: lead.name,
                    error: result,
                    status: 'failed'
                });
            }
        } catch (e) {
            console.log(`  ✗ Error: ${e.message}`);
            failed++;
        }

        // Rate limit - wait 5 seconds between calls
        await new Promise(r => setTimeout(r, 5000));
    }

    console.log('\n' + '='.repeat(60));
    console.log('CAMPAIGN COMPLETE');
    console.log('='.repeat(60));
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${failed}`);

    // Save results
    const resultsFile = `/Users/colinsmith/500k-mrr/outreach/campaign-${Date.now()}.json`;
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    console.log(`\nResults saved to: ${resultsFile}`);
}

// Run with --test flag to call just one lead
if (process.argv[2] === '--test') {
    console.log('TEST MODE: Calling first lead only\n');
    makeVapiCall(leads[0]).then(result => {
        console.log('Result:', JSON.stringify(result, null, 2));
    });
} else {
    runCampaign();
}
