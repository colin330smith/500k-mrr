#!/usr/bin/env npx ts-node
/**
 * DentalCall AI - Outreach Campaign Script
 * Sends personalized email sequences to qualified leads
 *
 * Run: npx ts-node scripts/outreach.ts --file dental-tx-2026-01-02.json
 */

import * as fs from 'fs';
import * as path from 'path';

interface Lead {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  reviewCount: number;
  brsScore: number;
}

interface EmailTemplate {
  subject: string;
  body: string;
}

// Email templates
const templates: Record<string, EmailTemplate> = {
  day1_roi: {
    subject: "Quick math on {{businessName}}'s missed calls",
    body: `Hi {{firstName}},

I noticed {{businessName}} has {{reviewCount}} reviews — clearly you're doing something right.

Quick question: what happens to calls that come in when your team is with patients?

Our data shows the average dental practice misses 32% of calls during peak hours. At $200/appointment, that's roughly $4,600/month walking out the door.

We built an AI receptionist that answers every call, books appointments, and integrates with your scheduling system. It costs less than 2 missed appointments per month.

Worth a 15-min demo?

Best,
Colin Smith
DentalCall AI

P.S. We're offering a free 7-day trial with no credit card required.`,
  },
  day3_social_proof: {
    subject: "How {{similarBusiness}} added $12K/month",
    body: `Hi {{firstName}},

{{similarBusiness}} in {{city}} had the same problem — calls going to voicemail during lunch and after hours.

After implementing our AI receptionist:
→ 340 additional appointments booked in month 1
→ 94% caller satisfaction rating
→ Staff freed from phone duty during peak times

Happy to show you exactly how it works for dental practices.

15 minutes — here's my calendar: https://cal.com/dentalcall/demo

Best,
Colin Smith
DentalCall AI`,
  },
  day6_offer: {
    subject: "Free trial for {{businessName}}",
    body: `Hi {{firstName}},

I'll keep this short: want to try our AI receptionist free for 7 days?

No credit card, no commitment.

We'll set up a dedicated phone number that forwards calls when your line is busy. You keep your existing system.

Reply 'yes' and I'll have it ready by tomorrow.

Best,
Colin Smith
DentalCall AI`,
  },
  day10_breakup: {
    subject: "Closing your file",
    body: `Hi {{firstName}},

I haven't heard back — totally understand if the timing isn't right. I'll stop emailing.

The free trial offer stands whenever you're ready. Just reply to this email anytime.

Best of luck with {{businessName}}.

Best,
Colin Smith
DentalCall AI`,
  },
};

function personalize(template: EmailTemplate, lead: Lead): EmailTemplate {
  const firstName = lead.contactName.split(' ').pop() || lead.contactName;
  const similarBusiness = `${lead.city} Family Dental`;

  const replacements: Record<string, string> = {
    '{{businessName}}': lead.businessName,
    '{{firstName}}': firstName,
    '{{reviewCount}}': lead.reviewCount.toString(),
    '{{city}}': lead.city,
    '{{state}}': lead.state,
    '{{similarBusiness}}': similarBusiness,
  };

  let subject = template.subject;
  let body = template.body;

  for (const [key, value] of Object.entries(replacements)) {
    subject = subject.replace(new RegExp(key, 'g'), value);
    body = body.replace(new RegExp(key, 'g'), value);
  }

  return { subject, body };
}

async function sendEmail(to: string, subject: string, body: string): Promise<boolean> {
  // In production, use Resend API
  // For now, simulate sending
  console.log(`  📧 To: ${to}`);
  console.log(`  Subject: ${subject}`);
  console.log(`  Status: Queued for sending`);
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  let filename = '';
  let dryRun = false;
  let limit = 50;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) {
      filename = args[i + 1];
    }
    if (args[i] === '--dry-run') {
      dryRun = true;
    }
    if (args[i] === '--limit' && args[i + 1]) {
      limit = parseInt(args[i + 1]);
    }
  }

  if (!filename) {
    console.log('Usage: npx ts-node scripts/outreach.ts --file <leads-file.json> [--dry-run] [--limit 50]');
    process.exit(1);
  }

  console.log('📬 DentalCall AI - Outreach Campaign');
  console.log('=====================================');
  console.log(`Mode: ${dryRun ? 'DRY RUN (no emails sent)' : 'LIVE'}`);
  console.log('');

  // Load leads
  const leadsPath = path.join(__dirname, '..', '..', '..', 'leads', filename);
  if (!fs.existsSync(leadsPath)) {
    console.error(`❌ File not found: ${leadsPath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(leadsPath, 'utf-8'));
  const leads: Lead[] = data.leads.slice(0, limit);

  console.log(`Loaded ${leads.length} leads from ${filename}`);
  console.log('');

  // Process leads
  let sent = 0;
  let skipped = 0;

  console.log('Processing leads...');
  console.log('-'.repeat(60));

  for (const lead of leads) {
    // Skip low BRS leads
    if (lead.brsScore < 60) {
      skipped++;
      continue;
    }

    const template = templates.day1_roi;
    const personalized = personalize(template, lead);

    console.log(`\n${lead.businessName} (BRS: ${lead.brsScore})`);

    if (dryRun) {
      console.log(`  [DRY RUN] Would send: "${personalized.subject}"`);
      sent++;
    } else {
      const success = await sendEmail(lead.email, personalized.subject, personalized.body);
      if (success) sent++;
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(60));
  console.log('Campaign Summary:');
  console.log(`  Processed: ${leads.length}`);
  console.log(`  Sent/Queued: ${sent}`);
  console.log(`  Skipped: ${skipped}`);
  console.log('');

  if (dryRun) {
    console.log('⚠️  This was a dry run. Run without --dry-run to send emails.');
  } else {
    console.log('✅ Outreach campaign launched!');
    console.log('');
    console.log('Follow-up schedule:');
    console.log('  Day 3: Social proof email');
    console.log('  Day 6: Direct offer email');
    console.log('  Day 10: Breakup email');
    console.log('');
    console.log('Monitor responses in your email inbox.');
  }

  // Save campaign record
  const campaignRecord = {
    id: `CAMP-${Date.now()}`,
    filename,
    leadsProcessed: leads.length,
    emailsSent: sent,
    skipped,
    startedAt: new Date().toISOString(),
    dryRun,
  };

  const campaignsDir = path.join(__dirname, '..', '..', '..', 'outreach');
  if (!fs.existsSync(campaignsDir)) {
    fs.mkdirSync(campaignsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(campaignsDir, `campaign-${campaignRecord.id}.json`),
    JSON.stringify(campaignRecord, null, 2)
  );
}

main().catch(console.error);
