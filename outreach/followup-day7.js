#!/usr/bin/env node
/**
 * Day 7 Follow-up: Urgency + direct offer
 * Run this 7 days after initial send
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_KEY = 're_SgtPyARk_3ucL6oz1a8RRKeE4kbHPcZSL';
const FROM = 'DentalCall AI <hello@localliftleads.com>';

function loadLeadsForDay7() {
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

  // Must have received day3, not yet day7, not responded/converted
  return allLeads.filter(l =>
    l.brsScore >= 60 &&
    tracker.day3.includes(l.email) &&
    !tracker.day7.includes(l.email) &&
    !tracker.responded.includes(l.email) &&
    !tracker.converted.includes(l.email)
  );
}

function sendDay7(lead) {
  const firstName = lead.contactName.split(' ').pop().replace('Dr. ', '');
  const practice = lead.businessName;

  const subject = `Last thought for ${practice}`;
  const html = `<p>Dr. ${firstName},</p>
<p>I'll keep this short — I know you're busy.</p>
<p>Every week that passes, ${practice} is likely missing 20-30 patient calls that go straight to competitors.</p>
<p>At $850+ per new patient, that's <strong>$17,000-25,000/month</strong> walking out the door.</p>
<p>I'm not going to keep following up. But if you ever want to stop the leak:</p>
<div style="background:#f0f9ff;border:2px solid #2563eb;padding:20px;border-radius:8px;margin:20px 0;">
<p style="margin:0 0 10px 0;font-weight:600;font-size:18px;">🎁 Offer for ${practice}:</p>
<ul style="margin:10px 0;">
<li><strong>7-day free trial</strong> — no card required</li>
<li><strong>Setup in 15 minutes</strong> — we handle everything</li>
<li><strong>Money-back guarantee</strong> — if it doesn't add patients, don't pay</li>
</ul>
<p style="margin:0;"><a href="https://buy.stripe.com/dRm28t4K53AN3KK9uB67S06" style="background:#2563eb;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">Start Free Trial →</a></p>
</div>
<p>Either way, wishing ${practice} continued success.</p>
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
  console.log('\n📧 DAY 7 FOLLOW-UP: FINAL OFFER\n');

  const leads = loadLeadsForDay7().slice(0, 50);
  console.log(`Found ${leads.length} leads for Day 7 follow-up\n`);

  if (leads.length === 0) {
    console.log('No leads need Day 7 follow-up');
    return;
  }

  const trackerPath = path.join(__dirname, 'followup-tracker.json');
  let tracker = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));

  let sent = 0, fail = 0;

  for (let i = 0; i < leads.length; i++) {
    const r = sendDay7(leads[i]);
    if (r.ok) {
      sent++;
      tracker.day7.push(leads[i].email);
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
  console.log(`\n✅ Day 7 complete: ${sent} sent, ${fail} failed\n`);
}

main();
