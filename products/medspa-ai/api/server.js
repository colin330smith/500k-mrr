const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const twilio = require('twilio');

const app = express();
app.use(cors({ origin: true }));

// Stripe webhook needs raw body - must be before express.json()
app.post('/api/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(express.json());

// Environment variables
const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const VAPI_KEY = process.env.VAPI_API_KEY;
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;

const stripe = new Stripe(STRIPE_SECRET);
const twilioClient = twilio(TWILIO_SID, TWILIO_TOKEN);

// In-memory store (replace with Supabase in production)
const customers = new Map();

// Create Stripe Checkout Session
app.post('/api/checkout', async (req, res) => {
    try {
        const { email, businessName, businessPhone } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer_email: email,
            metadata: {
                businessName,
                businessPhone
            },
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'MedSpa RevAI Pro',
                        description: 'AI-powered no-show recovery & lead response'
                    },
                    unit_amount: 49700, // $497
                    recurring: { interval: 'month' }
                },
                quantity: 1
            }],
            success_url: `${req.headers.origin}/dashboard.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/signup.html`
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook handler function (defined here, registered at top before json middleware)
async function handleWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        try {
            await provisionCustomer(session);
            console.log('Customer provisioned successfully');
        } catch (err) {
            console.error('Provisioning error:', err);
        }
    }

    res.json({ received: true });
}

// Provision customer with Vapi assistant and phone number
async function provisionCustomer(session) {
    const { customer_email, metadata } = session;
    const { businessName, businessPhone } = metadata;

    console.log(`Provisioning customer: ${businessName}`);

    // 1. Create Vapi Assistant
    const assistantResponse = await fetch('https://api.vapi.ai/assistant', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${VAPI_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: `${businessName} AI`,
            model: {
                provider: 'openai',
                model: 'gpt-4o-mini',
                messages: [{
                    role: 'system',
                    content: `You are a friendly AI receptionist for ${businessName}. Be warm, concise, and always try to book appointments.

SERVICES & PRICING:
- Botox: $12/unit
- Lip Filler: $650/syringe
- Hydrafacial: $199
- Chemical Peel: $150
- Laser Hair Removal: from $200

AVAILABILITY: Mon-Sat 9am-6pm

BEHAVIORS:
1. Answer pricing questions, then offer to book
2. If they missed appointment: "No worries! Want me to reschedule?"
3. Always confirm: name, phone, preferred day/time
4. Keep responses SHORT

Transfer to ${businessPhone} for complex questions.`
                }]
            },
            voice: { provider: '11labs', voiceId: '21m00Tcm4TlvDq8ikWAM' },
            firstMessage: `Hi! This is the AI assistant for ${businessName}. How can I help you today?`,
            transcriber: { provider: 'deepgram', model: 'nova-2' }
        })
    });

    const assistant = await assistantResponse.json();
    console.log(`Created assistant: ${assistant.id}`);

    // 2. Buy a phone number
    const availableNumbers = await twilioClient.availablePhoneNumbers('US')
        .local
        .list({ areaCode: '512', limit: 1 });

    let phoneNumber;
    if (availableNumbers.length > 0) {
        const purchased = await twilioClient.incomingPhoneNumbers.create({
            phoneNumber: availableNumbers[0].phoneNumber,
            voiceUrl: 'https://api.vapi.ai/twilio/inbound_call',
            smsUrl: 'https://api.vapi.ai/twilio/sms',
            statusCallback: 'https://api.vapi.ai/twilio/status'
        });
        phoneNumber = purchased.phoneNumber;
        console.log(`Purchased number: ${phoneNumber}`);

        // 3. Link phone number to Vapi
        await fetch('https://api.vapi.ai/phone-number', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${VAPI_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                provider: 'twilio',
                number: phoneNumber,
                twilioAccountSid: TWILIO_SID,
                twilioAuthToken: TWILIO_TOKEN,
                assistantId: assistant.id,
                name: `${businessName} Line`
            })
        });
    }

    // 4. Store customer data
    customers.set(customer_email, {
        email: customer_email,
        businessName,
        businessPhone,
        assistantId: assistant.id,
        aiPhoneNumber: phoneNumber,
        createdAt: new Date().toISOString()
    });

    console.log(`Customer provisioned: ${customer_email}`);
    return { assistant, phoneNumber };
}

// Get customer dashboard data
app.get('/api/customer/:email', async (req, res) => {
    const customer = customers.get(req.params.email);
    if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
    }

    // Get call logs from Vapi
    const callsResponse = await fetch(`https://api.vapi.ai/call?assistantId=${customer.assistantId}&limit=50`, {
        headers: { 'Authorization': `Bearer ${VAPI_KEY}` }
    });
    const calls = await callsResponse.json();

    res.json({
        ...customer,
        calls: calls || []
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`MedSpa RevAI API running on port ${PORT}`);
});
