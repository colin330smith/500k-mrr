#!/usr/bin/env node
/**
 * Lead & Outreach Tracking Dashboard
 * Run: node metrics/dashboard.js
 */
const fs = require('fs');
const path = require('path');

const LEADS_DIR = path.join(__dirname, '..', 'leads');
const OUTREACH_DIR = path.join(__dirname, '..', 'outreach');

function loadAllLeads() {
  let all = [];
  fs.readdirSync(LEADS_DIR).filter(f => f.endsWith('.json')).forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(LEADS_DIR, file), 'utf8'));
    const state = file.match(/dental-(\w+)-/)?.[1]?.toUpperCase() || 'UNK';
    (data.leads || []).forEach(l => {
      l.sourceFile = file;
      l.state = state;
      all.push(l);
    });
  });
  return all;
}

function loadTracker() {
  const trackerPath = path.join(OUTREACH_DIR, 'followup-tracker.json');
  if (fs.existsSync(trackerPath)) {
    return JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
  }
  return { day1: [], day3: [], day7: [], responded: [], converted: [] };
}

function loadBlastResults() {
  const resultsPath = path.join(OUTREACH_DIR, 'blast-results.json');
  if (fs.existsSync(resultsPath)) {
    return JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  }
  return { sent: 0, fail: 0 };
}

function printDashboard() {
  const leads = loadAllLeads();
  const tracker = loadTracker();
  const blast = loadBlastResults();

  console.log('\n' + '='.repeat(60));
  console.log('           DENTALCALL AI - SALES DASHBOARD');
  console.log('='.repeat(60) + '\n');

  // Lead Summary
  console.log('📊 LEAD SUMMARY');
  console.log('-'.repeat(40));
  console.log(`Total Leads:          ${leads.length}`);
  console.log(`High-Value (BRS≥80):  ${leads.filter(l => l.brsScore >= 80).length}`);
  console.log(`Qualified (BRS≥60):   ${leads.filter(l => l.brsScore >= 60).length}`);
  console.log('');

  // By State
  const byState = {};
  leads.forEach(l => {
    byState[l.state] = (byState[l.state] || 0) + 1;
  });
  console.log('📍 LEADS BY STATE');
  console.log('-'.repeat(40));
  Object.entries(byState).sort((a,b) => b[1] - a[1]).forEach(([state, count]) => {
    console.log(`${state}: ${count}`);
  });
  console.log('');

  // Outreach Status
  console.log('📧 OUTREACH STATUS');
  console.log('-'.repeat(40));
  console.log(`Emails Sent:          ${blast.sent}`);
  console.log(`Failed:               ${blast.fail}`);
  console.log(`Day 1 Follow-ups:     ${tracker.day1.length}`);
  console.log(`Day 3 Follow-ups:     ${tracker.day3.length}`);
  console.log(`Day 7 Follow-ups:     ${tracker.day7.length}`);
  console.log('');

  // Conversion Pipeline
  console.log('🎯 CONVERSION PIPELINE');
  console.log('-'.repeat(40));
  console.log(`Responded:            ${tracker.responded.length}`);
  console.log(`Converted to Trial:   ${tracker.converted.length}`);
  console.log(`Conversion Rate:      ${blast.sent > 0 ? ((tracker.converted.length / blast.sent) * 100).toFixed(2) : 0}%`);
  console.log('');

  // Revenue Projection
  const avgMRR = 599; // Professional tier
  const projectedTrials = Math.ceil(leads.filter(l => l.brsScore >= 60).length * 0.02); // 2% trial rate
  const projectedConversions = Math.ceil(projectedTrials * 0.25); // 25% trial-to-paid

  console.log('💰 REVENUE PROJECTION');
  console.log('-'.repeat(40));
  console.log(`Projected Trials:     ${projectedTrials}`);
  console.log(`Projected Customers:  ${projectedConversions}`);
  console.log(`Projected MRR:        $${(projectedConversions * avgMRR).toLocaleString()}`);
  console.log('');

  // Top Leads (highest BRS)
  console.log('⭐ TOP 10 HIGH-VALUE LEADS');
  console.log('-'.repeat(40));
  leads.sort((a,b) => b.brsScore - a.brsScore).slice(0, 10).forEach((l, i) => {
    const status = tracker.converted.includes(l.email) ? '✅' :
                   tracker.responded.includes(l.email) ? '📩' :
                   tracker.day7.includes(l.email) ? 'D7' :
                   tracker.day3.includes(l.email) ? 'D3' :
                   tracker.day1.includes(l.email) ? 'D1' : '⏳';
    console.log(`${i+1}. [${l.brsScore}] ${l.businessName} (${l.state}) ${status}`);
  });
  console.log('');

  // Next Actions
  console.log('📋 NEXT ACTIONS');
  console.log('-'.repeat(40));
  const needsDay1 = leads.filter(l => l.brsScore >= 60 && !tracker.day1.includes(l.email)).length;
  const needsDay3 = tracker.day1.filter(e => !tracker.day3.includes(e) && !tracker.responded.includes(e)).length;
  const needsDay7 = tracker.day3.filter(e => !tracker.day7.includes(e) && !tracker.responded.includes(e)).length;

  console.log(`1. Send Day 1 follow-up to ${needsDay1} leads`);
  console.log(`2. Send Day 3 follow-up to ${needsDay3} leads`);
  console.log(`3. Send Day 7 follow-up to ${needsDay7} leads`);
  console.log(`4. Generate more leads for untapped states`);
  console.log('');

  console.log('='.repeat(60));
  console.log(`Dashboard generated: ${new Date().toISOString()}`);
  console.log('='.repeat(60) + '\n');
}

printDashboard();
