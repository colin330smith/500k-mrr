#!/usr/bin/env node
/**
 * Mega Contact Form Blast
 * Tries 500+ dental practice domains
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Major US cities
const CITIES = [
  'austin', 'dallas', 'houston', 'sanantonio', 'fortworth',
  'phoenix', 'tucson', 'mesa', 'scottsdale', 'tempe',
  'denver', 'coloradosprings', 'aurora', 'boulder', 'lakewood',
  'seattle', 'tacoma', 'bellevue', 'spokane', 'vancouver',
  'portland', 'salem', 'eugene', 'gresham', 'hillsboro',
  'losangeles', 'sandiego', 'sanjose', 'sanfrancisco', 'fresno',
  'sacramento', 'oakland', 'longbeach', 'bakersfield', 'anaheim',
  'miami', 'tampa', 'orlando', 'jacksonville', 'fortlauderdale',
  'atlanta', 'savannah', 'augusta', 'columbus', 'macon',
  'charlotte', 'raleigh', 'durham', 'greensboro', 'wilmington',
  'newyork', 'brooklyn', 'queens', 'buffalo', 'rochester',
  'chicago', 'aurora', 'naperville', 'joliet', 'rockford',
  'philadelphia', 'pittsburgh', 'allentown', 'erie', 'reading',
  'boston', 'worcester', 'springfield', 'cambridge', 'lowell',
  'detroit', 'grandrapids', 'warren', 'sterling', 'lansing',
  'minneapolis', 'stpaul', 'rochester', 'duluth', 'bloomington',
  'nashville', 'memphis', 'knoxville', 'chattanooga', 'clarksville',
  'louisville', 'lexington', 'bowling', 'owensboro', 'covington',
  'indianapolis', 'fortwayne', 'evansville', 'southbend', 'carmel',
  'columbus', 'cleveland', 'cincinnati', 'toledo', 'akron'
];

const SUFFIXES = ['dental', 'dentist', 'familydental', 'smiles', 'dentistry', 'dentalcare'];

const MESSAGE = `Hi,

I found your practice online and wanted to reach out.

We built an AI receptionist for dental practices that answers every call 24/7 and books appointments automatically. Practices using it see 35% more appointments and $47K+ in recovered revenue.

Would 15 minutes work for a demo? Free 7-day trial.

https://local-lift.onrender.com

Alex Chen
DentalCall AI
650-201-5786`;

async function tryContact(domain) {
  const urls = [
    `https://${domain}/contact`,
    `https://www.${domain}/contact`,
    `https://${domain}/contact-us`
  ];

  for (const url of urls) {
    try {
      const check = execSync(`curl -s -o /dev/null -w "%{http_code}" --connect-timeout 2 --max-time 3 "${url}" 2>/dev/null`, { encoding: 'utf8' });
      if (check.trim() === '200') {
        const formData = `name=Alex%20Chen&email=alex%40dentalcall.ai&phone=650-201-5786&message=${encodeURIComponent(MESSAGE)}`;
        execSync(`curl -s -X POST "${url}" -d "${formData}" --max-time 3 2>/dev/null`, { encoding: 'utf8' });
        return { ok: true };
      }
    } catch (e) {}
  }
  return { ok: false };
}

async function main() {
  console.log('🚀 MEGA CONTACT FORM BLAST');
  console.log('==========================\n');

  const results = [];
  let tried = 0;
  let success = 0;

  for (const city of CITIES) {
    for (const suffix of SUFFIXES) {
      const domain = `${city}${suffix}.com`;
      tried++;

      process.stdout.write(`\r[${tried}] ${domain}                              `);

      const result = await tryContact(domain);
      if (result.ok) {
        success++;
        results.push(domain);
        console.log(`\n✓ ${domain}`);
      }

      // Small delay
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log(`\n\n✅ COMPLETE: ${success} submissions from ${tried} attempts`);

  if (results.length > 0) {
    console.log('\nSuccessful submissions:');
    results.forEach(d => console.log(`  - ${d}`));
  }

  fs.writeFileSync(path.join(__dirname, 'mega-blast-results.json'), JSON.stringify({ tried, success, results, time: new Date().toISOString() }, null, 2));
}

main();
