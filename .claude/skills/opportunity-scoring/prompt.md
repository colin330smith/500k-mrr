# Opportunity Scoring Skill

Auto-invoked when evaluating product opportunities or market signals.

## Trigger Phrases
- "score this opportunity"
- "evaluate this idea"
- "is this worth building"
- "opportunity score"
- "market potential"

## Scoring Framework (0-100)

### 1. ARPU Potential (30 points max)

| Monthly ARPU | Points | Rationale |
|--------------|--------|-----------|
| $1,000+ | 30 | Enterprise pricing power |
| $500-999 | 25 | Strong B2B economics |
| $200-499 | 18 | Viable mid-market |
| $50-199 | 10 | Volume required |
| <$50 | 3 | Consumer economics, avoid |

**How to estimate ARPU:**
- Check competitor pricing pages
- Look for willingness-to-pay signals ("I'd pay $X")
- Consider buyer type (Enterprise > SMB > Consumer)
- Factor in switching costs

### 2. Validation Signals (20 points max)

| Signal | Points | Evidence Required |
|--------|--------|-------------------|
| Competitors charging >$100/mo | 20 | Pricing pages, reviews |
| Multiple people asking, no solution | 15 | 3+ independent requests |
| Growing search volume | 12 | Google Trends data |
| Single request, strong signal | 8 | Detailed pain description |
| Theoretical problem | 3 | No evidence of real demand |

**Strong validation indicators:**
- "I'd pay for this"
- "Shut up and take my money"
- "Why doesn't this exist"
- Dollar amounts mentioned
- Time waste quantified

### 3. Build Speed (15 points max)

| Timeline | Points | Scope |
|----------|--------|-------|
| 1-3 days | 15 | Landing + core action + payment |
| 4-7 days | 12 | Above + integrations |
| 1-2 weeks | 8 | Complex core feature |
| 2-4 weeks | 4 | Multiple features needed |
| >4 weeks | 0 | Too complex for MVP |

**Speed factors:**
- Existing templates/boilerplate available
- Standard tech stack (Next.js + Supabase)
- No novel ML/AI development
- Clear, simple core action

### 4. Competition (15 points max)

| Landscape | Points | Opportunity |
|-----------|--------|-------------|
| Overpriced incumbents only | 15 | Undercut and win |
| No direct competitors | 12 | First mover advantage |
| Weak/outdated competitors | 10 | Better execution wins |
| Moderate competition | 6 | Need differentiation |
| Strong, well-funded competition | 0 | Avoid |

**Blue ocean signals:**
- "X is too expensive"
- "X sucks but there's nothing else"
- Incumbents haven't updated in years
- Market too small for big players
- Problem is new (regulatory, tech shift)

### 5. Strategic Fit (20 points max)

| Path | Points | Characteristics |
|------|--------|-----------------|
| A: Voice AI | 20 | High margin, $500-1000 ARPU, recurring |
| B: Compliance | 20 | Enterprise, $800-2500 ARPU, sticky |
| C: Vertical SaaS | 15 | Mid-market, $200-500 ARPU |
| D: Micro-SaaS | 10 | Volume play, $29-199 ARPU |

**Fit criteria:**
- Aligns with existing tech stack
- Reusable components across products
- Clear ICP (Ideal Customer Profile)
- Scalable go-to-market

## Routing Logic

```javascript
function routeOpportunity(score, arpu) {
  if (score >= 75 && arpu >= 500) {
    return {
      action: "BUILD_IMMEDIATELY",
      next: "Spawn ARCHITECT agent",
      priority: "P0"
    };
  }
  if (score >= 70 && arpu >= 200) {
    return {
      action: "BUILD_QUEUE",
      next: "Add to build queue",
      priority: "P1"
    };
  }
  if (score >= 60) {
    return {
      action: "BACKLOG",
      next: "Review weekly",
      priority: "P2"
    };
  }
  return {
    action: "ARCHIVE",
    next: "Log and forget",
    priority: "P3"
  };
}
```

## Output Template

```json
{
  "opportunity_id": "OPP-YYYYMMDD-XXX",
  "problem_statement": "...",
  "target_market": "...",
  "evidence": ["url1", "url2"],

  "score_breakdown": {
    "arpu_potential": {
      "score": 25,
      "max": 30,
      "estimate": "$599/mo",
      "rationale": "Competitor X charges $899, budget buyers available"
    },
    "validation": {
      "score": 18,
      "max": 20,
      "signals": ["3 Reddit posts", "$500 WTP mentioned"],
      "rationale": "Multiple independent requests with price anchors"
    },
    "build_speed": {
      "score": 15,
      "max": 15,
      "estimate": "2 days",
      "rationale": "Standard CRUD + Stripe, no novel tech"
    },
    "competition": {
      "score": 15,
      "max": 15,
      "landscape": "One overpriced incumbent",
      "rationale": "Market leader at $1500/mo, no innovation"
    },
    "strategic_fit": {
      "score": 20,
      "max": 20,
      "path": "A",
      "rationale": "Voice AI, aligns with Vapi stack"
    }
  },

  "total_score": 93,
  "arpu_estimate": 599,
  "path": "A",
  "routing": "BUILD_IMMEDIATELY",

  "blue_ocean_indicators": [
    "Incumbent 2.5x our price point",
    "No updates to competitor in 18 months",
    "Vertical-specific needs unaddressed"
  ],

  "risks": [
    "Market size may be limited",
    "Requires industry expertise for content"
  ],

  "next_steps": [
    "Spawn ARCHITECT agent",
    "Create dental-voice-ai product",
    "Deploy within 3 days"
  ]
}
```

## Quick Scoring Checklist

- [ ] Can we charge $500+/month?
- [ ] Do 3+ people have this problem?
- [ ] Can we build MVP in <7 days?
- [ ] Is competition weak or overpriced?
- [ ] Does it fit Path A or B?

**5 checks = BUILD_IMMEDIATELY**
**4 checks = BUILD_QUEUE**
**3 checks = BACKLOG**
**<3 checks = ARCHIVE**
