# DentalCall AI - Email Outreach

## Quick Start

### 1. Set up Resend
1. Go to https://resend.com and create an account
2. Verify your domain (dentalcall.ai) or use Resend's testing domain
3. Get your API key from the dashboard

### 2. Run Dry Test (No emails sent)
```bash
cd /path/to/500k-mrr/outreach
DRY_RUN=true node send-outreach.js
```

### 3. Send Emails
```bash
RESEND_API_KEY=re_your_key_here node send-outreach.js
```

## Leads Summary
- **Texas**: 58 leads
- **California**: 73 leads
- **Florida**: 69 leads
- **Total**: 200 leads

All leads have BRS (Buyer Readiness Score) >= 60, meaning they have signals indicating they'd benefit from an AI receptionist.

## Campaign Details
- **From**: DentalCall AI <hello@dentalcall.ai>
- **Subject**: {Practice Name} - Never miss another patient call
- **CTA**: 7-day free trial link to Stripe

## Email Personalization
Each email is personalized based on:
- Practice name
- Doctor's name
- Pain point signals from their reviews/website

## Tracking
Results are saved to `results-YYYY-MM-DD.json` after each run.
