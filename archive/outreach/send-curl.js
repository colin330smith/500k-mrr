#!/usr/bin/env node
/**
 * DentalCall AI - Email Outreach via curl
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'DentalCall AI <onboarding@resend.dev>';

function loadLeads() {
  const leadsDir = path.join(__dirname, '..', 'leads');
  const files = fs.readdirSync(leadsDir).filter(f => f.endsWith('.json'));
  let allLeads = [];
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(leadsDir, file), 'utf8'));
    allLeads = allLeads.concat(data.leads || []);
  }
  return allLeads.filter(lead => lead.brsScore >= 60);
}

function generateEmail(lead) {
  const firstName = lead.contactName.split(' ').pop().replace('Dr. ', '');
  const practiceName = lead.businessName;

  let painPoint = '';
  if (lead.hasSchedulingComplaints) {
    painPoint = "I noticed some patients mentioned scheduling challenges in reviews.";
  } else if (lead.callForAppointment) {
    painPoint = "I saw your practice requires phone calls for appointments.";
  } else if (lead.limitedHours) {
    painPoint = "With your current hours, you might be missing after-hours calls.";
  } else {
    painPoint = "I believe we can help you capture more appointments.";
  }

  const subject = `${practiceName} - Never miss another patient call`;

  const html = `<p>Hi Dr. ${firstName},</p>
<p>${painPoint}</p>
<p>We built <strong>DentalCall AI</strong> for practices like ${practiceName} – an AI receptionist that answers every call 24/7, books appointments, and handles patient inquiries.</p>
<p><strong>Results our practices see:</strong></p>
<ul>
<li>93% call answer rate (vs. 67% industry average)</li>
<li>35% increase in booked appointments</li>
<li>$47,000+ annual revenue from after-hours calls</li>
</ul>
<p><a href="https://buy.stripe.com/dRm28t4K53AN3KK9uB67S06" style="background:#2563eb;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">Start Your Free 7-Day Trial →</a></p>
<p>Would you have 15 minutes this week for a quick demo?</p>
<p>Best,<br>Alex Chen<br>Founder, DentalCall AI</p>`;

  return { subject, html };
}

function sendEmail(lead) {
  const { subject, html } = generateEmail(lead);

  const payload = JSON.stringify({
    from: FROM_EMAIL,
    to: lead.email,
    subject: subject,
    html: html
  }).replace(/'/g, "'\\''");

  try {
    const result = execSync(`curl -s -X POST https://api.resend.com/emails \
      -H "Authorization: Bearer ${API_KEY}" \
      -H "Content-Type: application/json" \
      -d '${payload}'`, { encoding: 'utf8', timeout: 10000 });

    const json = JSON.parse(result);
    if (json.id) {
      return { success: true, id: json.id };
    } else {
      return { success: false, error: json.message || 'Unknown error' };
    }
  } catch (e) {
    return { success: false, error: e.message };
  }
}

async function main() {
  console.log('============================================================');
  console.log('DentalCall AI - Email Outreach Campaign');
  console.log('============================================================\n');

  const leads = loadLeads();
  console.log(`Loaded ${leads.length} qualified leads\n`);

  let sent = 0, failed = 0;
  const results = [];

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    const result = sendEmail(lead);

    if (result.success) {
      sent++;
      console.log(`✓ [${i+1}/${leads.length}] ${lead.email}`);
    } else {
      failed++;
      console.log(`✗ [${i+1}/${leads.length}] ${lead.email} - ${result.error}`);
    }

    results.push({ email: lead.email, ...result });

    // Small delay to avoid rate limiting
    if (i % 10 === 9) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log('\n============================================================');
  console.log(`COMPLETE: ${sent} sent, ${failed} failed`);
  console.log('============================================================');

  fs.writeFileSync(
    path.join(__dirname, `results-${new Date().toISOString().split('T')[0]}.json`),
    JSON.stringify({ sent, failed, results }, null, 2)
  );
}

main();
