# Lead Scoring Skill (BRS)

Auto-invoked when scoring prospects or evaluating lead quality.

## Trigger Phrases
- "score this lead"
- "is this a good prospect"
- "lead quality"
- "buyer readiness"
- "should we contact"

## BRS (Buyer Readiness Score) Framework (0-100)

### Path A: Voice AI (Local Businesses)

#### 1. Operational Need (30 points max)

| Signal | Points | How to Verify |
|--------|--------|---------------|
| Open evenings/weekends | +10 | Google Business hours |
| Multiple locations | +8 | Website, Google Maps |
| >50 reviews | +7 | Google/Yelp count |
| Scheduling complaints in reviews | +5 | Review text analysis |
| High call volume indicators | +5 | "Call for appointment" |

#### 2. Digital Maturity (25 points max)

| Signal | Points | How to Verify |
|--------|--------|---------------|
| Modern, professional website | +8 | Visual inspection |
| Online booking exists | +7 | Website features |
| Active social media | +5 | Recent posts |
| Online payments accepted | +5 | Website/reviews |

#### 3. Growth Signals (25 points max)

| Signal | Points | How to Verify |
|--------|--------|---------------|
| Hiring in last 90 days | +10 | Indeed, LinkedIn |
| Review velocity increasing | +7 | Review dates |
| Expansion/new location | +5 | News, website |
| Running Google/Facebook ads | +3 | Ad transparency tools |

#### 4. Pain Indicators (20 points max)

| Signal | Points | How to Verify |
|--------|--------|---------------|
| Negative reviews about wait/hold | +10 | Review text |
| "Call for appointment" only | +5 | Website |
| Goes to voicemail during hours | +5 | Test call |

### Path B: Compliance (Startups)

#### 1. Compliance Pressure (35 points max)

| Signal | Points | How to Verify |
|--------|--------|---------------|
| Enterprise customers | +15 | Case studies, logos |
| Regulated vertical (health/fin) | +10 | Industry |
| Recent funding (6 months) | +10 | Crunchbase, news |

#### 2. Technical Fit (25 points max)

| Signal | Points | How to Verify |
|--------|--------|---------------|
| Cloud-native (AWS/GCP/Azure) | +10 | Job posts, tech stack |
| Modern stack (containers, CI/CD) | +8 | GitHub, job posts |
| API-first product | +7 | Documentation |

#### 3. Budget Signals (25 points max)

| Signal | Points | How to Verify |
|--------|--------|---------------|
| Series A or later | +15 | Crunchbase |
| Revenue >$1M ARR | +10 | News, estimates |

#### 4. Timing (15 points max)

| Signal | Points | How to Verify |
|--------|--------|---------------|
| Security/compliance job posting | +10 | LinkedIn, Indeed |
| Audit mentioned in news/posts | +5 | Google search |

## Enrichment Requirements

Before scoring, gather:

```json
{
  "company": {
    "name": "Acme Dental",
    "website": "https://acmedental.com",
    "industry": "dental",
    "employee_count": "11-50",
    "location": "Austin, TX",
    "founded": 2015,
    "hours": "Mon-Sat 8am-6pm"
  },
  "contact": {
    "name": "Sarah Johnson",
    "title": "Office Manager",
    "email": "sarah@acmedental.com",
    "linkedin": "linkedin.com/in/sarahjohnson",
    "phone": "+1-512-555-0123"
  },
  "signals": {
    "reviews_count": 127,
    "reviews_avg": 4.7,
    "review_keywords": ["wait", "busy", "hard to reach"],
    "hiring": true,
    "job_titles": ["Dental Hygienist", "Receptionist"],
    "recent_news": [],
    "competitors_used": ["Weave"],
    "tech_stack": [],
    "social_active": true
  }
}
```

## Routing Logic

```javascript
function routeLead(brs) {
  if (brs >= 60) {
    return {
      action: "CONTACT",
      next: "Add to outreach queue",
      sequence: brs >= 70 ? "enterprise" : "standard"
    };
  }
  return {
    action: "SKIP",
    next: "Archive with reason",
    reason: "BRS below threshold"
  };
}
```

## Output Template

```json
{
  "lead_id": "LEAD-YYYYMMDD-XXX",
  "company": "Acme Dental",
  "contact": "Sarah Johnson",
  "email": "sarah@acmedental.com",

  "brs_score": 78,
  "brs_breakdown": {
    "operational_need": {
      "score": 25,
      "max": 30,
      "signals": [
        "Open Saturdays (+10)",
        "127 reviews (+7)",
        "Scheduling complaints found (+5)"
      ]
    },
    "digital_maturity": {
      "score": 20,
      "max": 25,
      "signals": [
        "Modern website (+8)",
        "No online booking (-)",
        "Active Instagram (+5)",
        "Online payments (+5)"
      ]
    },
    "growth_signals": {
      "score": 18,
      "max": 25,
      "signals": [
        "Hiring receptionist (+10)",
        "Review velocity stable (+0)"
      ]
    },
    "pain_indicators": {
      "score": 15,
      "max": 20,
      "signals": [
        "Reviews mention 'hard to reach' (+10)",
        "Website says 'call for appointment' (+5)"
      ]
    }
  },

  "routing": "CONTACT",
  "sequence_type": "enterprise",

  "personalization_data": {
    "review_count": 127,
    "pain_quote": "Tried calling 3 times, kept going to voicemail",
    "location": "Austin, TX",
    "vertical": "dental"
  },

  "verification": {
    "email_valid": true,
    "suppression_check": "clear",
    "duplicate_check": "unique"
  }
}
```

## Quick Scoring Guide

### Path A Quick Check
- [ ] 50+ reviews? (+7)
- [ ] Open weekends? (+10)
- [ ] Modern website? (+8)
- [ ] Hiring? (+10)
- [ ] Complaints about reach? (+10)

**35+ points from quick check = Likely qualifies**

### Path B Quick Check
- [ ] Series A+? (+15)
- [ ] Enterprise customers? (+15)
- [ ] Cloud-native? (+10)
- [ ] Hiring security/compliance? (+10)

**30+ points from quick check = Likely qualifies**

## Disqualification Criteria

Automatic SKIP if:
- Email invalid or catch-all
- Already in CRM/suppression list
- Company <5 employees (Path B)
- Closed/out of business
- Consumer-only business
- Non-profit (unless specifically targeting)
