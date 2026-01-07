#!/usr/bin/env node
/**
 * RevAI - Email Outreach
 * Sends personalized emails to med spa leads
 */

const https = require('https');

// Leads with emails
const leads = [
    { name: "BeyondSkin MedSpa", email: "info@beyondskinmedspa.com", city: "Los Angeles, CA" },
    { name: "Fix Me Up Medical Spa", email: "la@fixmeupmedspa.com", city: "Burbank, CA" },
    { name: "MedBeautyLA", email: "info@MedBeautyLA.com", city: "Los Angeles, CA" },
    { name: "Med Aesthetics Miami", email: "coralgables@medaestheticsmiami.com", city: "Coral Gables, FL" },
    { name: "Willo MediSpa", email: "info@willomedispa.com", city: "Phoenix, AZ" }
];

function generateEmail(lead) {
    return {
        to: lead.email,
        subject: `${lead.name} - Quick question about no-shows`,
        body: `Hi,

I noticed ${lead.name} has great reviews. Quick question: what's your no-show rate like?

I built an AI that texts patients within an hour of a missed appointment. Med spas using it are recovering 70% of no-shows within 48 hours.

It also answers calls 24/7 and responds to new leads in under 5 minutes (huge for conversion).

Would you be open to a quick demo? You can actually try it right now by calling (833) 425-1223.

Either way, happy to share what's working for other practices in ${lead.city}.

Best,
Colin

P.S. 14-day free trial, cancel anytime: https://colin330smith.github.io/500k-mrr/signup.html`
    };
}

// Using Twilio SendGrid would require API key
// For now, output emails ready to send
console.log('='.repeat(60));
console.log('EMAIL OUTREACH - Ready to Send');
console.log('='.repeat(60));
console.log('\nCopy these emails to send manually or via your email client:\n');

for (const lead of leads) {
    const email = generateEmail(lead);
    console.log('-'.repeat(50));
    console.log(`TO: ${email.to}`);
    console.log(`SUBJECT: ${email.subject}`);
    console.log(`\n${email.body}`);
    console.log('\n');
}

console.log('='.repeat(60));
console.log(`Total: ${leads.length} emails ready`);
console.log('='.repeat(60));
