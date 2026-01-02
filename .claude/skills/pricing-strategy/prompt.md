# Pricing Strategy Skill

Auto-invoked when discussing pricing, monetization, or revenue models.

## Trigger Phrases
- "how should we price"
- "pricing strategy"
- "what to charge"
- "monetization"
- "pricing tiers"

## Core Principles

### 1. Price with Courage
- Minimum viable price: $199/month
- Target ARPU: $500+/month
- Never race to bottom
- Cheap customers churn more and complain more

### 2. Value-Based Pricing
- Price on value delivered, not cost
- Calculate ROI for customer
- Show 10x return on investment
- Anchor against pain cost, not competitor price

### 3. Simplicity Wins
- Maximum 3 tiers for MVP
- Clear feature differentiation
- No per-seat pricing (initially)
- Annual discount: 20% (2 months free)

## Pricing Templates by Path

### Path A: Voice AI Agents

```
STARTER         PROFESSIONAL       BUSINESS
$299/mo         $599/mo           $999/mo
                ← DEFAULT →

500 minutes     2,000 minutes     5,000 minutes
1 phone number  3 phone numbers   Unlimited numbers
Basic analytics Advanced analytics Priority support
Email support   Priority email    Phone + email
                CRM integration   Custom integrations
                                  Dedicated CSM

Overage: $0.15/minute
Annual: 20% off (2 months free)

ENTERPRISE: Custom pricing for 10+ locations
```

**Value Anchoring Script:**
```
"The average dental practice misses 23% of calls during peak hours.
At $200/appointment, that's $4,600/month in lost revenue.
Our Professional plan at $599/month pays for itself with just 3
additional appointments booked."
```

### Path B: Compliance Automation

```
STARTUP         GROWTH            ENTERPRISE
$799/mo         $1,499/mo         $2,499+/mo
                ← DEFAULT →

1 framework     2 frameworks      Unlimited
5 integrations  15 integrations   Unlimited
Self-serve      Audit support     Dedicated CSM
Email support   Priority support  SLA + phone
Community       Slack channel     Private Slack
                                  Custom controls

Annual: 20% off
```

**Value Anchoring Script:**
```
"The average SOC 2 audit costs $50,000-150,000 with a traditional
firm and takes 6-12 months. Our platform gets you audit-ready in
weeks at a fraction of the cost. One enterprise deal you close
because you have SOC 2 pays for years of our service."
```

### Path C: Vertical SaaS

```
STARTER         TEAM              BUSINESS
$199/mo         $499/mo           $999/mo
                ← DEFAULT →

500 actions     2,000 actions     10,000 actions
1 user          5 users           Unlimited users
Core features   All features      All features + API
Email support   Priority support  Dedicated support
                                  Custom workflows

Annual: 20% off
```

### Path D: Micro-SaaS

```
FREE            STARTER           PRO              BUSINESS
$0              $29/mo            $79/mo           $199/mo
                                  ← DEFAULT →

50 actions      500 actions       2,000 actions    10,000 actions
Basic features  Core features     All features     All + API
Community       Email support     Priority         Priority + calls

Upgrade triggers:
- Hitting action limit
- Needing team features
- API access required
```

## Pricing Psychology

### Anchoring
Always show the expensive option first (on left or top).
Middle option should be the target (mark as "POPULAR" or "MOST CHOSEN").

### Decoy Effect
If needed, add a decoy tier that makes target tier look better:
- Decoy should be close in price to target
- Decoy should have noticeably fewer features

### Loss Aversion
Frame trial ending as losing features:
"Your free trial ends in 3 days. Don't lose access to:
✓ 50 appointments booked
✓ 23 hours saved
✓ $4,600 in captured revenue"

### Social Proof
Show on pricing page:
- "Trusted by 500+ dental practices"
- Customer logos
- "Most popular" badge on target tier

## Trial Strategy

### 7-Day Free Trial (Required)
- No credit card required to start
- Full feature access
- Clear countdown in product
- Email sequence: Day 1, 3, 5, 7

### Trial Email Sequence
```
Day 1: Welcome + quick start guide
Day 3: Feature highlight + success tip
Day 5: ROI calculation + case study
Day 7: "Trial ending" + easy subscribe CTA
Day 8: "You've been downgraded" + one-click restore
```

## Discount Rules

### Allowed Discounts
- Annual payment: 20% (automatic)
- First month: 50% (for high-value leads only)
- Non-profit: 30% (verify status)

### Not Allowed
- Lifetime deals
- 80%+ discounts
- Per-seat negotiation
- Custom plans under $500/mo

## Pricing Page Best Practices

```
ABOVE FOLD:
- 3 pricing cards (side by side)
- "Most Popular" badge on target tier
- Monthly/Annual toggle (annual default)
- Single CTA per tier: "Start Free Trial"

BELOW FOLD:
- Feature comparison table
- FAQ section
- Social proof (logos, testimonials)
- Money-back guarantee (30 days)

FOOTER:
- Contact for Enterprise
- "All plans include..." (support, security, etc.)
```

## Revenue Projections

### Target Economics
```
Path A (Voice AI):
  ARPU: $599
  CAC: $200 (target)
  LTV: $7,188 (12-month average)
  LTV:CAC: 36x ✓

Path B (Compliance):
  ARPU: $1,499
  CAC: $500 (target)
  LTV: $17,988 (12-month average)
  LTV:CAC: 36x ✓
```

### Revenue Model
```
Month 1:  10 customers × $599 = $5,990 MRR
Month 3:  80 customers × $599 = $47,920 MRR
Month 6:  250 customers × $599 = $149,750 MRR
Month 12: 835 customers × $599 = $500,000 MRR

Assumptions:
- 15% monthly growth
- 5% monthly churn
- 95% Professional tier adoption
```

## Output Template

```json
{
  "pricing_strategy": {
    "path": "A",
    "target_arpu": 599,
    "tiers": [
      {
        "name": "Starter",
        "price_monthly": 299,
        "price_annual": 239,
        "features": ["500 minutes", "1 number", "Basic analytics"],
        "target_customer": "Solo practitioner"
      },
      {
        "name": "Professional",
        "price_monthly": 599,
        "price_annual": 479,
        "features": ["2000 minutes", "3 numbers", "CRM integration"],
        "target_customer": "Small practice",
        "is_default": true
      },
      {
        "name": "Business",
        "price_monthly": 999,
        "price_annual": 799,
        "features": ["5000 minutes", "Unlimited", "Priority support"],
        "target_customer": "Multi-location"
      }
    ],
    "trial": {
      "duration_days": 7,
      "credit_card_required": false,
      "full_features": true
    },
    "value_anchor": "23% of calls missed = $4,600/mo lost",
    "roi_multiple": "10x return on $599 investment"
  }
}
```
