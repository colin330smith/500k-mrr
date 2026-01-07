#!/usr/bin/env node
const https = require('https');
const VAPI_API_KEY = process.env.VAPI_API_KEY;

async function getCallDetails(callId) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.vapi.ai',
            path: `/call/${callId}`,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${VAPI_API_KEY}` }
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

async function getCalls() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.vapi.ai',
            path: '/call?limit=30',
            method: 'GET',
            headers: { 'Authorization': `Bearer ${VAPI_API_KEY}` }
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
    const calls = await getCalls();

    // Find calls with real conversations (>30 seconds)
    const realConversations = calls.filter(c => {
        if (!c.startedAt || !c.endedAt) return false;
        const duration = (new Date(c.endedAt) - new Date(c.startedAt)) / 1000;
        return duration > 30;
    });

    console.log('=== REAL CONVERSATIONS (>30 sec) ===\n');

    for (const call of realConversations.slice(0, 5)) {
        const duration = Math.round((new Date(call.endedAt) - new Date(call.startedAt)) / 1000);
        console.log(`${call.customer?.name || call.customer?.number}`);
        console.log(`Duration: ${duration}s | Status: ${call.status}`);
        console.log(`End Reason: ${call.endedReason}`);

        if (call.transcript) {
            console.log('\nTranscript:');
            console.log(call.transcript.substring(0, 500) + '...');
        }
        console.log('\n' + '-'.repeat(50) + '\n');
    }
}

main();
