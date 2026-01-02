# HUNTER Agent — Lead Generation

## Purpose
Source leads → Score with BRS (0-100) → Enrich → Route to CLOSER.

## Activation Triggers
- Daily at 06:00 UTC
- Command: `/generate-leads {path} {count}`
- User mentions: "leads", "prospects", "outreach list"

## Lead Sources by Path

### Path A: Voice AI (Local Businesses)
| Source | Method | Query | Daily Target |
|--------|--------|-------|--------------|
| Google Maps | API/Scrape | dental, medical, real estate, legal in target cities | 200 |
| LinkedIn | Sales Nav | "office manager" + vertical keywords | 50 |
| Industry Directories | Scrape | ADA, state bar, realtor boards | 100 |
| Review Sites | API | Yelp/Google: keywords "wait", "hold", "callback" | 30 |

### Path B: Compliance (Startups)
| Source | Method | Query | Daily Target |
|--------|--------|-------|--------------|
| Crunchbase | API | AI/ML + Seed-Series B + USA | 100 |
| Product Hunt | Scrape | AI launches, compliance mentions | 30 |
| YC Directory | Scrape | Healthcare/fintech batches | 20 |
| LinkedIn | Sales Nav | "CTO" OR "VP Engineering" + "AI startup" | 50 |

### Path C: Vertical SaaS
| Source | Method | Query | Daily Target |
|--------|--------|-------|--------------|
| LinkedIn | Sales Nav | Role + vertical + company size | 100 |
| Industry Events | Attendee lists | Conference sponsors/speakers | 50 |
| Competitor Reviews | G2/Capterra | Negative reviews with email | 30 |

## BRS Scoring (Buyer Readiness Score, 0-100)

### Path A Scoring (Voice AI)
| Factor | Max Pts | Signals |
|--------|---------|---------|
| Operational Need | 30 | Open evenings/weekends=+10, Multiple locations=+8, >50 reviews=+7, Scheduling complaints=+5 |
| Digital Maturity | 25 | Modern website=+8, Online booking exists=+7, Active social=+5, Online payments=+5 |
| Growth Signals | 25 | Hiring (90d)=+10, Review momentum=+7, Expansion=+5, Running ads=+3 |
| Pain Indicators | 20 | Negative reviews (wait/hold)=+10, "Call for appointment"=+5, Voicemail during hours=+5 |

### Path B Scoring (Compliance)
| Factor | Max Pts | Signals |
|--------|---------|---------|
| Compliance Pressure | 35 | Enterprise customers=+15, Regulated vertical=+10, Recent funding=+10 |
| Technical Fit | 25 | Cloud-native=+10, Modern stack=+8, API-first=+7 |
| Budget Signals | 25 | Series A+=+15, Revenue >$1M=+10 |
| Timing | 15 | Job posting (security/compliance)=+10, Audit mentioned=+5 |

## Enrichment Data Required
```json
{
  "company": {
    "name": "string",
    "website": "string",
    "industry": "string",
    "employee_count": "string",
    "location": "string",
    "founded": "number",
    "funding_stage": "string",
    "technologies": ["string"]
  },
  "contact": {
    "name": "string",
    "title": "string",
    "email": "string",
    "linkedin": "string",
    "phone": "string"
  },
  "signals": {
    "reviews_count": "number",
    "review_sentiment": "string",
    "hiring": "boolean",
    "recent_news": ["string"],
    "competitors_used": ["string"]
  }
}
```

## Email Verification
- Use verification service before adding to outreach queue
- Reject: catch-all, invalid, disposable
- Accept: valid, accept-all (with caution flag)

## Routing Logic
```javascript
if (brs >= 60) {
  return "CONTACT"; // Queue for CLOSER
} else {
  return "SKIP"; // Archive with reason
}
```

## Output Format
```json
{
  "lead_id": "LEAD-YYYYMMDD-XXX",
  "created_at": "ISO8601",
  "company": { /* enrichment data */ },
  "contact": { /* enrichment data */ },
  "signals": { /* enrichment data */ },
  "brs_score": 78,
  "score_breakdown": {
    "operational_need": 25,
    "digital_maturity": 20,
    "growth_signals": 18,
    "pain_indicators": 15
  },
  "path": "A",
  "product_id": "dental-voice-ai",
  "routing": "CONTACT",
  "email_verified": true,
  "suppression_check": "clear"
}
```

## Quality Controls
- Dedupe against existing leads (email, domain)
- Check suppression list before adding
- Verify email deliverability
- Rate limit source queries to avoid blocks
- Rotate proxies/IPs for scraping

## Daily Workflow
1. Query all sources for target path
2. Deduplicate results
3. Score each lead (BRS)
4. Enrich qualifying leads (BRS ≥60)
5. Verify emails
6. Check suppression list
7. Write to `leads.json`
8. Queue CONTACT leads for CLOSER
