#!/usr/bin/env node
/**
 * MedSpa RevAI - Revenue Monitor
 *
 * Monitors Stripe for new customers and sends SMS alerts.
 * Run: node scripts/monitor-revenue.js
 */

const https = require('https');

// Configuration - set these via environment variables
// Run: source ~/.medspa-revai.env && node scripts/monitor-revenue.js
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = process.env.TWILIO_PHONE || '+18334251223';
const NOTIFY_TO = process.env.NOTIFY_PHONE || '+16502015786';

if (!STRIPE_KEY) {
    console.error('ERROR: STRIPE_SECRET_KEY not set');
    console.error('Run: source ~/.medspa-revai.env && node scripts/monitor-revenue.js');
    process.exit(1);
}

let lastCustomerCount = 0;
let lastSubscriptionCount = 0;

// Stripe API call
async function stripeGet(endpoint) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.stripe.com',
            path: `/v1/${endpoint}`,
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${STRIPE_KEY}`
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve({ data: [] });
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

// Send SMS via Twilio
async function sendSMS(message) {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString('base64');
        const data = new URLSearchParams({
            From: TWILIO_FROM,
            To: NOTIFY_TO,
            Body: message
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
            res.on('end', () => resolve(JSON.parse(body)));
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

// Check for new customers
async function checkRevenue() {
    console.log(`[${new Date().toISOString()}] Checking Stripe...`);

    const customers = await stripeGet('customers?limit=100');
    const subscriptions = await stripeGet('subscriptions?limit=100');

    const customerCount = customers.data?.length || 0;
    const subscriptionCount = subscriptions.data?.length || 0;

    // Calculate MRR
    let mrr = 0;
    if (subscriptions.data) {
        mrr = subscriptions.data.reduce((sum, sub) => {
            if (sub.status === 'active' || sub.status === 'trialing') {
                return sum + (sub.plan?.amount || 0) / 100;
            }
            return sum;
        }, 0);
    }

    console.log(`  Customers: ${customerCount}`);
    console.log(`  Active Subscriptions: ${subscriptionCount}`);
    console.log(`  MRR: $${mrr.toLocaleString()}`);

    // Alert on new customer
    if (customerCount > lastCustomerCount && lastCustomerCount > 0) {
        const newCount = customerCount - lastCustomerCount;
        const message = `NEW CUSTOMER ALERT!\n\nMedSpa RevAI just got ${newCount} new customer(s)!\n\nTotal: ${customerCount}\nMRR: $${mrr}\n\nCheck Stripe dashboard for details.`;

        console.log('\n  >>> NEW CUSTOMER! Sending SMS alert...');
        try {
            await sendSMS(message);
            console.log('  >>> SMS sent!');
        } catch (e) {
            console.error('  >>> SMS failed:', e.message);
        }
    }

    // Alert on new subscription
    if (subscriptionCount > lastSubscriptionCount && lastSubscriptionCount > 0) {
        const message = `SUBSCRIPTION ALERT!\n\nNew subscription activated!\n\nActive Subs: ${subscriptionCount}\nMRR: $${mrr}\n\nRevenue is coming in!`;

        console.log('\n  >>> NEW SUBSCRIPTION! Sending SMS alert...');
        try {
            await sendSMS(message);
            console.log('  >>> SMS sent!');
        } catch (e) {
            console.error('  >>> SMS failed:', e.message);
        }
    }

    lastCustomerCount = customerCount;
    lastSubscriptionCount = subscriptionCount;

    return { customerCount, subscriptionCount, mrr };
}

// Main loop
async function main() {
    console.log('='.repeat(60));
    console.log('MEDSPA REVAI - REVENUE MONITOR');
    console.log('='.repeat(60));
    console.log(`\nMonitoring Stripe for new customers...`);
    console.log(`Will SMS ${NOTIFY_TO} on new signups\n`);
    console.log('Press Ctrl+C to stop\n');

    // Initial check
    const initial = await checkRevenue();
    lastCustomerCount = initial.customerCount;
    lastSubscriptionCount = initial.subscriptionCount;

    // Check every 60 seconds
    setInterval(checkRevenue, 60000);
}

// Single check mode
if (process.argv[2] === '--once') {
    checkRevenue().then(stats => {
        console.log('\nCurrent Status:');
        console.log(`  Customers: ${stats.customerCount}`);
        console.log(`  Subscriptions: ${stats.subscriptionCount}`);
        console.log(`  MRR: $${stats.mrr}`);
        process.exit(0);
    });
} else {
    main();
}
