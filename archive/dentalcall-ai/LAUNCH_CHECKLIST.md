# DentalCall AI - Launch Checklist

## Pre-Launch Setup

### 1. Database (Supabase)
- [ ] Go to: https://supabase.com/dashboard/project/fataxuuxjwibugjxekwm/sql
- [ ] Run `scripts/setup-supabase.sql`
- [ ] Verify tables created in Table Editor
- [ ] Copy Anon Key and Service Role Key to `.env.local`

### 2. Authentication (Google OAuth)
- [ ] Go to: https://supabase.com/dashboard/project/fataxuuxjwibugjxekwm/auth/providers
- [ ] Enable Google provider
- [ ] Client ID: `43837062618-m1ke2djc3rtm6kb56end86qmoa0sci89.apps.googleusercontent.com`
- [ ] Client Secret: `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`
- [ ] Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials
- [ ] Add authorized redirect URI: `https://fataxuuxjwibugjxekwm.supabase.co/auth/v1/callback`
- [ ] Add production domain when ready

### 3. Payments (Stripe)
- [ ] Run: `npx ts-node scripts/setup-stripe.ts`
- [ ] Copy price IDs to `.env.local`:
  - `STRIPE_STARTER_PRICE_ID=`
  - `STRIPE_PROFESSIONAL_PRICE_ID=`
  - `STRIPE_BUSINESS_PRICE_ID=`
- [ ] Set up webhook at: https://dashboard.stripe.com/webhooks
  - Endpoint: `https://YOUR_DOMAIN/api/stripe/webhook`
  - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
- [ ] Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 4. Voice AI (Vapi)
- [ ] Run: `npx ts-node scripts/setup-vapi.ts`
- [ ] Copy assistant ID to `VAPI_ASSISTANT_ID`
- [ ] Go to: https://dashboard.vapi.ai/phone-numbers
- [ ] Import Twilio number: `+19728458338`
- [ ] Connect to DentalCall AI assistant

### 5. Deploy (Render)
- [ ] Push code to GitHub
- [ ] Go to: https://dashboard.render.com
- [ ] Create new Web Service from repo
- [ ] Add all environment variables from `.env.local`
- [ ] Deploy
- [ ] Note the URL (e.g., `https://dentalcall-ai.onrender.com`)

### 6. Post-Deploy Configuration
- [ ] Update `NEXT_PUBLIC_APP_URL` with production URL
- [ ] Update Stripe webhook URL
- [ ] Update Vapi webhook URL
- [ ] Update Google OAuth redirect URI
- [ ] Re-deploy with updated env vars

---

## Launch Day

### Testing Checklist
- [ ] Visit landing page - loads correctly
- [ ] Click "Start Free Trial" - goes to signup
- [ ] Sign up with email - verification email received
- [ ] Sign up with Google - works correctly
- [ ] Log in - dashboard loads
- [ ] Click pricing CTA - Stripe checkout opens
- [ ] Complete test payment (use card 4242 4242 4242 4242)
- [ ] Subscription shows as active
- [ ] Call the Twilio number - AI answers
- [ ] Check Vapi dashboard for call recording
- [ ] Cancel subscription - works without friction

### Go-Live Checklist
- [ ] Remove test data from database
- [ ] Verify Stripe is in live mode
- [ ] Run lead generation: `npx ts-node scripts/generate-leads.ts --count 200 --state TX`
- [ ] Launch outreach: `npx ts-node scripts/outreach.ts --file dental-tx-YYYY-MM-DD.json`

---

## Traffic & Growth

### Week 1 Targets
- [ ] 200 leads generated
- [ ] 100 emails sent
- [ ] 10 demo calls booked
- [ ] 5 trial signups
- [ ] 2 paid conversions

### Monitoring
- **Render**: https://dashboard.render.com (logs, deploys)
- **Stripe**: https://dashboard.stripe.com (payments, subscriptions)
- **Vapi**: https://dashboard.vapi.ai (calls, transcripts)
- **Supabase**: https://supabase.com/dashboard (database, auth)
- **PostHog**: https://app.posthog.com (analytics)

### Support
- Email: colin@localliftleads.com
- Phone: +19728458338

---

## Emergency Contacts

### Circuit Breakers
If something goes wrong:

1. **High error rate**: Roll back deployment in Render
2. **Payment issues**: Pause Stripe webhook
3. **Voice agent issues**: Disable Vapi assistant
4. **Database issues**: Check Supabase logs

### Rollback Procedure
```bash
# Render dashboard > Service > Manual Deploy > Select previous commit
```

---

**Target: $500K MRR in 12 months**

The Loop: Build → Launch → Measure → Decide → Repeat
