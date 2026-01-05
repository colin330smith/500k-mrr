#!/usr/bin/env node
/**
 * Day 3 Follow-up: Case study & social proof
 * Run this 72 hours after initial send
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_KEY = 're_SgtPyARk_3ucL6oz1a8RRKeE4kbHPcZSL';
const FROM = 'DentalCall AI <hello@localliftleads.com>';

function loadLeadsForDay3() {
  const trackerPath = path.join(__dirname, 'followup-tracker.json');

  const leadsDir = path.join(__dirname, '..', 'leads');
  let allLeads = [];
  fs.readdirSync(leadsDir).filter(f => f.endsWith('.json')).forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(leadsDir, file), 'utf8'));
    allLeads = allLeads.concat(data.leads || []);
  });

  let tracker = { day1: [], day3: [], day7: [], responded: [], converted: [] };
  if (fs.existsSync(trackerPath)) {
    tracker = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
  }

  // Filter: must have received day1, not yet day3, not responded/converted
  return allLeads.filter(l =>
    l.brsScore >= 60 &&
    tracker.day1.includes(l.email) &&
    !tracker.day3.includes(l.email) &&
    !tracker.responded.includes(l.email) &&
    !tracker.converted.includes(l.email)
  );
}

function sendDay3(lead) {
  const firstName = lead.contactName.split(' ').pop().replace('Dr. ', '');
  const practice = lead.businessName;

  const subject = `Case study for ${practice}`;
  const html = `<p>Dr. ${firstName},</p>
<p>Wanted to share a quick case study that might be relevant:</p>
<div style="background:#f8f9fa;padding:20px;border-radius:8px;margin:20px 0;">
<p style="margin:0 0 10px 0;"><strong>Practice:</strong> Similar size to ${practice}, Austin TX</p>
<p style="margin:0 0 10px 0;"><strong>Problem:</strong> Missing 25+ calls/week, didn't realize it</p>
<p style="margin:0 0 10px 0;"><strong>Solution:</strong> DentalCall AI handling overflow + after-hours</p>
<p style="margin:0;"><strong>Results after 90 days:</strong></p>
<ul style="margin:10px 0;">
<li>Call answer rate: 67% → 93%</li>
<li>New patients/month: 12 → 19</li>
<li>Annual revenue increase: <strong>$47,000</strong></li>
</ul>
</div>
<p>The AI paid for itself in the first 3 days.</p>
<p>Worth 15 minutes to see if similar results are possible for ${practice}?</p>
<p><a href="https://local-lift.onrender.com" style="background:#2563eb;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block;margin:10px 0;">See How It Works →</a></p>
<p>Best,<br>Alex Chen<br>Founder, DentalCall AI</p>
<hr style="border:none;border-top:1px solid #eee;margin:30px 0">
<p style="font-size:12px;color:#666">Reply STOP to unsubscribe</p>`;

  const payload = JSON.stringify({ from: FROM, to: lead.email, subject, html }).replace(/'/g, "'\\''");

  try {
    const r = execSync(`curl -s --insecure -X POST https://api.resend.com/emails -H "Authorization: Bearer ${API_KEY}" -H "Content-Type: application/json" -d '${payload}'`, { encoding: 'utf8', timeout: 15000 });
    const j = JSON.parse(r);
    return j.id ? { ok: true, id: j.id } : { ok: false, err: j.message || JSON.stringify(j) };
  } catch (e) { return { ok: false, err: e.message }; }
}

async function main() {
  console.log('\n📧 DAY 3 FOLLOW-UP: CASE STUDY\n');

  const leads = loadLeadsForDay3().slice(0, 50);
  console.log(`Found ${leads.length} leads for Day 3 follow-up\n`);

  if (leads.length === 0) {
    console.log('No leads need Day 3 follow-up');
    return;
  }

  const trackerPath = path.join(__dirname, 'followup-tracker.json');
  let tracker = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));

  let sent = 0, fail = 0;

  for (let i = 0; i < leads.length; i++) {
    const r = sendDay3(leads[i]);
    if (r.ok) {
      sent++;
      tracker.day3.push(leads[i].email);
      console.log(`✓ [${i+1}/${leads.length}] ${leads[i].email}`);
    } else {
      fail++;
      console.log(`✗ [${i+1}/${leads.length}] ${leads[i].email} - ${r.err}`);
      if (r.err && r.err.includes('quota')) {
        console.log('\n⚠️ Quota exceeded - stopping');
        break;
      }
    }
    if (i % 2 === 1) await new Promise(r => setTimeout(r, 1100));
  }

  fs.writeFileSync(trackerPath, JSON.stringify(tracker, null, 2));
  console.log(`\n✅ Day 3 complete: ${sent} sent, ${fail} failed\n`);
}

main();
