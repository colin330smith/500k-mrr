#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_KEY = 're_SgtPyARk_3ucL6oz1a8RRKeE4kbHPcZSL';
const FROM = 'DentalCall AI <hello@localliftleads.com>';

function loadLeads() {
  const leadsDir = path.join(__dirname, '..', 'leads');
  let all = [];
  // Only NY and IL leads
  ['dental-ny-2026-01-03.json', 'dental-il-2026-01-03.json'].forEach(file => {
    const fp = path.join(leadsDir, file);
    if (fs.existsSync(fp)) {
      const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
      all = all.concat(data.leads || []);
    }
  });
  return all.filter(l => l.brsScore >= 60);
}

function send(lead) {
  const firstName = lead.contactName.split(' ').pop().replace('Dr. ', '');
  const practice = lead.businessName;

  let pain = lead.hasSchedulingComplaints ? "I noticed patients mentioning scheduling challenges in reviews." :
             lead.callForAppointment ? "I saw your practice requires phone calls to book." :
             lead.limitedHours ? "With your hours, you may miss after-hours calls." :
             "I believe we can help you capture more appointments.";

  const subject = `${practice} - Never miss another patient call`;
  const html = `<p>Hi Dr. ${firstName},</p>
<p>${pain}</p>
<p>We built <strong>DentalCall AI</strong> for practices like ${practice} – an AI receptionist that answers every call 24/7 and books appointments automatically.</p>
<p><strong>Results from early practices:</strong></p>
<ul><li>93% call answer rate (vs 67% industry avg)</li><li>35% more appointments booked</li><li>$47K+ recovered from after-hours calls</li></ul>
<p><a href="https://buy.stripe.com/dRm28t4K53AN3KK9uB67S06" style="background:#2563eb;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:600;display:inline-block;">Start Free 7-Day Trial →</a></p>
<p>Would 15 minutes work for a quick demo this week?</p>
<p>Best,<br>Alex Chen<br>Founder, DentalCall AI<br><a href="https://local-lift.onrender.com">dentalcall.ai</a></p>
<hr style="border:none;border-top:1px solid #eee;margin:30px 0">
<p style="font-size:12px;color:#666">Reply STOP to unsubscribe</p>`;

  const payload = JSON.stringify({ from: FROM, to: lead.email, subject, html }).replace(/'/g, "'\\''");

  try {
    const r = execSync(`curl -s --insecure -X POST https://api.resend.com/emails -H "Authorization: Bearer ${API_KEY}" -H "Content-Type: application/json" -d '${payload}'`, { encoding: 'utf8', timeout: 15000 });
    const j = JSON.parse(r);
    return j.id ? { ok: true, id: j.id } : { ok: false, err: j.message || j.error };
  } catch (e) { return { ok: false, err: e.message }; }
}

async function main() {
  console.log('\n🚀 SENDING TO NY/IL LEADS\n');
  const leads = loadLeads();
  console.log(`Found ${leads.length} qualified leads\n`);

  let sent = 0, fail = 0;
  const results = [];

  for (let i = 0; i < leads.length; i++) {
    const r = send(leads[i]);
    if (r.ok) {
      sent++;
      console.log(`✓ [${i+1}/${leads.length}] ${leads[i].email}`);
      results.push({ email: leads[i].email, status: 'sent', id: r.id });
    } else {
      fail++;
      console.log(`✗ [${i+1}/${leads.length}] ${leads[i].email} - ${r.err}`);
      results.push({ email: leads[i].email, status: 'failed', error: r.err });
      // If quota exceeded, stop trying
      if (r.err && r.err.includes('quota')) {
        console.log('\n⚠️ Quota exceeded - stopping');
        break;
      }
    }
    // Rate limit: 2/sec
    if (i % 2 === 1) await new Promise(r => setTimeout(r, 1100));
  }

  console.log(`\n✅ DONE: ${sent} sent, ${fail} failed\n`);
  fs.writeFileSync(path.join(__dirname, 'nyil-results.json'), JSON.stringify({ sent, fail, time: new Date().toISOString(), results }, null, 2));
}

main();
