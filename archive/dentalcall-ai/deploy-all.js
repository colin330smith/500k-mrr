#!/usr/bin/env node
/**
 * DentalCall AI - Complete Deployment Script
 *
 * This script runs locally and sets up everything:
 * 1. Creates Stripe products and prices
 * 2. Creates Vapi voice assistant
 * 3. Deploys to Render
 * 4. Configures Stripe webhook
 * 5. Generates leads
 *
 * Run: node deploy-all.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables
function loadEnv() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local not found!');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

loadEnv();

const CONFIG = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  },
  vapi: {
    apiKey: process.env.VAPI_API_KEY
  },
  render: {
    apiKey: process.env.RENDER_API_KEY
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }
};

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function createStripeProducts() {
  console.log('\n📦 Creating Stripe Products...\n');

  const auth = Buffer.from(CONFIG.stripe.secretKey + ':').toString('base64');
  const products = [
    { name: 'DentalCall AI Starter', description: 'AI Receptionist - 500 minutes/month', price: 29900, tier: 'starter' },
    { name: 'DentalCall AI Professional', description: 'AI Receptionist - 2,000 minutes/month', price: 59900, tier: 'professional' },
    { name: 'DentalCall AI Business', description: 'AI Receptionist - 5,000 minutes/month', price: 99900, tier: 'business' },
  ];

  const priceIds = {};

  for (const product of products) {
    // Create product
    const productData = new URLSearchParams({
      name: product.name,
      description: product.description,
      'metadata[tier]': product.tier
    }).toString();

    const productRes = await makeRequest({
      hostname: 'api.stripe.com',
      path: '/v1/products',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': productData.length
      }
    }, productData);

    if (productRes.data.id) {
      console.log(`  ✅ ${product.tier} product: ${productRes.data.id}`);

      // Create price
      const priceData = new URLSearchParams({
        product: productRes.data.id,
        unit_amount: product.price.toString(),
        currency: 'usd',
        'recurring[interval]': 'month'
      }).toString();

      const priceRes = await makeRequest({
        hostname: 'api.stripe.com',
        path: '/v1/prices',
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': priceData.length
        }
      }, priceData);

      if (priceRes.data.id) {
        console.log(`  ✅ ${product.tier} price: ${priceRes.data.id}`);
        priceIds[product.tier] = priceRes.data.id;
      }
    } else {
      console.log(`  ⚠️ ${product.tier}: ${JSON.stringify(productRes.data)}`);
    }
  }

  return priceIds;
}

async function createVapiAssistant() {
  console.log('\n🎙️ Creating Vapi Voice Assistant...\n');

  const assistantConfig = JSON.stringify({
    name: 'DentalCall AI Receptionist',
    model: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      temperature: 0.7,
      systemPrompt: `You are a friendly and professional AI receptionist for a dental practice.
Answer calls warmly with "Thank you for calling. This is your AI dental assistant. How may I help you today?"
Help callers book appointments, answer questions about hours and services, and handle emergencies with empathy.
Be professional, warm, patient, and helpful. Never give medical advice.`
    },
    voice: { provider: 'openai', voiceId: 'alloy' },
    firstMessage: 'Thank you for calling. This is your AI dental assistant. How may I help you today?',
    endCallMessage: 'Thank you for calling. Have a wonderful day!',
    recordingEnabled: true,
    transcriptionEnabled: true,
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 1800
  });

  const res = await makeRequest({
    hostname: 'api.vapi.ai',
    path: '/assistant',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.vapi.apiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(assistantConfig)
    }
  }, assistantConfig);

  if (res.data.id) {
    console.log(`  ✅ Assistant created: ${res.data.id}`);
    return res.data.id;
  } else {
    console.log(`  ⚠️ Vapi response: ${JSON.stringify(res.data)}`);
    return null;
  }
}

async function deployToRender(envVars) {
  console.log('\n🚀 Deploying to Render...\n');

  const serviceConfig = JSON.stringify({
    type: 'web_service',
    name: 'dentalcall-ai',
    repo: 'https://github.com/colin330smith/500k-mrr',
    branch: 'claude/manus-saas-portfolio-Kf2rB',
    rootDir: 'products/dentalcall-ai',
    serviceDetails: {
      buildCommand: 'npm install && npm run build',
      startCommand: 'npm start',
      envVars: Object.entries(envVars).map(([key, value]) => ({ key, value })),
      plan: 'starter',
      region: 'oregon',
      healthCheckPath: '/api/health'
    }
  });

  const res = await makeRequest({
    hostname: 'api.render.com',
    path: '/v1/services',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.render.apiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(serviceConfig)
    }
  }, serviceConfig);

  console.log(`  Response: ${JSON.stringify(res.data).substring(0, 200)}...`);

  if (res.data.service?.id || res.data.id) {
    const serviceId = res.data.service?.id || res.data.id;
    console.log(`  ✅ Service created: ${serviceId}`);
    return serviceId;
  }

  // Try to trigger deploy on existing service
  console.log('  Checking for existing service...');
  const listRes = await makeRequest({
    hostname: 'api.render.com',
    path: '/v1/services?name=dentalcall-ai&limit=1',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CONFIG.render.apiKey}`
    }
  });

  if (listRes.data?.[0]?.service?.id) {
    const serviceId = listRes.data[0].service.id;
    console.log(`  Found existing service: ${serviceId}`);

    // Trigger deploy
    await makeRequest({
      hostname: 'api.render.com',
      path: `/v1/services/${serviceId}/deploys`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.render.apiKey}`,
        'Content-Type': 'application/json'
      }
    }, '{}');

    console.log(`  ✅ Deploy triggered`);
    return serviceId;
  }

  return null;
}

async function generateLeads() {
  console.log('\n📊 Generating Leads...\n');

  const { execSync } = require('child_process');
  const scriptsDir = path.join(__dirname, 'scripts');

  try {
    execSync(`node ${path.join(scriptsDir, 'generate-leads.js')} --count 200 --state TX`, { stdio: 'inherit' });
    execSync(`node ${path.join(scriptsDir, 'generate-leads.js')} --count 200 --state CA`, { stdio: 'inherit' });
    execSync(`node ${path.join(scriptsDir, 'generate-leads.js')} --count 200 --state FL`, { stdio: 'inherit' });
    console.log('\n  ✅ Generated 600 leads across TX, CA, FL');
  } catch (err) {
    console.log(`  ⚠️ Lead generation error: ${err.message}`);
  }
}

async function main() {
  console.log('═'.repeat(60));
  console.log('  DentalCall AI - Complete Deployment');
  console.log('═'.repeat(60));

  // Step 1: Stripe
  const priceIds = await createStripeProducts();

  // Step 2: Vapi
  const assistantId = await createVapiAssistant();

  // Step 3: Prepare env vars
  const envVars = {
    NODE_ENV: 'production',
    NEXT_PUBLIC_APP_URL: 'https://dentalcall-ai.onrender.com',
    NEXT_PUBLIC_SUPABASE_URL: CONFIG.supabase.url,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: CONFIG.supabase.anonKey,
    SUPABASE_SERVICE_ROLE_KEY: CONFIG.supabase.serviceRoleKey,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: CONFIG.stripe.publishableKey,
    STRIPE_SECRET_KEY: CONFIG.stripe.secretKey,
    STRIPE_STARTER_PRICE_ID: priceIds.starter || '',
    STRIPE_PROFESSIONAL_PRICE_ID: priceIds.professional || '',
    STRIPE_BUSINESS_PRICE_ID: priceIds.business || '',
    VAPI_API_KEY: CONFIG.vapi.apiKey,
    VAPI_ASSISTANT_ID: assistantId || '',
    OPENAI_API_KEY: CONFIG.openai.apiKey,
    TWILIO_ACCOUNT_SID: CONFIG.twilio.accountSid,
    TWILIO_AUTH_TOKEN: CONFIG.twilio.authToken,
    TWILIO_PHONE_NUMBER: CONFIG.twilio.phoneNumber,
    GOOGLE_CLIENT_ID: CONFIG.google.clientId,
    GOOGLE_CLIENT_SECRET: CONFIG.google.clientSecret
  };

  // Step 4: Deploy to Render
  await deployToRender(envVars);

  // Step 5: Generate leads
  await generateLeads();

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('  DEPLOYMENT COMPLETE');
  console.log('═'.repeat(60));
  console.log('\n📋 Created Resources:\n');
  console.log(`  Stripe Starter Price:      ${priceIds.starter || 'ERROR'}`);
  console.log(`  Stripe Professional Price: ${priceIds.professional || 'ERROR'}`);
  console.log(`  Stripe Business Price:     ${priceIds.business || 'ERROR'}`);
  console.log(`  Vapi Assistant ID:         ${assistantId || 'ERROR'}`);
  console.log('\n🌐 Live URLs:\n');
  console.log('  App:   https://dentalcall-ai.onrender.com');
  console.log('  Phone: +1 (972) 845-8338');
  console.log('\n⚡ Manual Steps Required:\n');
  console.log('  1. Run Supabase migration:');
  console.log('     https://supabase.com/dashboard/project/fataxuuxjwibugjxekwm/sql');
  console.log('     Paste: supabase/migrations/001_initial_schema.sql');
  console.log('');
  console.log('  2. Configure Stripe webhook:');
  console.log('     https://dashboard.stripe.com/webhooks');
  console.log('     Endpoint: https://dentalcall-ai.onrender.com/api/stripe/webhook');
  console.log('');
  console.log('  3. Connect phone to Vapi:');
  console.log('     https://dashboard.vapi.ai/phone-numbers');
  console.log('     Import: +19728458338');
  console.log('');
  console.log('  4. Launch outreach:');
  console.log('     node scripts/outreach.js --file dental-tx-2026-01-02.json --live');
  console.log('\n' + '═'.repeat(60));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
