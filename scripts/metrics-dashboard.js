#!/usr/bin/env node
/**
 * MedSpa RevAI - Metrics Dashboard
 *
 * Tracks leads, customers, and revenue.
 * Run: node scripts/metrics-dashboard.js
 */

const fs = require('fs');
const path = require('path');

// Load environment
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const METRICS_FILE = path.join(__dirname, '../metrics/data.json');
const VAPI_KEY = process.env.VAPI_API_KEY || '8d85fe59-c0e2-49e7-a09a-e247ef5b8bd2';
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;

// Initialize metrics file
function initMetrics() {
    const dir = path.dirname(METRICS_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(METRICS_FILE)) {
        const initial = {
            leads: [],
            customers: [],
            calls: [],
            revenue: 0,
            lastUpdated: new Date().toISOString()
        };
        fs.writeFileSync(METRICS_FILE, JSON.stringify(initial, null, 2));
    }
    return JSON.parse(fs.readFileSync(METRICS_FILE, 'utf8'));
}

// Add a lead
function addLead(email, source = 'website') {
    const metrics = initMetrics();
    metrics.leads.push({
        email,
        source,
        createdAt: new Date().toISOString(),
        converted: false
    });
    metrics.lastUpdated = new Date().toISOString();
    fs.writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2));
    console.log(`✓ Lead added: ${email} (${source})`);
}

// Add a customer
function addCustomer(email, businessName, mrr = 497) {
    const metrics = initMetrics();

    // Mark lead as converted
    const lead = metrics.leads.find(l => l.email === email);
    if (lead) lead.converted = true;

    metrics.customers.push({
        email,
        businessName,
        mrr,
        createdAt: new Date().toISOString()
    });
    metrics.revenue += mrr;
    metrics.lastUpdated = new Date().toISOString();
    fs.writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2));
    console.log(`✓ Customer added: ${businessName} (+$${mrr} MRR)`);
}

// Fetch Vapi call stats
async function fetchVapiStats() {
    try {
        const response = await fetch('https://api.vapi.ai/call?limit=100', {
            headers: { 'Authorization': `Bearer ${VAPI_KEY}` }
        });
        const calls = await response.json();

        if (Array.isArray(calls)) {
            return {
                totalCalls: calls.length,
                avgDuration: calls.reduce((sum, c) => sum + (c.duration || 0), 0) / calls.length || 0,
                completedCalls: calls.filter(c => c.status === 'ended').length
            };
        }
    } catch (error) {
        console.error('Vapi fetch error:', error.message);
    }
    return { totalCalls: 0, avgDuration: 0, completedCalls: 0 };
}

// Print dashboard
async function printDashboard() {
    const metrics = initMetrics();
    const vapiStats = await fetchVapiStats();

    console.log('\n' + '='.repeat(60));
    console.log('📊 MEDSPA REVAI METRICS DASHBOARD');
    console.log('='.repeat(60) + '\n');

    // Revenue
    console.log('💰 REVENUE');
    console.log(`   MRR: $${metrics.revenue.toLocaleString()}`);
    console.log(`   Customers: ${metrics.customers.length}`);
    console.log('');

    // Leads
    const recentLeads = metrics.leads.filter(l => {
        const created = new Date(l.createdAt);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return created > weekAgo;
    });
    const convertedLeads = metrics.leads.filter(l => l.converted).length;
    const conversionRate = metrics.leads.length > 0
        ? ((convertedLeads / metrics.leads.length) * 100).toFixed(1)
        : 0;

    console.log('👥 LEADS');
    console.log(`   Total: ${metrics.leads.length}`);
    console.log(`   This Week: ${recentLeads.length}`);
    console.log(`   Converted: ${convertedLeads} (${conversionRate}%)`);
    console.log('');

    // Lead sources
    const sources = {};
    metrics.leads.forEach(l => {
        sources[l.source] = (sources[l.source] || 0) + 1;
    });
    console.log('📍 LEAD SOURCES');
    Object.entries(sources).forEach(([source, count]) => {
        console.log(`   ${source}: ${count}`);
    });
    console.log('');

    // Vapi stats
    console.log('📞 AI CALLS (Demo Line)');
    console.log(`   Total Calls: ${vapiStats.totalCalls}`);
    console.log(`   Completed: ${vapiStats.completedCalls}`);
    console.log(`   Avg Duration: ${Math.round(vapiStats.avgDuration)}s`);
    console.log('');

    // Customers
    if (metrics.customers.length > 0) {
        console.log('🏢 CUSTOMERS');
        metrics.customers.slice(-5).forEach(c => {
            console.log(`   - ${c.businessName} ($${c.mrr}/mo)`);
        });
        console.log('');
    }

    console.log('='.repeat(60));
    console.log(`Last updated: ${metrics.lastUpdated}`);
    console.log('='.repeat(60) + '\n');
}

// Main
const args = process.argv.slice(2);
const command = args[0] || 'show';

switch (command) {
    case 'show':
        printDashboard();
        break;
    case 'lead':
        if (args[1]) {
            addLead(args[1], args[2] || 'manual');
        } else {
            console.log('Usage: node metrics-dashboard.js lead <email> [source]');
        }
        break;
    case 'customer':
        if (args[1] && args[2]) {
            addCustomer(args[1], args[2], parseInt(args[3]) || 497);
        } else {
            console.log('Usage: node metrics-dashboard.js customer <email> <business_name> [mrr]');
        }
        break;
    default:
        console.log(`
Usage: node scripts/metrics-dashboard.js [command]

Commands:
  show                    - Show metrics dashboard (default)
  lead <email> [source]   - Add a lead
  customer <email> <name> - Add a customer
        `);
}
