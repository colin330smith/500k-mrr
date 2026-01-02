# MANUS 3.0 — Autonomous SaaS Portfolio Engine

> **Mission**: $500K MRR in 12 months via autonomous multi-product SaaS portfolio
> **Method**: Build fast, kill fast, double down on winners

## Project Architecture

This is a multi-agent system for autonomous SaaS product discovery, building, and scaling. The system operates via 6 specialized subagents.

### Subagents Available
| Agent | Purpose | Invoke When |
|-------|---------|-------------|
| scout | Opportunity discovery from Reddit/X/forums | Finding new product ideas |
| architect | MVP generation and deployment | Building products (score ≥75) |
| hunter | Lead generation and enrichment | Sourcing prospects for products |
| closer | Outreach sequences and conversion | Contacting leads (BRS ≥60) |
| guardian | Customer health and retention | Managing existing customers |
| sentinel | Safety, compliance, circuit breakers | System monitoring |

### Decision Framework
```
Opportunity Score ≥75 + ARPU ≥$500 → BUILD_IMMEDIATELY
Opportunity Score ≥70 + ARPU ≥$200 → BUILD_QUEUE
Opportunity Score 60-69 → BACKLOG
Opportunity Score <60 → ARCHIVE

Lead BRS ≥60 → CONTACT
Lead BRS <60 → SKIP

Customer CHI <60 → INTERVENTION
```

## Tech Stack

| Layer | Service | Free Tier Limit |
|-------|---------|-----------------|
| Frontend | Vercel (Next.js 14) | 100GB bandwidth |
| Database | Supabase | 500MB storage |
| Auth | Supabase Auth | Unlimited |
| LLM | Groq (fast) / OpenAI (quality) | Rate limited |
| Voice AI | Vapi | Credits |
| Email | Resend | 3,000/mo |
| Payments | Stripe | N/A |
| Analytics | PostHog | 1M events/mo |

## Commands
- `/scout-run` — Opportunity discovery scan
- `/build-mvp {id}` — Generate and deploy MVP
- `/generate-leads {path} {count}` — Source leads
- `/outreach {lead_id}` — Start outreach sequence
- `/health-check` — System health audit

## Execution Principles
1. **SPEED**: Launch in days, not weeks
2. **PRICE WITH COURAGE**: $500+ ARPU or don't build
3. **KILL FAST**: 14 days no traction = dead
4. **DOUBLE DOWN**: Winner gets 10x, losers get zero
5. **ENTERPRISE FROM DAY ONE**: Security, compliance, SLAs are features
6. **RETENTION IS REVENUE**: NRR >110% = compound growth

## File Structure
```
manus/
├── CLAUDE.md
├── .mcp.json
├── .claude/
│   ├── agents/
│   ├── commands/
│   └── skills/
├── products/
├── leads/
├── outreach/
└── metrics/
```

**The Loop**: Build → Launch → Measure → Decide → Repeat
