#!/usr/bin/env node
/**
 * Day 1 Follow-up: Quick value bump for those who opened but didn't respond
 * Run this 24 hours after initial send
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_KEY = 're_SgtPyARk_3ucL6oz1a8RRKeE4kbHPcZSL';
const FROM = 'DentalCall AI <hello@localliftleads.com>';

// Load leads that need Day 1 follow-up
function loadLeadsForFollowup() {
  const resultsPath = path.join(__dirname, 'blast-results.json');
  const trackerPath = path.join(__dirname, 'followup-tracker.json');

  // Load all leads
  const leadsDir = path.join(__dirname, '..', 'leads');
  let allLeads = [];
  fs.readdirSync(leadsDir).filter(f => f.endsWith('.json')).forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(leadsDir, file), 'utf8'));
    allLeads = allLeads.concat(data.leads || []);
  });

  // Load tracker to see who already got follow-up
  let tracker = { day1: [], day3: [], day7: [], responded: [], converted: [] };
  if (fs.existsSync(trackerPath)) {
    tracker = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
  }

  // Filter: BRS >= 60, not in day1 list, not responded
  return allLeads.filter(l =>
    l.brsScore >= 60 &&
    !tracker.day1.includes(l.email) &&
    !tracker.responded.includes(l.email) &&
    !tracker.converted.includes(l.email)
  );
}

function sendFollowup(lead) {
  const firstName = lead.contactName.split(' ').pop().replace('Dr. ', '');
  const practice = lead.businessName;

  const subject = `Re: ${practice} - quick thought`;
  const html = `<p>Hi Dr. ${firstName},</p>
<p>Quick follow-up — I ran the numbers for practices similar to ${practice}:</p>
<p style="background:#f8f9fa;padding:15px;border-left:4px solid #2563eb;">
<strong>Average miss rate:</strong> 32%<br>
<strong>Your estimated monthly loss:</strong> $15,000-25,000<br>
<strong>Recovery potential:</strong> 70%+ of missed calls captured
</p>
<p>Most practice owners don't realize it's happening until they track it.</p>
<p>Would a 15-min call be worth exploring if we could add $10K+/month in recovered revenue?</p>
<p>Just hit reply with "interested" and I'll send times.</p>
<p>Best,<br>Alex</p>
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
  console.log('\n📧 DAY 1 FOLLOW-UP SEQUENCE\n');

  const leads = loadLeadsForFollowup().slice(0, 50); // Max 50 per run
  console.log(`Found ${leads.length} leads for Day 1 follow-up\n`);

  if (leads.length === 0) {
    console.log('No leads need Day 1 follow-up');
    return;
  }

  const trackerPath = path.join(__dirname, 'followup-tracker.json');
  let tracker = { day1: [], day3: [], day7: [], responded: [], converted: [] };
  if (fs.existsSync(trackerPath)) {
    tracker = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
  }

  let sent = 0, fail = 0;

  for (let i = 0; i < leads.length; i++) {
    const r = sendFollowup(leads[i]);
    if (r.ok) {
      sent++;
      tracker.day1.push(leads[i].email);
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
  console.log(`\n✅ Day 1 complete: ${sent} sent, ${fail} failed\n`);
}

main();
