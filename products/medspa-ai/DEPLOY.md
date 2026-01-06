# MedSpa RevAI - Deployment Guide

## Quick Deploy Options

### Option 1: Render (Recommended - Free Tier)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/colin330smith/500k-mrr)

1. Click the button above or go to https://render.com
2. Create account (free)
3. New → Blueprint
4. Connect your GitHub repo
5. Select `products/medspa-ai/render.yaml`
6. Add environment variables:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `VAPI_API_KEY`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
7. Deploy

### Option 2: Vercel (Frontend) + Render (API)

**Frontend:**
```bash
cd products/medspa-ai/public
npx vercel --prod
```

**API:**
```bash
cd products/medspa-ai/api
# Deploy to Render via dashboard
```

### Option 3: Railway (One-Click)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

1. Connect GitHub
2. Select `products/medspa-ai`
3. Add environment variables
4. Deploy

---

## Environment Variables Required

Copy from `~/.medspa-revai.env`:

| Variable | Description |
|----------|-------------|
| STRIPE_SECRET_KEY | Stripe live secret key |
| STRIPE_WEBHOOK_SECRET | Stripe webhook signing secret |
| VAPI_API_KEY | Vapi.ai API key |
| TWILIO_ACCOUNT_SID | Twilio account SID |
| TWILIO_AUTH_TOKEN | Twilio auth token |

---

## Stripe Webhook Setup

After deploying, configure Stripe webhook:

1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://YOUR-API-URL/api/webhook`
3. Select event: `checkout.session.completed`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

---

## Verify Deployment

**Frontend:** Visit your deployed URL, should see landing page

**API:**
```bash
curl https://YOUR-API-URL/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

**Demo Line:** Call (833) 425-1223 - should connect to AI

---

## Local Testing

```bash
# Terminal 1: API
cd products/medspa-ai/api
source ~/.medspa-revai.env
npm install && npm start

# Terminal 2: Frontend
cd products/medspa-ai/public
npx serve -p 8080

# Open http://localhost:8080
```
