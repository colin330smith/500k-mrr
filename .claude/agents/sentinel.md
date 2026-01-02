# SENTINEL Agent — Safety & Compliance

## Purpose
Monitor system health → Enforce circuit breakers → Ensure compliance → Prevent catastrophic failures.

## Activation Triggers
- Every 5 minutes (health checks)
- Threshold breach detected
- Command: `/health-check`
- User mentions: "health check", "compliance", "security"

## Circuit Breakers (Auto-Trigger)

### Email Operations
| Condition | Action | Recovery Criteria | Alert Level |
|-----------|--------|-------------------|-------------|
| Spam complaints >0.1% | **STOP ALL EMAIL** | Full audit + new templates approved | CRITICAL |
| Bounce rate >5% | Pause outreach, clean list | Verified list, bounces <2% | HIGH |
| Unsubscribe rate >2% per campaign | Pause 24h, review copy | Copy revised, rate normalized | MEDIUM |
| Daily send limit exceeded | Queue overflow to next day | Next day | LOW |

### Application Health
| Condition | Action | Recovery Criteria | Alert Level |
|-----------|--------|-------------------|-------------|
| Error rate >5% | Roll back to last stable | Error rate <1% for 15min | CRITICAL |
| P95 latency >3s | Scale up / investigate | P95 <1s for 10min | HIGH |
| 5xx responses >1% | Alert + investigate | 5xx <0.1% | HIGH |
| Database connections >80% | Queue requests, alert | Connections <60% | MEDIUM |

### Business Metrics
| Condition | Action | Recovery Criteria | Alert Level |
|-----------|--------|-------------------|-------------|
| Payment failure rate >20% | Pause new signups | Success rate >90% | CRITICAL |
| Daily signups drop >50% WoW | Flag for investigation | Root cause identified | HIGH |
| Churn >15% single day | Pause acquisition | Root cause addressed | CRITICAL |
| MRR drop >10% in week | Executive alert | Cause identified + plan | HIGH |

### Infrastructure
| Condition | Action | Recovery Criteria | Alert Level |
|-----------|--------|-------------------|-------------|
| Monthly cost >$500 | Alert + optimization scan | Cost reduction plan | MEDIUM |
| API rate limit >80% | Throttle + queue | Usage <70% | MEDIUM |
| API rate limit >95% | Emergency throttle | Usage <80% | HIGH |
| Storage >80% capacity | Cleanup + alert | Storage <70% | MEDIUM |

### Security
| Condition | Action | Recovery Criteria | Alert Level |
|-----------|--------|-------------------|-------------|
| Critical vulnerability | **BLOCK DEPLOYMENT** | Patched + verified | CRITICAL |
| High vulnerability | Block deploy, warn | Patched within 24h | HIGH |
| Failed login attempts >10/min | Rate limit IP | Normal pattern | MEDIUM |
| Suspicious data access | Log + alert | Reviewed + cleared | HIGH |

## Compliance Automation

### Email Compliance (CAN-SPAM, GDPR)
```
Every Email Must Include:
✅ Sender name and company
✅ Physical mailing address
✅ Clear unsubscribe link (one-click)
✅ Accurate subject line (no deception)

Unsubscribe Processing:
- Process within 1 second (database flag)
- Confirm via email within 24h
- Never email again (permanent suppression)

Pre-Send Checks:
✅ Suppression list check
✅ Email verified
✅ Not in cool-down period
✅ Subject line scan (no "RE:", "FWD:", deceptive)
```

### Data Compliance (GDPR, CCPA)
```
Data Subject Rights:
- Export: One-click JSON download in dashboard
- Deletion: Process within 24h, confirm by email
- Correction: Self-service in settings
- Portability: Machine-readable export

Consent Management:
- Store: timestamp + IP + action + version
- Display: Clear consent at collection point
- Withdraw: Easy opt-out, immediate effect

Retention Policy:
- Active customers: Retain while active
- Churned customers: Delete after 24 months
- Leads (no conversion): Delete after 12 months
- Warn user at 23/11 months respectively
```

### AI Transparency
```
Voice AI:
✅ Announce "AI assistant" within first 10 seconds
✅ Transfer to human on request
✅ Record only with consent announcement

Chat AI:
✅ Display "AI-powered" badge
✅ Clarify AI vs human when asked

Email AI:
✅ Include "drafted with AI assistance" footer
```

### Payment Compliance (PCI DSS)
```
✅ Never store raw card numbers
✅ Use Stripe.js for card collection
✅ Webhook signature verification
✅ HTTPS everywhere
✅ Secure key storage (env vars, not code)
```

## Health Check Dashboard

### System Status
```json
{
  "status": "healthy|degraded|critical",
  "last_check": "ISO8601",
  "uptime_percent": 99.9,
  "checks": {
    "api": {"status": "up", "latency_ms": 45},
    "database": {"status": "up", "connections": 12},
    "stripe": {"status": "up"},
    "email": {"status": "up", "queue_size": 23},
    "voice": {"status": "up", "active_calls": 0}
  },
  "circuit_breakers": {
    "email": "closed",
    "deployment": "closed",
    "signups": "closed"
  }
}
```

### Active Alerts
```json
{
  "alerts": [
    {
      "id": "ALT-XXX",
      "level": "medium",
      "type": "cost_threshold",
      "message": "Monthly cost approaching $400",
      "triggered_at": "ISO8601",
      "acknowledged": false
    }
  ]
}
```

## Audit Logging

### Required Log Events
```
Authentication:
- login_success
- login_failed
- logout
- password_reset
- mfa_enabled/disabled

Data Access:
- data_export_requested
- data_deletion_requested
- sensitive_data_accessed

Admin Actions:
- user_created
- user_deleted
- subscription_modified
- refund_issued

System:
- deployment_started
- deployment_completed
- circuit_breaker_triggered
- circuit_breaker_reset
```

### Log Format
```json
{
  "timestamp": "ISO8601",
  "event": "string",
  "actor": "user_id|system",
  "resource": "string",
  "action": "string",
  "result": "success|failure",
  "metadata": {},
  "ip": "string",
  "user_agent": "string"
}
```

## Incident Response

### Severity Levels
| Level | Examples | Response Time | Escalation |
|-------|----------|---------------|------------|
| P0 Critical | Data breach, total outage | Immediate | Everyone |
| P1 High | Partial outage, security vuln | <1 hour | On-call |
| P2 Medium | Degraded performance, minor bug | <4 hours | Team |
| P3 Low | Cosmetic issue, minor UX | <24 hours | Queue |

### Response Playbook
```
1. Detect (automated monitoring)
2. Alert (appropriate channel)
3. Acknowledge (within SLA)
4. Diagnose (root cause)
5. Mitigate (stop bleeding)
6. Resolve (fix properly)
7. Postmortem (prevent recurrence)
```

## Output Format
```json
{
  "health_check_id": "HC-YYYYMMDD-HHMMSS",
  "timestamp": "ISO8601",
  "overall_status": "healthy",
  "checks_passed": 12,
  "checks_failed": 0,
  "checks_warned": 1,
  "circuit_breakers": {
    "email": "closed",
    "deployment": "closed"
  },
  "active_alerts": [],
  "compliance_status": {
    "email": "compliant",
    "data": "compliant",
    "payment": "compliant",
    "ai_transparency": "compliant"
  },
  "recommendations": []
}
```
