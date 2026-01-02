# Retention Playbook Skill

Auto-invoked when discussing churn, customer health, or retention strategies.

## Trigger Phrases
- "customer health"
- "churn risk"
- "retention"
- "NRR"
- "customer success"
- "why are they churning"

## Core Metrics

### Net Revenue Retention (NRR)
Target: >110%
Formula: (Starting MRR + Expansion - Churn - Contraction) / Starting MRR

### Gross Revenue Retention (GRR)
Target: >90%
Formula: (Starting MRR - Churn - Contraction) / Starting MRR

### Logo Churn
Target: <5% monthly
Formula: Churned customers / Starting customers

## Customer Health Index (CHI)

### Scoring Components (0-100)

#### Engagement (35 points)
| Signal | Points |
|--------|--------|
| Login within 7 days | +10 |
| Login 3+ days/week | +8 |
| Core feature used this week | +10 |
| 3+ screens visited per session | +4 |
| Dashboard viewed | +3 |

#### Value Realization (35 points)
| Signal | Points |
|--------|--------|
| Actions increased WoW | +12 |
| Using >50% of plan capacity | +8 |
| Positive outcome recorded | +10 |
| ROI/time saved calculated | +5 |

#### Relationship (20 points)
| Signal | Points |
|--------|--------|
| NPS 9-10 | +10 |
| NPS 7-8 | +5 |
| Referred a customer | +5 |
| Survey completed | +3 |
| Positive support interaction | +2 |

#### Fit (10 points)
| Signal | Points |
|--------|--------|
| Original BRS 80+ | +5 |
| From targeted outreach | +3 |
| ICP match confirmed | +2 |

## Intervention Playbooks

### CHI 80-100: Advocates
**Status:** Healthy, potential advocates
**Cadence:** Monthly touch

**Actions:**
1. Monthly value report with ROI summary
2. Request referral at Day 60
3. Invite to case study
4. Beta access to new features
5. Customer advisory board invitation

**Email Template:**
```
Subject: Your [Product] impact this month

Hi [Name],

Quick monthly check-in for [Company]:

This month, [Product] helped you:
→ [Metric 1: e.g., "Book 47 additional appointments"]
→ [Metric 2: e.g., "Save 12 hours of phone time"]
→ Estimated value: $[Value]

Know anyone else who could use these results?
Just reply with their email and I'll reach out personally.

[Signature]
```

### CHI 60-79: Monitor
**Status:** Engaged but not advocating
**Cadence:** Bi-weekly touch

**Actions:**
1. Feature highlight emails
2. Tips for unused features
3. Check-in if declining 14+ days
4. Offer 1:1 success call

**Email Template:**
```
Subject: Quick tip: Have you tried [Feature]?

Hi [Name],

I noticed you haven't used [Feature] yet.

Practices using it see [Benefit].

Here's a 2-minute walkthrough: [Video Link]

Reply if you have questions!

[Signature]
```

### CHI 40-59: At Risk
**Status:** Declining engagement
**Cadence:** Weekly touch
**Escalation:** 7 days no response

**Actions:**
1. Personalized value report
2. Offer 1:1 success call
3. Direct outreach from CSM
4. Identify blockers via survey
5. Consider plan adjustment

**Email Template:**
```
Subject: Everything okay with [Product]?

Hi [Name],

I noticed [Company]'s usage has dipped recently.

Just wanted to check in — is everything okay?

Here's what you've achieved so far:
→ [Achievement 1]
→ [Achievement 2]
→ Total value: $[Value]

I'd love to help you get back on track. 15 minutes?
[Calendar Link]

[Signature]
```

### CHI 20-39: Critical
**Status:** High churn risk
**Cadence:** Immediate action
**Escalation:** Founder involvement if MRR >$500

**Actions:**
1. "We miss you" email with incentive
2. Phone call attempt
3. Offer subscription pause (60 days)
4. Win-back discount (20-30%)
5. Executive outreach for high-value

**Email Template:**
```
Subject: [Name], let's fix this

Hi [Name],

I see things have been quiet with [Company]'s account.

Before anything else, I wanted to reach out personally.

We can:
→ Pause your subscription (up to 60 days, no charge)
→ Schedule a dedicated walkthrough session
→ Adjust your plan to better fit your needs

What would help most? Just reply.

[Signature]
```

### CHI 0-19: Churning
**Status:** Likely lost
**Cadence:** Exit sequence

**Actions:**
1. "Before you go" email with value summary
2. One-click easy cancellation (no friction)
3. Exit survey (3 questions max)
4. Offer to stay in touch
5. Add to 90-day win-back list

**Email Template:**
```
Subject: Before you cancel...

Hi [Name],

I see you're thinking about cancelling.

Before you go, here's what you achieved with us:
→ Total value delivered: $[Value]
→ Actions completed: [Count]
→ Time saved: [Hours] hours

I'd genuinely love to know what we could have done better:
[3-Question Survey Link]

Either way, thanks for giving us a try.

[Signature]
```

## Churn Prediction Signals

### High Risk (Immediate Action)
- No login in 14+ days
- Core actions dropped >50% WoW
- Viewed cancellation page
- Searched "cancel" or "refund"
- Payment failed 3+ days
- Support ticket unresolved 7+ days

### Medium Risk (Monitor)
- Login frequency declining 3 weeks
- Only using basic features
- Ignored last 2 emails
- NPS dropped (promoter → passive)
- Team members decreased

### Low Risk (Note)
- Seasonal usage pattern
- Key contact on vacation
- Company news (acquisition, etc.)

## Expansion Opportunities

### Upsell Triggers
| Signal | Action |
|--------|--------|
| >80% plan usage | "You're running out of minutes" email |
| Using higher-tier features | "Unlock X with upgrade" |
| Adding team members | Team plan offer |
| 3 months growth | Check-in + upgrade offer |

### Cross-Sell Triggers
| Signal | Offer |
|--------|-------|
| Using complementary workflow | Related product intro |
| Mentioned pain point | Product that solves it |
| Industry typically buys both | Bundle offer |

## Win-Back Campaigns

### 30-Day Win-Back
- Timing: 30 days after churn
- Offer: 30% off for 3 months
- Message: "We've improved X, Y, Z"

### 90-Day Win-Back
- Timing: 90 days after churn
- Offer: 50% off first month
- Message: "New features you'll love"

### Annual Win-Back
- Timing: 365 days after churn
- Offer: Free trial again
- Message: "A lot has changed"

## Metrics Dashboard

```json
{
  "retention_metrics": {
    "nrr": 112,
    "grr": 94,
    "logo_churn_rate": 3.2,
    "avg_chi": 74,
    "customers_by_health": {
      "advocates": 45,
      "healthy": 30,
      "monitor": 15,
      "at_risk": 7,
      "critical": 3
    }
  },
  "churn_analysis": {
    "churned_this_month": 5,
    "mrr_churned": 2495,
    "top_reasons": [
      "No longer need (40%)",
      "Switched to competitor (30%)",
      "Price (20%)",
      "Other (10%)"
    ]
  },
  "expansion": {
    "upgrades_this_month": 8,
    "expansion_mrr": 1600,
    "upsell_opportunities": 12
  }
}
```

## Response Templates

### Cancellation Request
```
Hi [Name],

I'm sorry to hear you're thinking of leaving.

Before you go, I'd love to understand what happened.
Would you be open to a quick 5-minute call?

If not, no problem — I can process the cancellation right away.
Just reply "cancel" and I'll take care of it.

[Signature]
```

### Payment Failed
```
Hi [Name],

Quick heads up — your payment for [Product] didn't go through.

This usually happens when:
→ Card expired
→ Insufficient funds
→ Bank security block

You can update your payment method here: [Link]

If you need help or want to pause your subscription,
just reply to this email.

[Signature]
```
