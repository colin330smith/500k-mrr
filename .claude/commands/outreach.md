# Outreach Command

Start outreach sequences for qualified leads.

## Usage
```
/outreach                     # Process all queued leads
/outreach LEAD-20250101-001   # Specific lead
/outreach --path A            # All leads for path A
/outreach --limit 50          # Limit batch size
```

## Prerequisites
- Lead BRS ≥60
- Email verified
- Not in suppression list
- Within daily send limits

## Execution Steps

### Phase 1: Queue Processing
1. Load leads with status CONTACT
2. Apply filters (path, limit)
3. Check daily volume limits
4. Prioritize by BRS score

### Phase 2: Personalization
1. Load lead enrichment data
2. Calculate personalization variables:
   - {BUSINESS_NAME}
   - {FIRST_NAME}
   - {VERTICAL}
   - {REVIEW_COUNT}
   - {CITY}
   - {CALCULATED_LOSS} (Path A)
   - {FUNDING_ROUND} (Path B)
3. Select sequence template (by path + BRS tier)
4. Render email content

### Phase 3: Compliance Checks
1. Suppression list verification
2. Cool-down period check
3. Subject line scan (no deception)
4. Footer requirements (address, unsubscribe)

### Phase 4: Send
1. Queue with sending service (Resend)
2. Track send event
3. Update lead status
4. Log for analytics

### Phase 5: Sequence Management
1. Schedule follow-ups (Day 3, 6, 10)
2. Stop on any reply
3. Stop on unsubscribe
4. Track open/click events

## Email Sequences

**Sequence A: Enterprise Voice AI**
- Day 1: ROI Focus (missed call math)
- Day 3: Case Study (similar business)
- Day 6: Direct Offer (free trial)
- Day 10: Breakup (final touch)

**Sequence B: Compliance**
- Day 1: Trigger Event (funding congrats)
- Day 3: Pain Point (deal-killing question)
- Day 6: Social Proof (customer story)
- Day 10: Breakup (final touch)

## Volume Limits
- New domain (<4 weeks): 20 emails/day
- Warmed domain: 100 emails/day
- Per-lead: Max 4 emails in sequence
- Minimum gap: 2 days between emails

## Quality Thresholds

| Metric | Threshold | Auto-Action |
|--------|-----------|-------------|
| Open Rate | <15% | Pause, A/B test subjects |
| Reply Rate | <2% | Reduce volume 50% |
| Unsubscribe | >2% | Pause 24h |
| Spam | >0.1% | **STOP ALL** |
| Bounce | >5% | Pause, clean list |

## Output

```json
{
  "outreach_id": "OUT-YYYYMMDD-XXX",
  "processed": 50,
  "sent": 47,
  "skipped": 3,
  "skip_reasons": {
    "suppressed": 1,
    "cooldown": 1,
    "limit_reached": 1
  },
  "sequences_started": 47,
  "follow_ups_scheduled": 141,
  "metrics": {
    "daily_sent": 47,
    "daily_limit": 100,
    "remaining": 53
  }
}
```
