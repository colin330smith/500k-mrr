# DentalCall AI - 5-Minute Launch Guide

## Prerequisites
- Node.js 18+ installed
- Git access to this repo

## Step 1: Clone and Install (1 min)

```bash
git clone https://github.com/colin330smith/500k-mrr.git
cd 500k-mrr/products/dentalcall-ai
npm install
```

## Step 2: Run Setup Script (2 min)

```bash
node setup-production.js
```

This creates Stripe products and Vapi assistant automatically.

## Step 3: Configure Supabase (2 min)

1. Go to: https://supabase.com/dashboard/project/fataxuuxjwibugjxekwm/sql
2. Click "New Query"
3. Paste contents of `scripts/setup-supabase.sql`
4. Click "Run"

Then enable Google OAuth:
1. Go to: https://supabase.com/dashboard/project/fataxuuxjwibugjxekwm/auth/providers
2. Enable Google
3. Paste:
   - Client ID: `43837062618-m1ke2djc3rtm6kb56end86qmoa0sci89.apps.googleusercontent.com`
   - Client Secret: `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`

## Step 4: Deploy to Render (1 min)

1. Go to: https://dashboard.render.com/select-repo?type=web
2. Connect GitHub: `colin330smith/500k-mrr`
3. Root Directory: `products/dentalcall-ai`
4. Add environment variables (output from setup script)
5. Click "Create Web Service"

## Step 5: Final Configuration

After deploy completes:

1. **Stripe Webhook**: https://dashboard.stripe.com/webhooks
   - Add endpoint: `https://YOUR_RENDER_URL/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`

2. **Vapi Phone**: https://dashboard.vapi.ai/phone-numbers
   - Import Twilio: `+19728458338`
   - Connect to assistant

## Step 6: Launch Outreach

```bash
# Generate 200 dental practice leads in Texas
node scripts/generate-leads.js --count 200 --state TX

# Start email outreach
node scripts/outreach.js --file dental-tx-*.json
```

---

## Your Live URLs

- **App**: https://dentalcall-ai.onrender.com
- **Stripe**: https://dashboard.stripe.com
- **Supabase**: https://supabase.com/dashboard/project/fataxuuxjwibugjxekwm
- **Vapi**: https://dashboard.vapi.ai
- **Phone**: +1 (972) 845-8338

## Revenue Target

| Week | Leads | Demos | Trials | Paid |
|------|-------|-------|--------|------|
| 1 | 200 | 10 | 5 | 2 |
| 2 | 400 | 25 | 15 | 8 |
| 4 | 800 | 50 | 30 | 20 |

At $599/mo avg = $12K MRR by Week 4

**Build → Launch → Measure → Decide → Repeat**
