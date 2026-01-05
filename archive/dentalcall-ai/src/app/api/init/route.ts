import { NextResponse } from 'next/server';

/**
 * One-time initialization endpoint
 * Visit /api/init after deployment to set up Stripe products and Vapi assistant
 */

interface SetupResult {
  stripe: {
    starterPriceId?: string;
    professionalPriceId?: string;
    businessPriceId?: string;
    error?: string;
  };
  vapi: {
    assistantId?: string;
    error?: string;
  };
}

async function createStripeProducts(): Promise<SetupResult['stripe']> {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return { error: 'STRIPE_SECRET_KEY not configured' };
  }

  const products = [
    { name: 'DentalCall AI Starter', description: 'AI Receptionist - 500 minutes/month', price: 29900, tier: 'starter' },
    { name: 'DentalCall AI Professional', description: 'AI Receptionist - 2,000 minutes/month', price: 59900, tier: 'professional' },
    { name: 'DentalCall AI Business', description: 'AI Receptionist - 5,000 minutes/month', price: 99900, tier: 'business' },
  ];

  const result: SetupResult['stripe'] = {};

  for (const product of products) {
    try {
      // Create product
      const productRes = await fetch('https://api.stripe.com/v1/products', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(stripeKey + ':').toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          name: product.name,
          description: product.description,
          'metadata[tier]': product.tier,
        }),
      });

      const productData = await productRes.json();

      if (productData.id) {
        // Create price
        const priceRes = await fetch('https://api.stripe.com/v1/prices', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(stripeKey + ':').toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            product: productData.id,
            unit_amount: product.price.toString(),
            currency: 'usd',
            'recurring[interval]': 'month',
          }),
        });

        const priceData = await priceRes.json();

        if (product.tier === 'starter') result.starterPriceId = priceData.id;
        if (product.tier === 'professional') result.professionalPriceId = priceData.id;
        if (product.tier === 'business') result.businessPriceId = priceData.id;
      }
    } catch (err) {
      result.error = `Failed to create ${product.tier}: ${err}`;
    }
  }

  return result;
}

async function createVapiAssistant(): Promise<SetupResult['vapi']> {
  const vapiKey = process.env.VAPI_API_KEY;
  if (!vapiKey) {
    return { error: 'VAPI_API_KEY not configured' };
  }

  try {
    const res = await fetch('https://api.vapi.ai/assistant', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vapiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
NEVER: Share medical advice, discuss pricing without verification, or make promises about treatment.`,
        },
        voice: { provider: 'openai', voiceId: 'alloy' },
        firstMessage: 'Thank you for calling. This is your AI dental assistant. How may I help you today?',
        endCallMessage: 'Thank you for calling. Have a wonderful day!',
        recordingEnabled: true,
        transcriptionEnabled: true,
        silenceTimeoutSeconds: 30,
        maxDurationSeconds: 1800,
      }),
    });

    const data = await res.json();
    return { assistantId: data.id };
  } catch (err) {
    return { error: `Failed to create assistant: ${err}` };
  }
}

export async function GET() {
  // Check if already initialized
  if (process.env.STRIPE_STARTER_PRICE_ID && process.env.VAPI_ASSISTANT_ID) {
    return NextResponse.json({
      status: 'already_initialized',
      stripe: {
        starterPriceId: process.env.STRIPE_STARTER_PRICE_ID,
        professionalPriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID,
        businessPriceId: process.env.STRIPE_BUSINESS_PRICE_ID,
      },
      vapi: {
        assistantId: process.env.VAPI_ASSISTANT_ID,
      },
    });
  }

  const stripe = await createStripeProducts();
  const vapi = await createVapiAssistant();

  const response = {
    status: 'initialized',
    stripe,
    vapi,
    next_steps: [
      'Copy the price IDs and assistant ID above',
      'Add them to your Render environment variables',
      'Set up Stripe webhook at dashboard.stripe.com pointing to /api/stripe/webhook',
      'Connect your Twilio number to Vapi at dashboard.vapi.ai',
    ],
    env_vars_to_add: {
      STRIPE_STARTER_PRICE_ID: stripe.starterPriceId || 'ERROR',
      STRIPE_PROFESSIONAL_PRICE_ID: stripe.professionalPriceId || 'ERROR',
      STRIPE_BUSINESS_PRICE_ID: stripe.businessPriceId || 'ERROR',
      VAPI_ASSISTANT_ID: vapi.assistantId || 'ERROR',
    },
  };

  return NextResponse.json(response);
}
