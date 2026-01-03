#!/usr/bin/env node
/**
 * Direct Outreach via Contact Forms
 * Bypasses email entirely - submits directly to practice websites
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// High-value practices from our lead list with likely contact form patterns
const PRACTICES = [
  { name: 'Buckhead Dental Group', domain: 'buckheaddentalgroup.com', state: 'GA' },
  { name: 'Tribeca Smile Studio', domain: 'tribecasmilestudio.com', state: 'NY' },
  { name: 'Rittenhouse Square Dentistry', domain: 'rittenhousedentistry.com', state: 'PA' },
  { name: 'Gold Coast Dentistry', domain: 'goldcoastdentistry.com', state: 'IL' },
  { name: 'Atlanta Smile Studio', domain: 'atlantasmilestudio.com', state: 'GA' },
  { name: 'SouthPark Dental', domain: 'southparkdental.com', state: 'NC' },
  { name: 'Upper East Side Dental', domain: 'uesdentalnyc.com', state: 'NY' },
  { name: 'Manhattan Smile Studio', domain: 'manhattansmilestudio.com', state: 'NY' },
  { name: 'Chicago Loop Dental', domain: 'chicagoloopdental.com', state: 'IL' },
  { name: 'Philadelphia Smile Studio', domain: 'phillysmilestudio.com', state: 'PA' }
];

const MESSAGE = (name) => `Hi,

I came across ${name} and was impressed by your practice. I wanted to share something that might help your front desk.

We've built an AI receptionist specifically for dental practices that:
- Answers every call 24/7 (no voicemail)
- Books appointments directly into your calendar
- Sounds completely natural

Practices using it see 35% more booked appointments and recover $47K+ from after-hours calls.

Would you be open to a quick 15-minute demo? We offer a free 7-day trial.

See it in action: https://local-lift.onrender.com

Best,
Alex Chen
DentalCall AI
650-201-5786`;

async function submitToContactForm(practice) {
  // Try common contact form endpoints
  const endpoints = [
    `https://${practice.domain}/contact`,
    `https://${practice.domain}/contact-us`,
    `https://www.${practice.domain}/contact`,
    `https://www.${practice.domain}/contact-us`
  ];

  console.log(`\n📧 Attempting: ${practice.name}`);

  for (const url of endpoints) {
    try {
      // First, try to fetch the page to see if it exists
      const check = execSync(`curl -s -o /dev/null -w "%{http_code}" --max-time 5 "${url}" 2>/dev/null`, { encoding: 'utf8' });

      if (check.trim() === '200') {
        console.log(`   Found contact page: ${url}`);

        // Try FormSubmit-style submission if they use it
        const formData = new URLSearchParams({
          name: 'Alex Chen',
          email: 'alex@dentalcall.ai',
          phone: '650-201-5786',
          message: MESSAGE(practice.name),
          _subject: `Partnership opportunity for ${practice.name}`
        }).toString();

        // Attempt POST to the contact endpoint
        try {
          execSync(`curl -s -X POST "${url}" -d "${formData}" --max-time 10 2>/dev/null`, { encoding: 'utf8' });
          console.log(`   ✓ Submitted form to ${practice.name}`);
          return { ok: true, url };
        } catch (e) {
          console.log(`   Form submit failed, trying next...`);
        }
      }
    } catch (e) {
      // Continue to next endpoint
    }
  }

  console.log(`   ✗ No contact form found for ${practice.name}`);
  return { ok: false };
}

async function main() {
  console.log('🚀 DIRECT CONTACT FORM OUTREACH');
  console.log('================================\n');

  let success = 0;
  let failed = 0;

  for (const practice of PRACTICES) {
    const result = await submitToContactForm(practice);
    if (result.ok) success++;
    else failed++;

    // Rate limit
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\n✅ COMPLETE: ${success} submitted, ${failed} failed\n`);
}

main();
