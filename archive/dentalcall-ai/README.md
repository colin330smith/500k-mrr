# DentalCall AI

AI receptionist for dental practices. Never miss another patient call.

## Problem

- Dental practices miss 32% of incoming calls
- Each missed call costs $850+ in lost revenue
- Only 14% of new patients leave voicemails
- Staff shortages make it impossible to answer every call

## Solution

DentalCall AI answers every call 24/7, books appointments automatically, and integrates with your existing scheduling system.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local
# Fill in your API keys

# 3. Run development server
npm run dev

# 4. Open http://localhost:3000
```

## Environment Setup

### Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Run the migration: `npm run db:migrate`
3. Copy your project URL and keys to `.env.local`

### Stripe
1. Create a Stripe account
2. Create 3 subscription products (Starter, Professional, Business)
3. Copy price IDs to `.env.local`
4. Set up webhook endpoint: `/api/stripe/webhook`

### Vapi (Voice AI)
1. Create account at [vapi.ai](https://vapi.ai)
2. Create a phone number
3. Copy API key to `.env.local`

### PostHog
1. Create project at [posthog.com](https://posthog.com)
2. Copy project key to `.env.local`

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **Voice AI**: Vapi.ai
- **Analytics**: PostHog

## Pricing

| Plan | Price | Minutes |
|------|-------|---------|
| Starter | $299/mo | 500 |
| Professional | $599/mo | 2,000 |
| Business | $999/mo | 5,000 |

All plans include 7-day free trial.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
npm run typecheck    # Run TypeScript check
npm run test         # Run E2E tests
npm run db:migrate   # Push database migrations
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Manual

```bash
npm run build
npm run start
```

## Support

- Email: support@dentalcall.ai
- Docs: https://docs.dentalcall.ai

---

Built with MANUS 3.0 Autonomous SaaS Portfolio Engine
