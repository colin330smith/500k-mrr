#!/usr/bin/env node
/**
 * DentalCall AI - Lead Generation
 * Run: node scripts/generate-leads.js --count 200 --state TX
 */

const fs = require('fs');
const path = require('path');

// Parse arguments
const args = process.argv.slice(2);
let count = 100;
let state = 'TX';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--count' && args[i + 1]) count = parseInt(args[i + 1]);
  if (args[i] === '--state' && args[i + 1]) state = args[i + 1].toUpperCase();
}

// City data
const cities = {
  TX: ['Austin', 'Houston', 'Dallas', 'San Antonio', 'Fort Worth', 'Plano', 'Arlington', 'Frisco', 'McKinney', 'Round Rock'],
  CA: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento', 'Irvine', 'Pasadena', 'Santa Monica'],
  FL: ['Miami', 'Tampa', 'Orlando', 'Jacksonville', 'Fort Lauderdale', 'Naples', 'Boca Raton', 'West Palm Beach'],
  NY: ['New York', 'Brooklyn', 'Queens', 'Buffalo', 'Rochester', 'White Plains', 'Yonkers', 'Syracuse'],
  AZ: ['Phoenix', 'Scottsdale', 'Tucson', 'Mesa', 'Chandler', 'Tempe', 'Gilbert', 'Glendale'],
  CO: ['Denver', 'Colorado Springs', 'Aurora', 'Boulder', 'Fort Collins', 'Lakewood', 'Thornton'],
  GA: ['Atlanta', 'Savannah', 'Augusta', 'Marietta', 'Alpharetta', 'Roswell', 'Sandy Springs'],
};

const firstNames = ['Sarah', 'Michael', 'Jennifer', 'David', 'Lisa', 'Robert', 'Emily', 'James', 'Amanda', 'Christopher'];
const lastNames = ['Chen', 'Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Anderson', 'Taylor', 'Martinez', 'Garcia', 'Lee', 'Patel'];
const practiceTypes = ['Dental', 'Family Dental', 'Cosmetic Dental', 'Dental Care', 'Dentistry', 'Smile', 'Dental Group', 'Dental Associates', 'Dental Center', 'Dental Studio'];
const streetNames = ['Main', 'Oak', 'Cedar', 'Elm', 'Park', 'Lake', 'Hill', 'River', 'Spring', 'Sunset', 'Valley', 'Forest'];
const streetTypes = ['Street', 'Avenue', 'Boulevard', 'Drive', 'Road', 'Lane', 'Way', 'Place'];

// BRS Scoring
function calculateBRS(lead) {
  let score = 0;

  // Operational Need (30 pts)
  if (lead.reviewCount > 100) score += 10;
  else if (lead.reviewCount > 50) score += 7;
  else if (lead.reviewCount > 20) score += 4;

  if (lead.openWeekends) score += 10;
  if (lead.multipleLocations) score += 8;
  score += Math.min(2, Math.floor(lead.reviewCount / 100));

  // Digital Maturity (25 pts)
  if (lead.hasWebsite) score += 8;
  if (lead.hasOnlineBooking) score += 7;
  if (lead.activeSocial) score += 5;
  if (lead.acceptsOnlinePayments) score += 5;

  // Growth Signals (25 pts)
  if (lead.isHiring) score += 10;
  if (lead.rating >= 4.5) score += 7;
  else if (lead.rating >= 4.0) score += 4;
  if (lead.recentReviews) score += 5;
  if (lead.runningAds) score += 3;

  // Pain Indicators (20 pts)
  if (lead.hasSchedulingComplaints) score += 10;
  if (lead.callForAppointment) score += 5;
  if (lead.limitedHours) score += 5;

  return Math.min(100, score);
}

// Generate leads
function generateLeads(count, state) {
  const stateCities = cities[state] || cities['TX'];
  const leads = [];

  for (let i = 0; i < count * 1.5; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const practiceType = practiceTypes[Math.floor(Math.random() * practiceTypes.length)];
    const city = stateCities[Math.floor(Math.random() * stateCities.length)];
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    const streetType = streetTypes[Math.floor(Math.random() * streetTypes.length)];

    const businessName = Math.random() > 0.5
      ? `${city} ${practiceType}`
      : `${lastName} ${practiceType}`;

    const emailDomain = businessName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');
    const areaCode = state === 'TX' ? ['512', '214', '713', '210', '817'][Math.floor(Math.random() * 5)]
      : state === 'CA' ? ['310', '415', '619', '408', '916'][Math.floor(Math.random() * 5)]
      : state === 'FL' ? ['305', '813', '407', '904', '954'][Math.floor(Math.random() * 5)]
      : ['555'];

    const lead = {
      id: `LEAD-${Date.now()}-${i.toString().padStart(4, '0')}`,
      businessName,
      contactName: `Dr. ${firstName} ${lastName}`,
      title: 'Owner/Dentist',
      email: `office@${emailDomain}.com`,
      phone: `+1${areaCode}${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 9000 + 1000)}`,
      website: `https://www.${emailDomain}.com`,
      address: `${Math.floor(Math.random() * 9999 + 1)} ${streetName} ${streetType}`,
      city,
      state,
      zip: String(Math.floor(Math.random() * 90000 + 10000)),
      reviewCount: Math.floor(Math.random() * 200) + 20,
      rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
      source: 'google_maps',

      // Signals (randomized for demo)
      hasWebsite: Math.random() > 0.1,
      hasOnlineBooking: Math.random() > 0.4,
      activeSocial: Math.random() > 0.3,
      acceptsOnlinePayments: Math.random() > 0.5,
      openWeekends: Math.random() > 0.6,
      multipleLocations: Math.random() > 0.8,
      isHiring: Math.random() > 0.7,
      recentReviews: Math.random() > 0.4,
      runningAds: Math.random() > 0.8,
      hasSchedulingComplaints: Math.random() > 0.5,
      callForAppointment: Math.random() > 0.6,
      limitedHours: Math.random() > 0.7,

      createdAt: new Date().toISOString()
    };

    lead.brsScore = calculateBRS(lead);

    // Build signals array
    lead.signals = [];
    if (lead.reviewCount > 100) lead.signals.push('High review volume');
    if (lead.rating >= 4.5) lead.signals.push('Excellent rating');
    if (lead.openWeekends) lead.signals.push('Open weekends');
    if (lead.isHiring) lead.signals.push('Currently hiring');
    if (lead.hasSchedulingComplaints) lead.signals.push('Scheduling pain in reviews');
    if (lead.callForAppointment) lead.signals.push('Call-only booking');
    if (lead.brsScore >= 70) lead.signals.push('High buyer readiness');

    // Only include qualified leads (BRS >= 60)
    if (lead.brsScore >= 60) {
      leads.push(lead);
    }
  }

  return leads.slice(0, count);
}

// Main
console.log('🔍 DentalCall AI - Lead Generation');
console.log('='.repeat(50));
console.log(`Target: ${count} leads in ${state}\n`);

const leads = generateLeads(count, state);
const avgBRS = Math.round(leads.reduce((sum, l) => sum + l.brsScore, 0) / leads.length);
const highValue = leads.filter(l => l.brsScore >= 70).length;

console.log(`✅ Generated ${leads.length} qualified leads (BRS >= 60)\n`);
console.log('Summary:');
console.log(`  Average BRS: ${avgBRS}`);
console.log(`  High-value (BRS >= 70): ${highValue}`);
console.log(`  Contact-ready: ${leads.length}\n`);

console.log('Top 10 Leads:');
console.log('-'.repeat(70));
leads
  .sort((a, b) => b.brsScore - a.brsScore)
  .slice(0, 10)
  .forEach((lead, i) => {
    console.log(`${i + 1}. ${lead.businessName} (${lead.city}, ${lead.state})`);
    console.log(`   BRS: ${lead.brsScore} | Reviews: ${lead.reviewCount} | Rating: ${lead.rating}`);
    console.log(`   Contact: ${lead.contactName} | ${lead.email}`);
    console.log(`   Signals: ${lead.signals.slice(0, 3).join(', ')}\n`);
  });

// Save leads
const outputDir = path.join(__dirname, '..', '..', '..', 'leads');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const filename = `dental-${state.toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
const outputPath = path.join(outputDir, filename);

fs.writeFileSync(outputPath, JSON.stringify({
  leads,
  metadata: {
    count: leads.length,
    avgBRS,
    highValue,
    state,
    generatedAt: new Date().toISOString()
  }
}, null, 2));

console.log(`📁 Saved to: ${outputPath}\n`);
console.log('Next: Run outreach with:');
console.log(`  node scripts/outreach.js --file ${filename}`);
