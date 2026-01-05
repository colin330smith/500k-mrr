#!/usr/bin/env npx ts-node
/**
 * DentalCall AI - Vapi Voice Agent Setup
 * Creates the AI receptionist assistant configuration
 *
 * Run: npx ts-node scripts/setup-vapi.ts
 */

const VAPI_API_KEY = process.env.VAPI_API_KEY;

interface VapiAssistant {
  id: string;
  name: string;
}

async function setupVapi() {
  console.log('🎙️ Setting up Vapi Voice Agent for DentalCall AI...\n');

  if (!VAPI_API_KEY) {
    console.error('❌ VAPI_API_KEY environment variable not set');
    process.exit(1);
  }

  try {
    // Create the dental receptionist assistant
    const assistantConfig = {
      name: 'DentalCall AI Receptionist',
      model: {
        provider: 'openai',
        model: 'gpt-4o-mini',
        temperature: 0.7,
        systemPrompt: `You are a friendly and professional AI receptionist for a dental practice. Your primary goals are:

1. GREETING: Answer calls warmly with "Thank you for calling [Practice Name]. This is your AI assistant. How may I help you today?"

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

4. EMERGENCIES:
   - Express empathy: "I'm sorry you're experiencing discomfort"
   - For severe emergencies, offer to transfer to emergency line
   - For next-day urgent: prioritize earliest available

5. TRANSFER REQUESTS:
   - Say: "I'll transfer you now. One moment please."
   - Transfer to the main office line

6. CLOSING:
   - Confirm any appointments made
   - Ask if there's anything else
   - Thank them for calling

TONE: Professional, warm, patient, helpful. Speak clearly and at moderate pace.
NEVER: Share medical advice, discuss pricing without verification, or make promises about treatment.`,
      },
      voice: {
        provider: 'openai',
        voiceId: 'alloy',
      },
      firstMessage: 'Thank you for calling. This is your AI dental assistant. How may I help you today?',
      endCallMessage: 'Thank you for calling. Have a wonderful day!',
      recordingEnabled: true,
      transcriptionEnabled: true,
      endCallFunctionEnabled: true,
      dialKeypadFunctionEnabled: true,
      hipaaEnabled: true,
      serverUrl: 'https://dentalcall.ai/api/vapi/webhook',
      serverMessages: [
        'end-of-call-report',
        'function-call',
        'hang',
        'speech-update',
        'status-update',
        'transcript',
        'tool-calls',
      ],
      clientMessages: [
        'conversation-update',
        'function-call',
        'hang',
        'model-output',
        'speech-update',
        'status-update',
        'transcript',
        'tool-calls',
      ],
      silenceTimeoutSeconds: 30,
      maxDurationSeconds: 1800, // 30 minutes max
      backgroundSound: 'office',
      backchannelingEnabled: true,
      metadata: {
        product: 'dentalcall-ai',
        version: '1.0.0',
      },
    };

    console.log('Creating Vapi assistant...');

    const response = await fetch('https://api.vapi.ai/assistant', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assistantConfig),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vapi API error: ${error}`);
    }

    const assistant: VapiAssistant = await response.json();
    console.log(`✅ Created assistant: ${assistant.id}`);

    // Create phone number configuration
    console.log('\nConfiguring phone number...');

    const phoneConfig = {
      assistantId: assistant.id,
      name: 'DentalCall Main Line',
      provider: 'twilio',
      twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
      twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
      twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
    };

    // Note: Phone number setup may require additional Vapi dashboard configuration

    console.log('\n📋 Add this to your .env.local:\n');
    console.log(`VAPI_ASSISTANT_ID=${assistant.id}`);

    console.log('\n✅ Vapi setup complete!');
    console.log('\n⚠️  Next steps:');
    console.log('   1. Go to https://dashboard.vapi.ai');
    console.log('   2. Connect your Twilio phone number to this assistant');
    console.log('   3. Test with a phone call');

  } catch (error) {
    console.error('❌ Error setting up Vapi:', error);
    process.exit(1);
  }
}

setupVapi();
