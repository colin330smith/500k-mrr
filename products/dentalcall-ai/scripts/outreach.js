#!/usr/bin/env node
/**
 * DentalCall AI - Email Outreach
 * Run: node scripts/outreach.js --file dental-tx-2026-01-02.json
 */

const fs = require('fs');
const path = require('path');

// Parse arguments
const args = process.argv.slice(2);
let filename = '';
let dryRun = true;
let limit = 50;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--file' && args[i + 1]) filename = args[i + 1];
  if (args[i] === '--live') dryRun = false;
  if (args[i] === '--limit' && args[i + 1]) limit = parseInt(args[i + 1]);
}

if (!filename) {
  console.log('Usage: node scripts/outreach.js --file <leads-file.json> [--live] [--limit 50]');
  console.log('\nOptions:');
  console.log('  --file    Lead file from generate-leads.js (required)');
  console.log('  --live    Actually send emails (default: dry run)');
  console.log('  --limit   Max emails to send (default: 50)');
  process.exit(1);
}

// Email templates
const templates = {
  day1: {
    subject: "Quick question about {{businessName}}'s missed calls",
    body: `Hi {{firstName}},

I noticed {{businessName}} has {{reviewCount}} reviews — you're clearly doing something right.

Quick question: what happens to calls when your team is with patients?

Dental practices miss 32% of calls during peak hours. At $200/appointment, that's ~$4,600/month walking out the door.

We built an AI receptionist that answers every call 24/7, books appointments, and integrates with your scheduling system.

Worth a 15-min demo? Reply or grab time here: https://cal.com/dentalcall/demo

Best,
Colin Smith
DentalCall AI

P.S. Free 7-day trial, no credit card needed.`
  }
};

// Personalize template
function personalize(template, lead) {
  const firstName = lead.contactName.replace('Dr. ', '').split(' ')[0];

  let text = template.body
    .replace(/\{\{businessName\}\}/g, lead.businessName)
    .replace(/\{\{firstName\}\}/g, firstName)
    .replace(/\{\{reviewCount\}\}/g, lead.reviewCount)
    .replace(/\{\{city\}\}/g, lead.city)
    .replace(/\{\{state\}\}/g, lead.state);

  let subject = template.subject
    .replace(/\{\{businessName\}\}/g, lead.businessName)
    .replace(/\{\{firstName\}\}/g, firstName);

  return { subject, body: text };
}

// Send email (stub - integrate with Resend in production)
async function sendEmail(to, subject, body) {
  // In production, use Resend:
  // const { Resend } = require('resend');
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from: 'colin@dentalcall.ai', to, subject, text: body });

  console.log(`  📧 ${to}`);
  console.log(`     Subject: ${subject.substring(0, 50)}...`);
  return true;
}

// Main
async function main() {
  console.log('📬 DentalCall AI - Email Outreach');
  console.log('='.repeat(50));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : '🔴 LIVE'}\n`);

  // Load leads
  const leadsPath = path.join(__dirname, '..', '..', '..', 'leads', filename);
  if (!fs.existsSync(leadsPath)) {
    console.error(`❌ File not found: ${leadsPath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(leadsPath, 'utf-8'));
  const leads = data.leads.slice(0, limit);

  console.log(`Loaded ${leads.length} leads from ${filename}\n`);

  // Process leads
  let sent = 0;
  let skipped = 0;

  console.log('Processing...');
  console.log('-'.repeat(50));

  for (const lead of leads) {
    if (lead.brsScore < 60) {
      skipped++;
      continue;
    }

    const email = personalize(templates.day1, lead);

    if (dryRun) {
      console.log(`\n[DRY RUN] ${lead.businessName} (BRS: ${lead.brsScore})`);
      console.log(`  Would send: "${email.subject}"`);
    } else {
      console.log(`\n${lead.businessName} (BRS: ${lead.brsScore})`);
      await sendEmail(lead.email, email.subject, email.body);
    }

    sent++;
    await new Promise(r => setTimeout(r, 50)); // Rate limit
  }

  console.log('\n' + '='.repeat(50));
  console.log('Campaign Summary:');
  console.log(`  Processed: ${leads.length}`);
  console.log(`  Sent/Queued: ${sent}`);
  console.log(`  Skipped: ${skipped}`);

  if (dryRun) {
    console.log('\n⚠️  This was a DRY RUN. Add --live to send emails.');
  } else {
    console.log('\n✅ Outreach launched!');
    console.log('\nFollow-up schedule:');
    console.log('  Day 3: Social proof email');
    console.log('  Day 6: Direct offer');
    console.log('  Day 10: Breakup');
  }

  // Save campaign record
  const campaignsDir = path.join(__dirname, '..', '..', '..', 'outreach');
  if (!fs.existsSync(campaignsDir)) fs.mkdirSync(campaignsDir, { recursive: true });

  const campaign = {
    id: `CAMP-${Date.now()}`,
    filename,
    sent,
    skipped,
    dryRun,
    createdAt: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(campaignsDir, `${campaign.id}.json`),
    JSON.stringify(campaign, null, 2)
  );
}

main().catch(console.error);
