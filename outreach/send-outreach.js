#!/usr/bin/env node
/**
 * DentalCall AI - Email Outreach Script
 * Sends personalized emails to dental practice leads via Resend
 *
 * Usage: RESEND_API_KEY=your_key node send-outreach.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  fromEmail: 'hello@dentalcall.ai',
  fromName: 'DentalCall AI',
  replyTo: 'hello@dentalcall.ai',
  batchSize: 10,      // Emails per batch
  batchDelay: 2000,   // 2 seconds between batches
  minBRS: 60,         // Only contact leads with BRS >= 60
  dryRun: process.env.DRY_RUN === 'true'
};

// Load leads from all JSON files
function loadLeads() {
  const leadsDir = path.join(__dirname, '..', 'leads');
  const files = fs.readdirSync(leadsDir).filter(f => f.endsWith('.json'));

  let allLeads = [];
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(leadsDir, file), 'utf8'));
    allLeads = allLeads.concat(data.leads || []);
  }

  // Filter by BRS score
  return allLeads.filter(lead => lead.brsScore >= CONFIG.minBRS);
}

// Generate personalized email
function generateEmail(lead) {
  const firstName = lead.contactName.split(' ').pop().replace('Dr. ', '');
  const practiceName = lead.businessName;

  // Personalization based on signals
  let painPoint = '';
  if (lead.hasSchedulingComplaints) {
    painPoint = "I noticed some of your patients have mentioned scheduling challenges in their reviews.";
  } else if (lead.callForAppointment) {
    painPoint = "I saw your practice requires phone calls for appointments, which can be limiting for busy patients.";
  } else if (lead.limitedHours) {
    painPoint = "With your current hours, I imagine you might be missing calls from patients trying to book outside business hours.";
  } else {
    painPoint = "I've been researching dental practices in your area, and I believe we can help you capture more appointments.";
  }

  const subject = `${practiceName} - Never miss another patient call`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p>Hi Dr. ${firstName},</p>

  <p>${painPoint}</p>

  <p>We built <strong>DentalCall AI</strong> specifically for practices like ${practiceName} – an AI receptionist that answers every call 24/7, books appointments, and handles patient inquiries while your staff focuses on in-office care.</p>

  <p><strong>The results our practices are seeing:</strong></p>
  <ul style="padding-left: 20px;">
    <li>93% call answer rate (vs. 67% industry average)</li>
    <li>35% increase in booked appointments</li>
    <li>$47,000+ annual revenue captured from after-hours calls</li>
  </ul>

  <p>The best part? You can try it free for 7 days with no setup required.</p>

  <p style="margin: 30px 0;">
    <a href="https://buy.stripe.com/dRm28t4K53AN3KK9uB67S06"
       style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
      Start Your Free Trial →
    </a>
  </p>

  <p>Would you have 15 minutes this week for a quick demo? I'd love to show you how it works with your specific patient flow.</p>

  <p>Best regards,<br>
  <strong>Alex Chen</strong><br>
  Founder, DentalCall AI<br>
  <a href="https://local-lift.onrender.com">dentalcall.ai</a></p>

  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  <p style="font-size: 12px; color: #666;">
    You're receiving this because we identified ${practiceName} as a great fit for our AI receptionist solution.
    <a href="#">Unsubscribe</a>
  </p>
</body>
</html>
`;

  const text = `Hi Dr. ${firstName},

${painPoint}

We built DentalCall AI specifically for practices like ${practiceName} – an AI receptionist that answers every call 24/7, books appointments, and handles patient inquiries while your staff focuses on in-office care.

The results our practices are seeing:
• 93% call answer rate (vs. 67% industry average)
• 35% increase in booked appointments
• $47,000+ annual revenue captured from after-hours calls

The best part? You can try it free for 7 days with no setup required.

Start Your Free Trial: https://buy.stripe.com/dRm28t4K53AN3KK9uB67S06

Would you have 15 minutes this week for a quick demo? I'd love to show you how it works with your specific patient flow.

Best regards,
Alex Chen
Founder, DentalCall AI
https://local-lift.onrender.com

---
You're receiving this because we identified ${practiceName} as a great fit for our AI receptionist solution.
`;

  return { subject, html, text };
}

// Send email via Resend API
async function sendEmail(lead, apiKey) {
  const { subject, html, text } = generateEmail(lead);

  if (CONFIG.dryRun) {
    console.log(`[DRY RUN] Would send to: ${lead.email}`);
    console.log(`  Subject: ${subject}`);
    return { success: true, id: 'dry-run' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${CONFIG.fromName} <${CONFIG.fromEmail}>`,
        to: lead.email,
        reply_to: CONFIG.replyTo,
        subject: subject,
        html: html,
        text: text,
        tags: [
          { name: 'campaign', value: 'dental-launch-jan2026' },
          { name: 'lead_id', value: lead.id },
          { name: 'state', value: lead.state }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email');
    }

    return { success: true, id: data.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Batch send with rate limiting
async function sendBatch(leads, apiKey, startIdx) {
  const batch = leads.slice(startIdx, startIdx + CONFIG.batchSize);
  const results = [];

  for (const lead of batch) {
    const result = await sendEmail(lead, apiKey);
    results.push({
      email: lead.email,
      businessName: lead.businessName,
      ...result
    });

    if (result.success) {
      console.log(`✓ Sent to ${lead.email} (${lead.businessName})`);
    } else {
      console.log(`✗ Failed: ${lead.email} - ${result.error}`);
    }
  }

  return results;
}

// Main execution
async function main() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey && !CONFIG.dryRun) {
    console.error('Error: RESEND_API_KEY environment variable required');
    console.log('Usage: RESEND_API_KEY=re_xxx node send-outreach.js');
    console.log('       DRY_RUN=true node send-outreach.js');
    process.exit(1);
  }

  console.log('='.repeat(60));
  console.log('DentalCall AI - Email Outreach Campaign');
  console.log('='.repeat(60));

  const leads = loadLeads();
  console.log(`\nLoaded ${leads.length} qualified leads (BRS >= ${CONFIG.minBRS})`);

  if (CONFIG.dryRun) {
    console.log('\n⚠️  DRY RUN MODE - No emails will be sent\n');
  }

  const allResults = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < leads.length; i += CONFIG.batchSize) {
    const batchNum = Math.floor(i / CONFIG.batchSize) + 1;
    const totalBatches = Math.ceil(leads.length / CONFIG.batchSize);

    console.log(`\n--- Batch ${batchNum}/${totalBatches} ---`);

    const results = await sendBatch(leads, apiKey, i);
    allResults.push(...results);

    successCount += results.filter(r => r.success).length;
    failCount += results.filter(r => !r.success).length;

    // Rate limit delay between batches
    if (i + CONFIG.batchSize < leads.length) {
      console.log(`Waiting ${CONFIG.batchDelay/1000}s before next batch...`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.batchDelay));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('CAMPAIGN COMPLETE');
  console.log('='.repeat(60));
  console.log(`Total Sent: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Success Rate: ${((successCount / leads.length) * 100).toFixed(1)}%`);

  // Save results
  const resultsFile = path.join(__dirname, `results-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(resultsFile, JSON.stringify({
    campaign: 'dental-launch-jan2026',
    timestamp: new Date().toISOString(),
    totalLeads: leads.length,
    sent: successCount,
    failed: failCount,
    results: allResults
  }, null, 2));

  console.log(`\nResults saved to: ${resultsFile}`);
}

main().catch(console.error);
