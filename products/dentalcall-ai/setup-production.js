#!/usr/bin/env node
/**
 * DentalCall AI - One-Click Production Setup
 *
 * Prerequisites:
 *   1. Create .env.local with your credentials (see .env.example)
 *   2. Run: node setup-production.js
 *
 * This script will:
 * 1. Create Stripe products and prices
 * 2. Configure Vapi voice agent
 * 3. Output all environment variables needed for deployment
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local not found!');
    console.error('   Create .env.local with your credentials first.');
    console.error('   See .env.example for required variables.\n');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

loadEnv();

// Validate required environment variables
const required = [
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'VAPI_API_KEY',
  'OPENAI_API_KEY',
  'SUPABASE_PROJECT_ID'
];

const missing = required.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error('❌ Missing required environment variables:');
  missing.forEach(key => console.error(`   - ${key}`));
  console.error('\nAdd these to your .env.local file.\n');
  process.exit(1);
}

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

async function createStripeProduct(name, description, metadata) {
  const auth = Buffer.from(process.env.STRIPE_SECRET_KEY + ':').toString('base64');
  const postData = new URLSearchParams({ name, description, ...metadata }).toString();

  return makeRequest({
    hostname: 'api.stripe.com',
    path: '/v1/products',
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  }, postData);
}

async function createStripePrice(productId, amount, interval) {
  const auth = Buffer.from(process.env.STRIPE_SECRET_KEY + ':').toString('base64');
  const postData = new URLSearchParams({
    product: productId,
    unit_amount: amount.toString(),
    currency: 'usd',
    'recurring[interval]': interval
  }).toString();

  return makeRequest({
    hostname: 'api.stripe.com',
    path: '/v1/prices',
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  }, postData);
}

async function createVapiAssistant() {
  const assistantConfig = {
    name: 'DentalCall AI Receptionist',
    model: {
      provider: 'openai',
      model: 'gpt-4o-mini',
      temperature: 0.7,
      systemPrompt: `You are a friendly and professional AI receptionist for a dental practice. Your primary goals are:

1. GREETING: Answer calls warmly with "Thank you for calling. This is your AI dental assistant. How may I help you today?"

2. INTENT DETECTION: Identify caller intent:
   - Appointment booking (new or existing patient)
   - Appointment rescheduling or cancellation
   - General inquiries (hours, location, services)
   - Emergencies (tooth pain, swelling, trauma)
   - Speaking to a human

3. APPOINTMENT BOOKING:
   - Ask if they are a new or existing patient
   - Collect: Name, phone number, reason for visit
   - Offer available time slots
   - Confirm appointment details
   - Mention they'll receive an SMS confirmation

4. EMERGENCIES: Express empathy and offer to transfer to emergency line or prioritize earliest available.

5. TRANSFER REQUESTS: Say "I'll transfer you now. One moment please."

6. CLOSING: Confirm any appointments made, ask if there's anything else, thank them for calling.

TONE: Professional, warm, patient, helpful. Speak clearly and at moderate pace.
NEVER: Share medical advice, discuss pricing without verification, or make promises about treatment.`
    },
    voice: { provider: 'openai', voiceId: 'alloy' },
    firstMessage: 'Thank you for calling. This is your AI dental assistant. How may I help you today?',
    endCallMessage: 'Thank you for calling. Have a wonderful day!',
    recordingEnabled: true,
    transcriptionEnabled: true,
    hipaaEnabled: true,
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 1800
  };

  const postData = JSON.stringify(assistantConfig);

  return makeRequest({
    hostname: 'api.vapi.ai',
    path: '/assistant',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }, postData);
}

async function main() {
  console.log('🚀 DentalCall AI - Production Setup\n');
  console.log('='.repeat(50) + '\n');

  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co`,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    VAPI_API_KEY: process.env.VAPI_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || ''
  };

  // Step 1: Create Stripe Products
  console.log('📦 Step 1: Creating Stripe Products...\n');

  try {
    // Starter Product
    console.log('  Creating Starter product...');
    const starterProduct = await createStripeProduct(
      'DentalCall AI Starter',
      'AI Receptionist - 500 minutes/month',
      { 'metadata[tier]': 'starter' }
    );

    if (starterProduct.status === 200 && starterProduct.data.id) {
      console.log(`  ✅ Starter product: ${starterProduct.data.id}`);

      const starterPrice = await createStripePrice(starterProduct.data.id, 29900, 'month');
      if (starterPrice.data.id) {
        console.log(`  ✅ Starter price: ${starterPrice.data.id}`);
        envVars.STRIPE_STARTER_PRICE_ID = starterPrice.data.id;
      }
    } else {
      console.log(`  ⚠️  Starter: ${JSON.stringify(starterProduct.data)}`);
    }

    // Professional Product
    console.log('  Creating Professional product...');
    const proProduct = await createStripeProduct(
      'DentalCall AI Professional',
      'AI Receptionist - 2,000 minutes/month',
      { 'metadata[tier]': 'professional' }
    );

    if (proProduct.status === 200 && proProduct.data.id) {
      console.log(`  ✅ Professional product: ${proProduct.data.id}`);

      const proPrice = await createStripePrice(proProduct.data.id, 59900, 'month');
      if (proPrice.data.id) {
        console.log(`  ✅ Professional price: ${proPrice.data.id}`);
        envVars.STRIPE_PROFESSIONAL_PRICE_ID = proPrice.data.id;
      }
    }

    // Business Product
    console.log('  Creating Business product...');
    const bizProduct = await createStripeProduct(
      'DentalCall AI Business',
      'AI Receptionist - 5,000 minutes/month',
      { 'metadata[tier]': 'business' }
    );

    if (bizProduct.status === 200 && bizProduct.data.id) {
      console.log(`  ✅ Business product: ${bizProduct.data.id}`);

      const bizPrice = await createStripePrice(bizProduct.data.id, 99900, 'month');
      if (bizPrice.data.id) {
        console.log(`  ✅ Business price: ${bizPrice.data.id}`);
        envVars.STRIPE_BUSINESS_PRICE_ID = bizPrice.data.id;
      }
    }
  } catch (err) {
    console.log(`  ❌ Stripe error: ${err.message}`);
  }

  // Step 2: Create Vapi Assistant
  console.log('\n🎙️  Step 2: Creating Vapi Voice Agent...\n');

  try {
    const assistant = await createVapiAssistant();
    if (assistant.data.id) {
      console.log(`  ✅ Assistant created: ${assistant.data.id}`);
      envVars.VAPI_ASSISTANT_ID = assistant.data.id;
    } else {
      console.log(`  ⚠️  Vapi response: ${JSON.stringify(assistant.data)}`);
    }
  } catch (err) {
    console.log(`  ❌ Vapi error: ${err.message}`);
  }

  // Output environment variables
  console.log('\n' + '='.repeat(50));
  console.log('📋 ENVIRONMENT VARIABLES FOR DEPLOYMENT\n');
  console.log('Add these to your Render environment:');
  console.log('-'.repeat(50) + '\n');

  for (const [key, value] of Object.entries(envVars)) {
    if (value) console.log(`${key}=${value}`);
  }

  console.log('\n' + '-'.repeat(50));
  console.log('\n✅ Setup complete!\n');
  console.log('Next steps:');
  console.log('1. Run the Supabase SQL migration (scripts/setup-supabase.sql)');
  console.log('2. Configure Google OAuth in Supabase dashboard');
  console.log('3. Deploy to Render with environment variables above');
  console.log('4. Set up Stripe webhook pointing to your Render URL');
  console.log('5. Connect Twilio number to Vapi assistant');
}

main().catch(console.error);
