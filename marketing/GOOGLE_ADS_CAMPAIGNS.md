# MedSpa RevAI - Google Ads Campaigns

## Campaign Structure

### Campaign 1: High-Intent Keywords (Search)
**Daily Budget:** $50-100
**Bidding:** Target CPA $75 (aiming for 6.6x LTV/CAC)

#### Ad Group 1: No-Show Recovery
**Keywords:**
- med spa no show solution
- reduce no shows med spa
- no show recovery software
- appointment no show prevention
- med spa cancellation recovery
- aesthetic practice no show rate

**Ad Copy:**
```
Headline 1: Stop Losing $8K/Mo to No-Shows
Headline 2: AI Recovers 70% of Missed Appointments
Headline 3: 14-Day Free Trial - No Credit Card
Description 1: AI texts patients within 1 hour of missed appointment. 70% rebook within 48 hours. Works with any booking system.
Description 2: Med spas lose $8,000+/month to no-shows. Our AI recovers that revenue automatically. Try free for 14 days.
```

#### Ad Group 2: Lead Response
**Keywords:**
- med spa lead management
- aesthetic lead follow up
- med spa CRM
- fast lead response medspa
- med spa lead conversion
- aesthetic practice leads

**Ad Copy:**
```
Headline 1: 79% of Your Leads Book Elsewhere
Headline 2: AI Responds in Under 5 Minutes
Headline 3: 24/7 Lead Response - Start Free
Description 1: Slow follow-up costs med spas $12K/month. Our AI responds to every lead in under 5 minutes, 24/7.
Description 2: Stop losing leads to slow response. AI handles inquiries instantly, books consultations while you sleep.
```

#### Ad Group 3: AI Receptionist
**Keywords:**
- med spa ai receptionist
- ai answering service medspa
- virtual receptionist medical spa
- automated receptionist aesthetic
- ai phone answering med spa

**Ad Copy:**
```
Headline 1: AI Receptionist for Med Spas
Headline 2: Answers Calls, Books Appointments
Headline 3: $497/mo - Replaces $3K/mo Staff
Description 1: Never miss another call. AI handles pricing questions, books appointments, and transfers complex calls to you.
Description 2: Your AI receptionist works 24/7, sounds natural, and costs 85% less than a human. Try it free.
```

### Campaign 2: Competitor Keywords (Search)
**Daily Budget:** $30
**Bidding:** Manual CPC, max $8

**Keywords:**
- boulevard spa software
- mangomint alternative
- vagaro for med spa
- meevo alternative
- zenoti alternative
- pabau alternative

**Ad Copy:**
```
Headline 1: Switch to AI-First Scheduling
Headline 2: No More Missed Calls or No-Shows
Headline 3: Import Your Data - Start Free
Description: Your current software doesn't recover no-shows or answer calls 24/7. Ours does. See the difference with a free trial.
```

### Campaign 3: Remarketing (Display)
**Daily Budget:** $20
**Audience:** Website visitors who didn't convert

**Ad Sizes:** 300x250, 728x90, 300x600

**Copy:**
```
Still losing revenue to no-shows?
See your personalized ROI →
[Calculate Now]
```

### Campaign 4: YouTube Pre-Roll
**Daily Budget:** $30
**Targeting:** Med spa owners, aesthetic professionals

**Script (15 sec):**
```
"Med spa owners: you're losing $8,000 a month to no-shows and slow lead response. MedSpa RevAI fixes both automatically. Try our AI demo right now - call 833-425-1223."
```

---

## Conversion Tracking Setup

### 1. Create Conversion Actions in Google Ads

1. Go to Tools & Settings → Conversions
2. Create these conversion actions:

| Name | Category | Value | Count |
|------|----------|-------|-------|
| Lead - ROI Calculator | Lead | $50 | Every |
| Lead - Email Signup | Lead | $25 | Every |
| Trial Started | Purchase | $100 | Every |
| Purchase | Purchase | $497 | Every |

### 2. Add Conversion Tags

The tracking.js file already fires these events. Just link your Google Ads account:

```javascript
gtag('event', 'conversion', {
    'send_to': 'AW-XXXXXXXXXX/lead',  // For leads
});

gtag('event', 'conversion', {
    'send_to': 'AW-XXXXXXXXXX/purchase',
    'value': 497,
    'currency': 'USD'
});
```

---

## Landing Page URLs

| Campaign | Landing Page |
|----------|--------------|
| No-Show Keywords | /reduce-no-shows.html |
| Lead Response | /lead-response-time.html |
| AI Receptionist | /ai-receptionist.html |
| Competitor | /index.html |
| Remarketing | /roi-calculator.html |

---

## Budget Allocation (First Month)

| Campaign | Daily | Monthly |
|----------|-------|---------|
| High-Intent Search | $80 | $2,400 |
| Competitor | $30 | $900 |
| Remarketing | $20 | $600 |
| YouTube | $30 | $900 |
| **Total** | **$160** | **$4,800** |

**Target Metrics:**
- CPC: $3-6
- CTR: 4-6%
- Conversion Rate: 3-5%
- CPA: $50-100
- Target ROAS: 5x (LTV $2,500 / CAC $500)

---

## Negative Keywords (Apply to All Campaigns)

```
free
cheap
diy
how to
what is
tutorial
course
training
jobs
salary
career
indeed
glassdoor
```

---

## Quick Launch Checklist

- [ ] Create Google Ads account (if needed)
- [ ] Set up billing
- [ ] Add conversion tracking (link to GA4)
- [ ] Create campaigns from structure above
- [ ] Set up audiences for remarketing
- [ ] Enable auto-tagging
- [ ] Set up search query monitoring
- [ ] Schedule weekly optimization reviews
