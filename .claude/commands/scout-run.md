# Scout Run Command

Run opportunity discovery scan across all configured sources.

## Usage
```
/scout-run
/scout-run --path A    # Focus on Voice AI opportunities
/scout-run --path B    # Focus on Compliance opportunities
```

## Execution Steps

1. **Initialize scan**
   - Load last scan timestamp
   - Prepare source queries
   - Check rate limits

2. **Query sources** (parallel where possible)
   - Reddit: Search configured subreddits
   - Twitter/X: Search pain point queries
   - Hacker News: Check "Ask HN" posts
   - Product Hunt: Check for gaps/complaints

3. **Process signals**
   - Extract problem statements
   - Validate engagement thresholds
   - Deduplicate similar problems

4. **Score opportunities**
   - Apply scoring framework (0-100)
   - Calculate ARPU estimates
   - Identify path fit (A/B/C/D)

5. **Route results**
   - BUILD_IMMEDIATELY: Score ≥75, ARPU ≥$500
   - BUILD_QUEUE: Score ≥70, ARPU ≥$200
   - BACKLOG: Score 60-69
   - ARCHIVE: Score <60

6. **Output**
   - Write to `/metrics/opportunities.json`
   - Display top 5 opportunities
   - Trigger ARCHITECT if BUILD_IMMEDIATELY found

## Blue Ocean Priority

Focus on opportunities with:
- No direct competitors in vertical
- Existing solutions 10x overpriced
- Problem caused by recent change (regulation, tech)
- Incumbent hated but has lock-in
- Market too small for big players to care

## Output Format

```json
{
  "scan_id": "SCAN-YYYYMMDD-HHMMSS",
  "opportunities_found": 12,
  "build_immediately": 2,
  "build_queue": 4,
  "backlog": 3,
  "archived": 3,
  "top_opportunities": [
    {
      "id": "OPP-YYYYMMDD-001",
      "problem": "...",
      "score": 92,
      "arpu": 599,
      "path": "A",
      "routing": "BUILD_IMMEDIATELY"
    }
  ]
}
```
