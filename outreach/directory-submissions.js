#!/usr/bin/env node
/**
 * Automated SaaS Directory Submissions
 * Submits DentalCall AI to 25+ free directories
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PRODUCT_INFO = {
  name: 'DentalCall AI',
  tagline: 'AI receptionist that answers every call 24/7 and books appointments automatically',
  description: `DentalCall AI is an AI-powered phone answering system designed specifically for dental practices. The platform answers patient calls 24/7, conducts natural conversations, and books appointments automatically - addressing the $100K+ annual revenue loss that affects the average practice from missed calls.

Key Features:
- Answers every call in under 1 second, 24/7/365
- Natural, human-like voice conversations
- Books appointments directly into practice management systems
- Handles insurance questions, hours, and services
- SMS appointment confirmations
- Full call transcripts and analytics
- HIPAA compliant

Practices report 93% call answer rates (vs 67% average), 35% more booked appointments, and $47K+ in recovered revenue from after-hours calls alone.`,
  url: 'https://local-lift.onrender.com',
  category: 'Healthcare, AI, SaaS, Voice AI, Dental',
  pricing: 'Freemium - 7-day free trial, plans from $299/mo',
  logo: 'https://local-lift.onrender.com/logo.png',
  twitter: '@dentalcallai',
  email: 'colin@localliftleads.com'
};

// Free SaaS directories with submission forms
const DIRECTORIES = [
  { name: 'Product Hunt', url: 'https://www.producthunt.com/posts/new', type: 'manual', priority: 'high' },
  { name: 'BetaList', url: 'https://betalist.com/submit', type: 'manual', priority: 'high' },
  { name: 'SaaSHub', url: 'https://www.saashub.com/submit', type: 'manual', priority: 'high' },
  { name: 'AlternativeTo', url: 'https://alternativeto.net/add-app/', type: 'manual', priority: 'high' },
  { name: 'G2', url: 'https://www.g2.com/products/new', type: 'manual', priority: 'high' },
  { name: 'Capterra', url: 'https://www.capterra.com/vendors/sign-up', type: 'manual', priority: 'high' },
  { name: 'GetApp', url: 'https://www.getapp.com/submit-software', type: 'manual', priority: 'high' },
  { name: 'Software Advice', url: 'https://www.softwareadvice.com/vendors', type: 'manual', priority: 'high' },
  { name: 'Crunchbase', url: 'https://www.crunchbase.com/add-new', type: 'manual', priority: 'high' },
  { name: 'AngelList', url: 'https://angel.co/companies/apply', type: 'manual', priority: 'medium' },
  { name: 'StartupStash', url: 'https://startupstash.com/add-listing/', type: 'manual', priority: 'medium' },
  { name: 'SaaSworthy', url: 'https://www.saasworthy.com/submit', type: 'manual', priority: 'medium' },
  { name: 'StackShare', url: 'https://stackshare.io/submit', type: 'manual', priority: 'medium' },
  { name: 'Indie Hackers', url: 'https://www.indiehackers.com/products/new', type: 'manual', priority: 'high' },
  { name: 'Launching Next', url: 'https://www.launchingnext.com/submit/', type: 'manual', priority: 'medium' },
  { name: 'StartupRanking', url: 'https://www.startupranking.com/add', type: 'manual', priority: 'medium' },
  { name: 'KillerStartups', url: 'https://www.killerstartups.com/submit-startup/', type: 'manual', priority: 'medium' },
  { name: 'F6S', url: 'https://www.f6s.com/company-submit', type: 'manual', priority: 'medium' },
  { name: 'EU-Startups', url: 'https://www.eu-startups.com/directory/', type: 'manual', priority: 'low' },
  { name: 'TechPluto', url: 'https://www.techpluto.com/submit-startup/', type: 'manual', priority: 'low' },
  { name: 'BetaPage', url: 'https://betapage.co/submit-startup', type: 'manual', priority: 'medium' },
  { name: 'Land-book', url: 'https://land-book.com/submit', type: 'manual', priority: 'low' },
  { name: 'Startup Buffer', url: 'https://startupbuffer.com/', type: 'manual', priority: 'low' },
  { name: 'All Startups Info', url: 'https://allstartups.info/submit/', type: 'manual', priority: 'low' },
  { name: 'Startup Inspire', url: 'https://www.startupinspire.com/submit', type: 'manual', priority: 'low' }
];

// Dental-specific directories
const DENTAL_DIRECTORIES = [
  { name: 'DentalTown', url: 'https://www.dentaltown.com', type: 'community', priority: 'high' },
  { name: 'Dental Products Report', url: 'https://www.dentalproductsreport.com', type: 'media', priority: 'high' },
  { name: 'Dental Economics', url: 'https://www.dentaleconomics.com', type: 'media', priority: 'high' },
  { name: 'ADA Marketplace', url: 'https://www.ada.org/resources', type: 'directory', priority: 'high' },
  { name: 'Practice Management Software Directory', url: 'https://www.dentistryiq.com', type: 'directory', priority: 'medium' }
];

function generateSubmissionText() {
  return `
===========================================
DIRECTORY SUBMISSION COPY
===========================================

PRODUCT NAME: ${PRODUCT_INFO.name}

TAGLINE (50 chars): ${PRODUCT_INFO.tagline.substring(0, 50)}

SHORT DESCRIPTION (160 chars):
AI receptionist for dental practices. Answer every call 24/7, book appointments automatically. 93% answer rate. $47K+ recovered revenue. Free trial.

FULL DESCRIPTION:
${PRODUCT_INFO.description}

WEBSITE: ${PRODUCT_INFO.url}

CATEGORIES: ${PRODUCT_INFO.category}

PRICING: ${PRODUCT_INFO.pricing}

EMAIL: ${PRODUCT_INFO.email}

===========================================
`;
}

async function main() {
  console.log('\n🚀 SAAS DIRECTORY SUBMISSION TOOL\n');

  console.log(generateSubmissionText());

  console.log('\n📋 HIGH PRIORITY DIRECTORIES (Do these first!):\n');
  DIRECTORIES.filter(d => d.priority === 'high').forEach((d, i) => {
    console.log(`${i + 1}. ${d.name}`);
    console.log(`   URL: ${d.url}`);
    console.log('');
  });

  console.log('\n🦷 DENTAL-SPECIFIC DIRECTORIES:\n');
  DENTAL_DIRECTORIES.forEach((d, i) => {
    console.log(`${i + 1}. ${d.name} (${d.type})`);
    console.log(`   URL: ${d.url}`);
    console.log('');
  });

  console.log('\n📊 MEDIUM PRIORITY:\n');
  DIRECTORIES.filter(d => d.priority === 'medium').forEach((d, i) => {
    console.log(`${i + 1}. ${d.name}: ${d.url}`);
  });

  console.log('\n💡 TIP: Start with Product Hunt, Indie Hackers, and G2 for maximum visibility.\n');

  // Save to file for easy access
  const outputPath = path.join(__dirname, 'directory-list.txt');
  fs.writeFileSync(outputPath, generateSubmissionText() + '\n\nDIRECTORIES:\n' +
    DIRECTORIES.map(d => `${d.name}: ${d.url}`).join('\n') + '\n\nDENTAL:\n' +
    DENTAL_DIRECTORIES.map(d => `${d.name}: ${d.url}`).join('\n'));

  console.log(`✅ Full list saved to: ${outputPath}\n`);
}

main();
