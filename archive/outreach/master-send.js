#!/usr/bin/env node
/**
 * Master Email Sender - Sends to ALL qualified leads
 * Handles rate limits, tracks progress, retries on failures
 * Run: node outreach/master-send.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_KEY = 're_SgtPyARk_3ucL6oz1a8RRKeE4kbHPcZSL';
const FROM = 'DentalCall AI <hello@localliftleads.com>';
const SENT_LOG = path.join(__dirname, 'sent-log.json');

function loadSentLog() {
  if (fs.existsSync(SENT_LOG)) {
    return JSON.parse(fs.readFileSync(SENT_LOG, 'utf8'));
  }
  return { sent: [], failed: [], lastRun: null };
}

function saveSentLog(log) {
  log.lastRun = new Date().toISOString();
  fs.writeFileSync(SENT_LOG, JSON.stringify(log, null, 2));
}

function loadAllLeads() {
  const leadsDir = path.join(__dirname, '..', 'leads');
  let all = [];
  fs.readdirSync(leadsDir).filter(f => f.endsWith('.json')).forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(leadsDir, file), 'utf8'));
    all = all.concat(data.leads || []);
  });
  return all.filter(l => l.brsScore >= 60);
}

function sendEmail(lead) {
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
    if (j.id) return { ok: true, id: j.id };
    return { ok: false, err: j.message || JSON.stringify(j), quota: j.message?.includes('quota') };
  } catch (e) {
    return { ok: false, err: e.message, quota: e.message?.includes('quota') };
  }
}

async function main() {
  console.log('\n🚀 MASTER EMAIL SENDER\n');

  const log = loadSentLog();
  const allLeads = loadAllLeads();

  // Filter out already sent
  const toSend = allLeads.filter(l => !log.sent.includes(l.email));

  console.log(`Total qualified leads: ${allLeads.length}`);
  console.log(`Already sent: ${log.sent.length}`);
  console.log(`To send this run: ${toSend.length}\n`);

  if (toSend.length === 0) {
    console.log('✅ All leads have been contacted!');
    return;
  }

  let sentThisRun = 0;
  let failedThisRun = 0;

  for (let i = 0; i < toSend.length; i++) {
    const lead = toSend[i];
    const result = sendEmail(lead);

    if (result.ok) {
      log.sent.push(lead.email);
      sentThisRun++;
      console.log(`✓ [${i+1}/${toSend.length}] ${lead.email} (${lead.businessName})`);
    } else {
      console.log(`✗ [${i+1}/${toSend.length}] ${lead.email} - ${result.err}`);

      if (result.quota) {
        console.log('\n⚠️ QUOTA EXCEEDED - Saving progress and stopping');
        console.log(`Sent this run: ${sentThisRun}`);
        console.log(`Remaining: ${toSend.length - i - 1}`);
        saveSentLog(log);
        console.log('\n📊 Run again later when quota resets\n');
        return;
      }

      if (!log.failed.includes(lead.email)) {
        log.failed.push(lead.email);
      }
      failedThisRun++;
    }

    // Save progress every 10 emails
    if (i % 10 === 0) saveSentLog(log);

    // Rate limiting: 2 emails per second
    if (i % 2 === 1) await new Promise(r => setTimeout(r, 1100));
  }

  saveSentLog(log);

  console.log('\n✅ BATCH COMPLETE');
  console.log(`Sent this run: ${sentThisRun}`);
  console.log(`Failed this run: ${failedThisRun}`);
  console.log(`Total sent all time: ${log.sent.length}`);
  console.log('');
}

main();
