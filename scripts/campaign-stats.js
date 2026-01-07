#!/usr/bin/env node
const https = require('https');
const VAPI_API_KEY = process.env.VAPI_API_KEY;

async function getCalls() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.vapi.ai',
            path: '/call?limit=50',
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
    let inProgress = 0, answered = 0, noAnswer = 0, voicemail = 0, total = 0;
    const conversations = [];

    for (const call of calls) {
        if (call.type !== 'outboundPhoneCall') continue;
        total++;
        const status = call.status;
        const reason = call.endedReason || '';

        if (status === 'in-progress' || status === 'queued') inProgress++;
        else if (reason === 'customer-did-not-answer') noAnswer++;
        else if (reason === 'customer-ended-call') {
            answered++;
            if (call.startedAt && call.endedAt) {
                const duration = Math.round((new Date(call.endedAt) - new Date(call.startedAt)) / 1000);
                if (duration > 15) {
                    conversations.push({
                        name: call.customer?.name || 'Unknown',
                        duration: duration
                    });
                }
            }
        }
        else if (reason === 'silence-timed-out') voicemail++;
    }

    console.log('='.repeat(50));
    console.log('MEDSPA REVAI - CAMPAIGN STATS');
    console.log('='.repeat(50));
    console.log(`\nTotal Outbound Calls: ${total}`);
    console.log(`In Progress/Queued: ${inProgress}`);
    console.log(`Answered (human picked up): ${answered}`);
    console.log(`No Answer: ${noAnswer}`);
    console.log(`Voicemail/IVR: ${voicemail}`);

    if (conversations.length > 0) {
        console.log('\n--- Real Conversations (>15s) ---');
        for (const c of conversations) {
            console.log(`  ${c.name}: ${c.duration}s`);
        }
    }
}
main();
