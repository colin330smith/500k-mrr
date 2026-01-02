# Generate Leads Command

Source and score leads for a specific product path.

## Usage
```
/generate-leads A 200      # 200 leads for Voice AI path
/generate-leads B 100      # 100 leads for Compliance path
/generate-leads A 50 --vertical dental    # Specific vertical
```

## Parameters
- `path`: A (Voice AI), B (Compliance), C (Vertical SaaS), D (Micro-SaaS)
- `count`: Number of leads to generate (max 500/day)
- `--vertical`: Optional vertical filter

## Execution Steps

### Phase 1: Source Discovery
1. Query configured sources for path
2. Apply vertical filters if specified
3. Collect raw prospect data
4. Deduplicate against existing leads

### Phase 2: Enrichment
1. Company data (name, website, size, location)
2. Contact data (name, title, email, phone)
3. Signal data (reviews, hiring, news)
4. Technology stack (for Path B)

### Phase 3: Scoring (BRS 0-100)

**Path A Scoring:**
| Factor | Max | Signals |
|--------|-----|---------|
| Operational Need | 30 | Hours, locations, reviews |
| Digital Maturity | 25 | Website, booking, social |
| Growth Signals | 25 | Hiring, expansion, ads |
| Pain Indicators | 20 | Review complaints, voicemail |

**Path B Scoring:**
| Factor | Max | Signals |
|--------|-----|---------|
| Compliance Pressure | 35 | Enterprise customers, regulated |
| Technical Fit | 25 | Cloud-native, modern stack |
| Budget Signals | 25 | Funding, revenue |
| Timing | 15 | Job postings, audit mentions |

### Phase 4: Verification
1. Email validation (reject invalid/catch-all)
2. Suppression list check
3. Duplicate check
4. Rate limit compliance

### Phase 5: Routing
- BRS ≥60 → CONTACT (queue for CLOSER)
- BRS <60 → SKIP (archive with reason)

## Sources by Path

**Path A (Voice AI):**
- Google Maps API (dental, medical, legal, real estate)
- LinkedIn Sales Navigator
- Industry directories (ADA, state bar, realtor boards)
- Review sites (Yelp, Google Reviews)

**Path B (Compliance):**
- Crunchbase (AI/ML startups, Seed-Series B)
- Product Hunt (AI launches)
- YC Directory (healthcare/fintech batches)
- LinkedIn (CTO/VP Eng at AI companies)

## Output

```json
{
  "generation_id": "GEN-YYYYMMDD-XXX",
  "path": "A",
  "vertical": "dental",
  "requested": 200,
  "sourced": 187,
  "enriched": 175,
  "verified": 168,
  "qualified": 142,
  "routing": {
    "contact": 142,
    "skip": 26
  },
  "avg_brs": 71,
  "leads_file": "/leads/dental-20250101.json"
}
```
