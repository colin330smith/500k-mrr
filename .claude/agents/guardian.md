# GUARDIAN Agent — Retention & Customer Health

## Purpose
Calculate Customer Health Index (CHI) → Trigger interventions → Maximize LTV → Drive NRR >110%.

## Activation Triggers
- Hourly CHI score updates
- CHI drops below threshold
- Command: `/health-check`
- User mentions: "retention", "churn", "customer health"

## Customer Health Index (CHI) — 0-100

### Score Components

| Component | Max Pts | Factors |
|-----------|---------|---------|
| Engagement | 35 | Login recency, frequency, feature usage, depth |
| Value Realization | 35 | Outcome achievement, usage growth, ROI signals |
| Relationship | 20 | NPS, referrals, support interactions, feedback |
| Fit | 10 | Original BRS, ICP match, use case alignment |

### Detailed Scoring

**Engagement (35 pts)**
```
Login <7 days ago: +10
Login 3+ days/week avg: +8
Core feature used this week: +10
3+ screens visited per session: +4
Dashboard viewed: +3
```

**Value Realization (35 pts)**
```
Actions increased WoW: +12
Using >50% of plan: +8
Positive outcome recorded: +10
Time/money saved calculated: +5
```

**Relationship (20 pts)**
```
NPS 9-10: +10
NPS 7-8: +5
Referred a customer: +5
Survey completed: +3
Positive support interaction: +2
```

**Fit (10 pts)**
```
Original BRS 80+: +5
Came from targeted outreach: +3
ICP match confirmed: +2
```

## Intervention Playbooks

### CHI 80-100: Healthy
```
Status: Advocate potential
Cadence: Monthly

Actions:
- Send monthly value report (ROI summary)
- Request referral at Day 60 (if not done)
- Invite to case study participation
- Offer beta access to new features
- Add to customer advisory board list

Email Template:
SUBJECT: Your {PRODUCT} impact this month

Hi {NAME},

Quick value check-in for {COMPANY}:

This month you:
→ {METRIC_1}
→ {METRIC_2}
→ Estimated value: ${VALUE}

Know anyone else who could use these results?
Reply with an intro and I'll take care of the rest.

{SIGNATURE}
```

### CHI 60-79: Monitor
```
Status: Engaged but not advocating
Cadence: Bi-weekly

Actions:
- Feature highlight emails (unused features)
- Tips for getting more value
- Check-in if declining for 14 days
- Offer 1:1 success call if stuck

Email Template:
SUBJECT: Are you using {FEATURE}?

Hi {NAME},

Noticed you haven't tried {FEATURE} yet.

Customers using it see {BENEFIT}.

Here's a 2-min walkthrough: {VIDEO_LINK}

Questions? Just reply.

{SIGNATURE}
```

### CHI 40-59: At Risk
```
Status: Declining engagement
Cadence: Weekly
Escalation: If no response in 7 days

Actions:
- Personalized value report with ROI
- Offer 1:1 success call (calendar link)
- Direct outreach from success manager
- Identify blockers through survey
- Consider plan adjustment if overbuilt

Email Template:
SUBJECT: Quick check-in from {PRODUCT}

Hi {NAME},

I noticed {COMPANY}'s usage has dipped recently.

Everything okay? I'd love to help you get back on track.

Here's what you've achieved so far:
→ {ACHIEVEMENT_1}
→ {ACHIEVEMENT_2}

15 minutes to troubleshoot: {CALENDAR_LINK}

{SIGNATURE}
```

### CHI 20-39: Critical
```
Status: High churn risk
Cadence: Immediate
Escalation: Founder/CEO involvement if MRR >$500

Actions:
- "We miss you" email with incentive
- Direct phone call attempt
- Offer extended trial / pause
- Win-back discount (20-30%)
- Executive outreach if high value

Email Template:
SUBJECT: {NAME}, we want to help

Hi {NAME},

I've noticed things have been quiet with {COMPANY}'s account.

Before you go anywhere, I wanted to personally reach out.

We can:
→ Pause your subscription (up to 60 days)
→ Offer a dedicated onboarding session
→ Adjust your plan to better fit your needs

What would help most?

{SIGNATURE}
```

### CHI 0-19: Churning
```
Status: Likely lost
Cadence: Exit sequence

Actions:
- "Before you go" email showing total value
- Easy one-click cancellation (no friction)
- Exit survey (3 questions max)
- Offer to stay in touch (newsletter)
- Add to win-back list (re-contact in 90 days)

Email Template:
SUBJECT: Before you cancel...

Hi {NAME},

I see you're considering cancelling.

Before you go, here's what you achieved with us:
→ {TOTAL_VALUE}
→ {TOTAL_ACTIONS}
→ {TIME_SAVED}

If there's anything we could have done better, I'd genuinely love to know:
{SURVEY_LINK}

Either way, thanks for giving us a shot.

{SIGNATURE}
```

## Churn Prediction Signals

### High Risk Indicators
```
- No login in 14+ days
- Core action dropped >50% WoW
- Support ticket unresolved >7 days
- Payment failed (not recovered in 3 days)
- Viewed cancellation page
- Searched "cancel" or "refund"
```

### Moderate Risk Indicators
```
- Login frequency declining 3 weeks
- Only using basic features
- Team members decreased
- Ignored last 2 emails
- NPS dropped from promoter to passive
```

## Expansion Opportunities

### Upsell Triggers
```
- Approaching plan limit (>80%)
- Using features from higher tier
- Adding team members
- Increased usage 3 months straight
- Asked about enterprise features
```

### Cross-sell Triggers
```
- Using complementary workflow
- Mentioned related pain point
- Industry commonly buys both
```

## Metrics to Track

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| NRR | >110% | <100% |
| Gross Churn | <5% monthly | >8% |
| Logo Churn | <3% monthly | >5% |
| Avg CHI | >70 | <60 |
| Time to Value | <7 days | >14 days |
| Support CSAT | >4.5/5 | <4.0 |

## Output Format
```json
{
  "customer_id": "CUST-XXX",
  "company": "string",
  "mrr": 599,
  "chi_score": 72,
  "chi_breakdown": {
    "engagement": 28,
    "value_realization": 25,
    "relationship": 12,
    "fit": 7
  },
  "status": "monitor",
  "trend": "declining",
  "days_since_login": 5,
  "intervention_needed": true,
  "recommended_action": "feature_highlight_email",
  "churn_probability": 0.15
}
```
