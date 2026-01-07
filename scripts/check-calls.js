#!/usr/bin/env node
/**
 * Check Vapi call statuses
 */

const https = require('https');
const VAPI_API_KEY = process.env.VAPI_API_KEY;

async function getCalls() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.vapi.ai',
            path: '/call?limit=20',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${VAPI_API_KEY}`,
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(JSON.parse(body)));
        });
        req.on('error', reject);
        req.end();
    });
}

async function main() {
    console.log('Fetching recent Vapi calls...\n');
    const calls = await getCalls();

    let answered = 0;
    let busy = 0;
    let noAnswer = 0;
    let inProgress = 0;

    for (const call of calls) {
        const status = call.status || 'unknown';
        const endReason = call.endedReason || '';
        const customer = call.customer?.name || call.customer?.number || 'Unknown';
        const duration = call.endedAt ?
            Math.round((new Date(call.endedAt) - new Date(call.startedAt)) / 1000) :
            'ongoing';

        console.log(`${customer}`);
        console.log(`  Status: ${status} | Reason: ${endReason} | Duration: ${duration}s`);

        if (status === 'ended' && endReason === 'customer-ended-call') answered++;
        else if (endReason === 'customer-busy') busy++;
        else if (endReason === 'customer-did-not-answer') noAnswer++;
        else if (status === 'in-progress' || status === 'queued') inProgress++;
        console.log('');
    }

    console.log('='.repeat(40));
    console.log('SUMMARY');
    console.log(`In Progress: ${inProgress}`);
    console.log(`Answered: ${answered}`);
    console.log(`Busy: ${busy}`);
    console.log(`No Answer: ${noAnswer}`);
}

main();
