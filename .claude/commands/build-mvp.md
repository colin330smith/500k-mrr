# Build MVP Command

Generate and deploy a production-ready MVP for a scored opportunity.

## Usage
```
/build-mvp OPP-20250101-001
/build-mvp OPP-20250101-001 --dry-run    # Generate without deploy
```

## Prerequisites
- Opportunity score ≥75
- ARPU estimate ≥$500
- Path identified (A/B/C/D)

## Execution Steps

### Phase 1: Setup (5 min)
1. Create product directory `/products/{slug}/`
2. Initialize Next.js 14 project
3. Configure Tailwind + shadcn/ui
4. Set up project structure

### Phase 2: Database (10 min)
1. Design Supabase schema
2. Create migration files
3. Set up RLS policies
4. Configure auth settings

### Phase 3: Core Build (2-4 hours)
1. **Landing Page**
   - Hero section (≤10 words)
   - Benefits section (3 items)
   - Pricing table (max 3 tiers)
   - CTA above fold
   - Footer with legal links

2. **Authentication**
   - Email/password signup
   - Google OAuth (optional)
   - Email verification
   - Password reset
   - Session management

3. **Core Feature**
   - Single primary action
   - <5 minute completion
   - Success/error states
   - Loading states

4. **Payments**
   - Stripe Checkout
   - 7-day free trial
   - Subscription management
   - Cancel flow (no friction)

5. **Settings**
   - Account info
   - Subscription status
   - Cancel option
   - Delete account

6. **Analytics**
   - PostHog integration
   - Required events:
     - signup_completed
     - core_action_started
     - core_action_completed
     - subscription_started
     - subscription_cancelled

### Phase 4: Testing (30 min)
1. Run Playwright E2E tests
2. Lighthouse performance check
3. Accessibility audit (axe-core)
4. Security scan (npm audit)

### Phase 5: Deploy (15 min)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Verify deployment
5. Run smoke tests

## Quality Gates

All must pass before deploy:
- [ ] `npm audit` — 0 critical/high
- [ ] `tsc --noEmit` — 0 errors
- [ ] `next lint` — 0 errors
- [ ] `next build` — success
- [ ] Lighthouse — performance >70
- [ ] axe-core — 0 critical violations
- [ ] Playwright — all flows pass

## Output

```json
{
  "build_id": "BUILD-YYYYMMDD-XXX",
  "opportunity_id": "OPP-XXX",
  "product_slug": "dental-voice-ai",
  "path": "A",
  "status": "deployed",
  "url": "https://product.vercel.app",
  "quality_gates": {
    "security": "pass",
    "typescript": "pass",
    "lint": "pass",
    "build": "pass",
    "lighthouse": "pass",
    "accessibility": "pass",
    "e2e": "pass"
  },
  "artifacts": {
    "codebase": "/products/dental-voice-ai/",
    "migrations": "/products/dental-voice-ai/supabase/",
    "tests": "/products/dental-voice-ai/tests/"
  }
}
```
