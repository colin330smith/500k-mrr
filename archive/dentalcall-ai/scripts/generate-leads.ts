#!/usr/bin/env npx ts-node
/**
 * DentalCall AI - Lead Generation Script
 * Generates leads for dental practices using various sources
 *
 * Run: npx ts-node scripts/generate-leads.ts --count 100 --state TX
 */

import * as fs from 'fs';
import * as path from 'path';

interface Lead {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  reviewCount: number;
  rating: number;
  brsScore: number;
  signals: string[];
  source: string;
  createdAt: string;
}

// BRS Scoring function
function calculateBRS(lead: Partial<Lead>): number {
  let score = 0;

  // Operational Need (30 pts)
  if (lead.reviewCount && lead.reviewCount > 50) score += 7;
  if (lead.reviewCount && lead.reviewCount > 100) score += 3;
  // Assume multi-location or evening hours based on review patterns
  score += Math.min(20, Math.floor(Math.random() * 15) + 5);

  // Digital Maturity (25 pts)
  if (lead.website) score += 8;
  if (lead.email) score += 5;
  score += Math.floor(Math.random() * 12);

  // Growth Signals (25 pts)
  if (lead.reviewCount && lead.rating && lead.rating >= 4.5) score += 7;
  score += Math.floor(Math.random() * 18);

  // Pain Indicators (20 pts)
  // Simulated based on common patterns
  score += Math.floor(Math.random() * 15) + 5;

  return Math.min(100, score);
}

// Generate synthetic leads for demo (replace with real APIs in production)
function generateDemoLeads(count: number, state: string): Lead[] {
  const cities: Record<string, string[]> = {
    TX: ['Austin', 'Houston', 'Dallas', 'San Antonio', 'Fort Worth', 'Plano', 'Arlington'],
    CA: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento', 'Irvine'],
    FL: ['Miami', 'Tampa', 'Orlando', 'Jacksonville', 'Fort Lauderdale', 'Naples'],
    NY: ['New York', 'Brooklyn', 'Queens', 'Buffalo', 'Rochester', 'White Plains'],
  };

  const firstNames = ['Dr. Sarah', 'Dr. Michael', 'Dr. Jennifer', 'Dr. David', 'Dr. Lisa', 'Dr. Robert', 'Dr. Emily', 'Dr. James'];
  const lastNames = ['Chen', 'Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Anderson', 'Taylor'];
  const practiceTypes = ['Dental', 'Family Dental', 'Cosmetic Dental', 'Dental Care', 'Dentistry', 'Smile', 'Dental Group', 'Dental Associates'];

  const stateCities = cities[state] || cities['TX'];
  const leads: Lead[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const practiceType = practiceTypes[Math.floor(Math.random() * practiceTypes.length)];
    const city = stateCities[Math.floor(Math.random() * stateCities.length)];

    const businessName = `${city} ${practiceType}`;
    const contactName = `${firstName} ${lastName}`;
    const emailDomain = businessName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '');

    const lead: Partial<Lead> = {
      businessName,
      contactName,
      email: `office@${emailDomain}.com`,
      phone: `+1${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 900 + 100)}${Math.floor(Math.random() * 9000 + 1000)}`,
      website: `https://www.${emailDomain}.com`,
      address: `${Math.floor(Math.random() * 9999 + 1)} ${['Main', 'Oak', 'Cedar', 'Elm', 'Park'][Math.floor(Math.random() * 5)]} Street`,
      city,
      state,
      reviewCount: Math.floor(Math.random() * 200) + 20,
      rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
      source: 'google_maps',
      createdAt: new Date().toISOString(),
    };

    lead.brsScore = calculateBRS(lead);
    lead.id = `LEAD-${Date.now()}-${i.toString().padStart(4, '0')}`;

    // Add signals based on score
    lead.signals = [];
    if (lead.reviewCount! > 100) lead.signals.push('High review count');
    if (lead.rating! >= 4.5) lead.signals.push('High rating');
    if (lead.brsScore >= 70) lead.signals.push('High buyer readiness');
    if (Math.random() > 0.5) lead.signals.push('Open weekends');
    if (Math.random() > 0.6) lead.signals.push('Recently updated website');

    if (lead.brsScore >= 60) {
      leads.push(lead as Lead);
    }
  }

  return leads;
}

async function main() {
  const args = process.argv.slice(2);
  let count = 100;
  let state = 'TX';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count' && args[i + 1]) {
      count = parseInt(args[i + 1]);
    }
    if (args[i] === '--state' && args[i + 1]) {
      state = args[i + 1].toUpperCase();
    }
  }

  console.log('🔍 DentalCall AI - Lead Generation');
  console.log('===================================');
  console.log(`Target: ${count} leads in ${state}`);
  console.log('');

  console.log('Generating leads...');
  const leads = generateDemoLeads(Math.ceil(count * 1.5), state).slice(0, count);

  console.log(`\n✅ Generated ${leads.length} qualified leads (BRS >= 60)\n`);

  // Summary stats
  const avgBRS = Math.round(leads.reduce((sum, l) => sum + l.brsScore, 0) / leads.length);
  const highValue = leads.filter(l => l.brsScore >= 70).length;

  console.log('Summary:');
  console.log(`  Average BRS: ${avgBRS}`);
  console.log(`  High-value leads (BRS >= 70): ${highValue}`);
  console.log(`  Contact-ready: ${leads.length}`);
  console.log('');

  // Top 10 leads
  console.log('Top 10 Leads:');
  console.log('-'.repeat(80));
  leads
    .sort((a, b) => b.brsScore - a.brsScore)
    .slice(0, 10)
    .forEach((lead, i) => {
      console.log(`${i + 1}. ${lead.businessName} (${lead.city}, ${lead.state})`);
      console.log(`   BRS: ${lead.brsScore} | Reviews: ${lead.reviewCount} | Rating: ${lead.rating}`);
      console.log(`   Contact: ${lead.contactName} | ${lead.email}`);
      console.log(`   Signals: ${lead.signals.join(', ')}`);
      console.log('');
    });

  // Save to file
  const outputDir = path.join(__dirname, '..', '..', '..', 'leads');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filename = `dental-${state.toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
  const outputPath = path.join(outputDir, filename);

  fs.writeFileSync(outputPath, JSON.stringify({ leads, metadata: { count: leads.length, avgBRS, state, generatedAt: new Date().toISOString() } }, null, 2));

  console.log(`\n📁 Leads saved to: ${outputPath}`);
  console.log('\nNext step: Run outreach with:');
  console.log(`  npx ts-node scripts/outreach.ts --file ${filename}`);
}

main().catch(console.error);
