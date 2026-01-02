# Health Check Command

Run comprehensive system health and compliance audit.

## Usage
```
/health-check                 # Full system check
/health-check --quick         # Critical checks only
/health-check --compliance    # Compliance audit only
```

## Execution Steps

### Phase 1: System Health
1. **API Health**
   - Endpoint response times
   - Error rates (5xx, 4xx)
   - Uptime status

2. **Database Health**
   - Connection pool status
   - Query performance
   - Storage utilization

3. **External Services**
   - Stripe API status
   - Supabase status
   - Resend status
   - Vapi status (if applicable)

4. **Infrastructure**
   - Vercel deployment status
   - SSL certificate validity
   - DNS resolution

### Phase 2: Business Metrics
1. **Revenue**
   - Current MRR
   - MRR growth (WoW, MoM)
   - Churn rate
   - NRR

2. **Customers**
   - Total active
   - New this week
   - Churned this week
   - Average CHI score

3. **Pipeline**
   - Leads in queue
   - Sequences active
   - Conversion rate

### Phase 3: Compliance Audit
1. **Email Compliance**
   - Suppression list current
   - Unsubscribe processing working
   - Footer requirements met
   - Spam complaint rate

2. **Data Compliance**
   - Consent records valid
   - Retention policies applied
   - Export functionality working
   - Deletion requests processed

3. **Payment Compliance**
   - Webhook verification active
   - No raw card storage
   - SSL everywhere
   - Secure key storage

4. **AI Transparency**
   - Voice disclosure present
   - Chat badge displayed
   - Email footer included

### Phase 4: Circuit Breaker Status
1. Check all circuit breaker states
2. Review recent triggers
3. Verify recovery criteria
4. Clear any stale breakers

### Phase 5: Security Scan
1. Dependency vulnerabilities (npm audit)
2. Secrets exposure check
3. Access log anomalies
4. Failed login patterns

## Output

```json
{
  "health_check_id": "HC-YYYYMMDD-HHMMSS",
  "timestamp": "ISO8601",
  "duration_ms": 4523,
  "overall_status": "healthy",

  "system": {
    "api": {"status": "up", "latency_p95_ms": 45, "error_rate": 0.001},
    "database": {"status": "up", "connections": 12, "storage_pct": 23},
    "stripe": {"status": "up"},
    "resend": {"status": "up", "monthly_sent": 1247, "limit": 3000},
    "vercel": {"status": "up", "last_deploy": "ISO8601"}
  },

  "business": {
    "mrr": 4599,
    "mrr_growth_wow": 12.3,
    "active_customers": 9,
    "avg_chi": 74,
    "leads_queued": 142,
    "sequences_active": 47
  },

  "compliance": {
    "email": "compliant",
    "data": "compliant",
    "payment": "compliant",
    "ai_transparency": "compliant"
  },

  "circuit_breakers": {
    "email": "closed",
    "deployment": "closed",
    "signups": "closed"
  },

  "security": {
    "vulnerabilities": {"critical": 0, "high": 0, "medium": 2},
    "secrets_exposed": false,
    "anomalies_detected": false
  },

  "alerts": [],

  "recommendations": [
    "Consider upgrading Resend plan (41% of limit used)"
  ]
}
```

## Alert Escalation

| Level | Notification | Response Time |
|-------|--------------|---------------|
| Critical | Immediate alert | <5 min |
| High | Alert + log | <1 hour |
| Medium | Log + daily summary | <24 hours |
| Low | Weekly summary | Next review |
