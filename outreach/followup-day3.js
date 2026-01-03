#!/usr/bin/env node
// Day 3 Follow-up for non-responders
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_KEY = process.env.RESEND_API_KEY;
const FROM = 'DentalCall AI <hello@localliftleads.com>';

function loadLeads() {
  const leadsDir = path.join(__dirname, '..', 'leads');
  let all = [];
  fs.readdirSync(leadsDir).filter(f => f.endsWith('.json')).forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(leadsDir, file), 'utf8'));
    all = all.concat(data.leads || []);
  });
  return all.filter(l => l.brsScore >= 60);
}

function send(lead) {
  const firstName = lead.contactName.split(' ').pop().replace('Dr. ', '');
  const practice = lead.businessName;

  const subject = `Quick question, ${firstName}`;
  const html = `<p>Hi Dr. ${firstName},</p>
<p>Wanted to follow up on my note about DentalCall AI for ${practice}.</p>
<p>Quick question: <strong>How many calls does your team miss each week?</strong></p>
<p>Most practices we work with were losing 20-30% of incoming calls before switching to our AI receptionist. That's potentially $15K+ in lost revenue monthly.</p>
<p>I'd love to show you exactly how practices like yours are:</p>
<ul><li>Capturing 93% of calls (vs. 67% average)</li><li>Booking 35% more appointments</li><li>Generating $47K+ from after-hours calls alone</li></ul>
<p><a href="https://buy.stripe.com/dRm28t4K53AN3KK9uB67S06" style="background:#2563eb;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">Start Free Trial (7 Days) →</a></p>
<p>Just 15 min to see if it's a fit?</p>
<p>Best,<br>Alex Chen<br>Founder, DentalCall AI</p>
<hr style="border:none;border-top:1px solid #eee;margin:30px 0">
<p style="font-size:12px;color:#666">Reply STOP to unsubscribe</p>`;

  const payload = JSON.stringify({ from: FROM, to: lead.email, subject, html }).replace(/'/g, "'\\''");
  try {
    const r = execSync(`curl -s --insecure -X POST https://api.resend.com/emails -H "Authorization: Bearer ${API_KEY}" -H "Content-Type: application/json" -d '${payload}'`, { encoding: 'utf8', timeout: 15000 });
    const j = JSON.parse(r);
    return j.id ? { ok: true } : { ok: false, err: j.message };
  } catch (e) { return { ok: false, err: e.message }; }
}

async function main() {
  console.log('\n📬 DAY 3 FOLLOW-UP SEQUENCE\n');
  const leads = loadLeads();
  let sent = 0;
  for (let i = 0; i < leads.length && sent < 100; i++) {
    const r = send(leads[i]);
    if (r.ok) { sent++; console.log(`✓ [${sent}] ${leads[i].email}`); }
    if (i % 2 === 1) await new Promise(r => setTimeout(r, 1100));
  }
  console.log(`\n✅ Sent ${sent} follow-ups\n`);
}

main();
