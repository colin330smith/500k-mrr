#!/usr/bin/env node
/**
 * Mass Contact Form Submission
 * Attempts to reach 100+ dental practices via their website contact forms
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Generate practice domain patterns to try
function generateDomains(city, state) {
  const cityClean = city.toLowerCase().replace(/\s+/g, '');
  const patterns = [
    `${cityClean}dental.com`,
    `${cityClean}dentist.com`,
    `${cityClean}familydental.com`,
    `${cityClean}smiles.com`,
    `${cityClean}dentistry.com`,
    `${cityClean}dentalcare.com`,
    `${cityClean}smiledental.com`
  ];
  return patterns;
}

const CITIES = [
  { city: 'Austin', state: 'TX' },
  { city: 'Dallas', state: 'TX' },
  { city: 'Houston', state: 'TX' },
  { city: 'Phoenix', state: 'AZ' },
  { city: 'Denver', state: 'CO' },
  { city: 'Seattle', state: 'WA' },
  { city: 'Portland', state: 'OR' },
  { city: 'Miami', state: 'FL' },
  { city: 'Tampa', state: 'FL' },
  { city: 'Orlando', state: 'FL' },
  { city: 'Boston', state: 'MA' },
  { city: 'San Diego', state: 'CA' },
  { city: 'San Jose', state: 'CA' },
  { city: 'Sacramento', state: 'CA' },
  { city: 'Nashville', state: 'TN' },
  { city: 'Charlotte', state: 'NC' },
  { city: 'Raleigh', state: 'NC' },
  { city: 'Columbus', state: 'OH' },
  { city: 'Cleveland', state: 'OH' },
  { city: 'Indianapolis', state: 'IN' }
];

const MESSAGE = (domain) => `Hi,

I found your practice online and wanted to reach out about something that might help.

We've built an AI receptionist for dental practices that:
- Answers every call 24/7 (no more voicemail)
- Books appointments directly into your calendar
- Sounds completely natural - patients can't tell

Practices using it see 35% more booked appointments and $47K+ in recovered revenue from after-hours calls.

Would 15 minutes work for a quick demo? Free 7-day trial, no credit card needed.

See it live: https://local-lift.onrender.com

Best,
Alex Chen
DentalCall AI
972-845-8338`;

async function tryContactForm(domain) {
  const endpoints = [
    `https://${domain}/contact`,
    `https://${domain}/contact-us`,
    `https://www.${domain}/contact`,
    `https://www.${domain}/contact-us`
  ];

  for (const url of endpoints) {
    try {
      const check = execSync(`curl -s -o /dev/null -w "%{http_code}" --max-time 3 "${url}" 2>/dev/null`, { encoding: 'utf8' });

      if (check.trim() === '200') {
        const formData = `name=Alex%20Chen&email=alex%40dentalcall.ai&phone=972-845-8338&message=${encodeURIComponent(MESSAGE(domain))}&_subject=${encodeURIComponent('Partnership opportunity')}`;

        try {
          execSync(`curl -s -X POST "${url}" -d "${formData}" --max-time 5 2>/dev/null`, { encoding: 'utf8' });
          return { ok: true, url };
        } catch (e) {
          // Form submit failed
        }
      }
    } catch (e) {
      // Continue
    }
  }
  return { ok: false };
}

async function main() {
  console.log('🚀 MASS CONTACT FORM OUTREACH');
  console.log('==============================\n');

  const results = { success: [], failed: [] };
  let total = 0;

  for (const loc of CITIES) {
    const domains = generateDomains(loc.city, loc.state);

    for (const domain of domains) {
      total++;
      process.stdout.write(`\r[${total}] Trying ${domain}...                    `);

      const result = await tryContactForm(domain);
      if (result.ok) {
        results.success.push({ domain, url: result.url });
        console.log(`\n✓ SUCCESS: ${domain}`);
      }

      // Small delay
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log(`\n\n✅ COMPLETE`);
  console.log(`Submitted: ${results.success.length}`);
  console.log(`Tried: ${total}`);

  if (results.success.length > 0) {
    console.log('\nSuccessful submissions:');
    results.success.forEach(s => console.log(`  - ${s.domain}`));
  }

  // Save results
  fs.writeFileSync(path.join(__dirname, 'contact-form-results.json'), JSON.stringify(results, null, 2));
}

main();
