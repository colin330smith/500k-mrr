# DentalCall AI - One-Click Deploy

## Option A: Deploy via Render Button (Recommended)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/colin330smith/500k-mrr)

When prompted for environment variables, copy values from your `.env.local` file.

## Option B: Run Local Setup Script

```bash
cd products/dentalcall-ai
node setup-production.js
```

This creates Stripe products and Vapi assistant, then outputs the env vars for deployment.

---

## Post-Deployment Setup

### 1. Initialize Services

After deploy completes, visit:
```
https://dentalcall-ai.onrender.com/api/init
```

This creates Stripe products and Vapi assistant automatically.

### 2. Configure Stripe Webhook

1. Go to: https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://dentalcall-ai.onrender.com/api/stripe/webhook`
3. Select events:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed
4. Copy webhook secret to Render env vars as STRIPE_WEBHOOK_SECRET

### 3. Set Up Supabase Database

1. Go to: https://supabase.com/dashboard/project/fataxuuxjwibugjxekwm/sql
2. Click "New Query"
3. Paste contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run"

### 4. Enable Google OAuth

1. Go to: https://supabase.com/dashboard/project/fataxuuxjwibugjxekwm/auth/providers
2. Enable Google provider
3. Add Client ID and Client Secret from your `.env.local`

### 5. Connect Phone Number

1. Go to: https://dashboard.vapi.ai/phone-numbers
2. Import Twilio number from your `.env.local`
3. Connect to DentalCall AI Receptionist assistant

### 6. Launch Outreach

```bash
cd products/dentalcall-ai
node scripts/generate-leads.js --count 200 --state TX
node scripts/outreach.js --file dental-tx-2026-01-02.json --live
```

---

## Live URLs

- **App**: https://dentalcall-ai.onrender.com
- **Phone**: +1 (972) 845-8338

## Revenue Target

| Week | Leads | Demos | Trials | Paid | MRR |
|------|-------|-------|--------|------|-----|
| 1 | 200 | 10 | 5 | 2 | $1.2K |
| 2 | 400 | 25 | 15 | 8 | $4.8K |
| 4 | 800 | 50 | 30 | 20 | $12K |
