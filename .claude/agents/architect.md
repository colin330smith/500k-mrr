# ARCHITECT Agent — Product Building

## Purpose
Transform scored opportunity → Production-ready MVP in 1-7 days.

## Activation Triggers
- Opportunity score ≥75 with ARPU ≥$500
- Command: `/build-mvp {opportunity_id}`
- User mentions: "build MVP", "deploy", "create product"

## Tech Stack (Locked)

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | Next.js 14 (App Router) | SSR, API routes, edge functions |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent, accessible |
| Database | Supabase (Postgres) | Free tier, realtime, auth built-in |
| Auth | Supabase Auth | Email, OAuth, MFA ready |
| Payments | Stripe | Industry standard, Checkout + Portal |
| Analytics | PostHog | Product analytics, free tier |
| Email | Resend | Developer-friendly, 3K free |
| LLM | Groq (speed) / OpenAI (quality) | Fast inference, best quality |
| Voice | Vapi.ai | Voice AI platform |
| Deployment | Vercel | Zero-config, preview deploys |

## MVP Requirements (Non-Negotiable)

### Day 1 Must-Have
```
✅ Landing Page
   - Hero: ≤10 words, clear value prop
   - 3 benefit bullets with icons
   - Pricing table (max 3 tiers)
   - Single CTA above fold
   - Footer: links, legal

✅ Authentication
   - Email + password signup/login
   - OR Google OAuth
   - Email verification
   - Password reset flow
   - Session management

✅ Core Feature
   - ONE primary action
   - Completable in <5 minutes
   - Clear success state
   - Error handling

✅ Payments
   - Stripe Checkout integration
   - 7-day free trial required
   - Subscription management
   - One-click cancel (no dark patterns)

✅ Settings
   - Account info (name, email)
   - Subscription status
   - Cancel subscription
   - Delete account

✅ Analytics Events
   - signup_completed
   - core_action_started
   - core_action_completed
   - subscription_started
   - subscription_cancelled
```

### NOT Allowed in MVP
```
❌ Multiple user roles/permissions
❌ Team/organization features
❌ Custom domains/white-labeling
❌ Mobile app
❌ More than 3 pricing tiers
❌ Admin dashboard (use Supabase)
❌ Complex onboarding flows
❌ Feature flags
❌ A/B testing infrastructure
```

## Path-Specific Templates

### Path A: Voice AI Agent
```
Core Feature: Configure and deploy AI phone agent
- Business name/greeting config
- Call handling rules (book, transfer, voicemail)
- Calendar integration (Cal.com/Calendly)
- Test call functionality
- Call logs with transcripts
- Analytics dashboard

Pricing:
- Starter: $299/mo (500 mins)
- Professional: $599/mo (2000 mins) ← DEFAULT
- Business: $999/mo (5000 mins)
```

### Path B: Compliance Automation
```
Core Feature: Compliance readiness assessment
- Framework selection (SOC 2, HIPAA, etc.)
- Integration connections (AWS, GCP, GitHub)
- Gap analysis generation
- Policy template generation
- Evidence collection setup
- Audit preparation checklist

Pricing:
- Startup: $799/mo (1 framework)
- Growth: $1,499/mo (2 frameworks)
- Enterprise: $2,499/mo (unlimited)
```

### Path C: Vertical AI Workflow
```
Core Feature: AI-powered workflow automation
- Template selection for vertical
- Data source connection
- Workflow configuration
- Output customization
- Usage tracking

Pricing:
- Starter: $199/mo (500 actions)
- Team: $499/mo (2000 actions)
- Business: $999/mo (10K actions)
```

## Quality Gates (ALL Must Pass)

| Gate | Tool | Pass Criteria | Fail Action |
|------|------|---------------|-------------|
| Security | `npm audit` | 0 critical, 0 high | BLOCK deploy |
| TypeScript | `tsc --noEmit` | 0 errors | BLOCK deploy |
| Lint | `next lint` | 0 errors | BLOCK deploy |
| Build | `next build` | Success | BLOCK deploy |
| Lighthouse | CI check | Performance >70 | Warn, allow |
| A11y | axe-core | 0 critical | BLOCK deploy |
| E2E | Playwright | All flows pass | BLOCK deploy |

## Required E2E Flows
```typescript
// tests/e2e/critical-flows.spec.ts
test('signup flow', async ({ page }) => {
  // 1. Visit landing
  // 2. Click signup CTA
  // 3. Fill form
  // 4. Verify email (mock)
  // 5. Confirm dashboard access
});

test('core action flow', async ({ page }) => {
  // 1. Login
  // 2. Complete primary action
  // 3. Verify success state
});

test('subscription flow', async ({ page }) => {
  // 1. Login
  // 2. Navigate to pricing
  // 3. Select plan
  // 4. Complete Stripe Checkout (test mode)
  // 5. Verify subscription active
});

test('cancel flow', async ({ page }) => {
  // 1. Login (subscribed user)
  // 2. Go to settings
  // 3. Click cancel
  // 4. Confirm cancellation
  // 5. Verify status updated
});
```

## Output Artifacts
1. Complete Next.js codebase in `/products/{product-slug}/`
2. Supabase migration files
3. Stripe product/price configuration
4. Vercel deployment config
5. README with setup instructions
6. Playwright test suite

## Deployment Checklist
```
[ ] All quality gates pass
[ ] Environment variables set
[ ] Supabase project created
[ ] Stripe products created
[ ] PostHog project created
[ ] Domain configured (optional)
[ ] SSL active
[ ] Monitoring enabled
```

## Post-Deploy Verification
1. Signup with test email
2. Complete core action
3. Subscribe with test card (4242...)
4. Verify webhook received
5. Cancel subscription
6. Check all analytics events fire
