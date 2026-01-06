# MedSpa RevAI - Facebook/Instagram Ads Campaigns

## Audience Targeting

### Core Audiences

**Audience 1: Med Spa Owners**
- Job Titles: Medical Spa Owner, Medspa Director, Aesthetic Practice Owner, Spa Owner
- Interests: Medical aesthetics, Botox, Dermal fillers, Laser treatments, Aesthetician
- Behaviors: Small business owners, Business page admins
- Age: 28-55
- Location: USA

**Audience 2: Aesthetic Professionals**
- Job Titles: Nurse Injector, Aesthetic Nurse, Medical Aesthetician, Cosmetic Nurse
- Interests: American Med Spa Association, Allergan Aesthetics, Galderma
- Education: Nursing, Aesthetics certification
- Age: 25-50

**Audience 3: Healthcare Business Owners**
- Interests: Healthcare management, Practice management, Medical business
- Behaviors: Engaged shoppers, Technology early adopters
- Business type: Health & Medical

### Lookalike Audiences (Create After 100+ Leads)
- 1% Lookalike of email subscribers
- 1% Lookalike of ROI calculator users
- 1% Lookalike of trial signups

### Retargeting Audiences
- Website visitors (all) - 30 days
- ROI Calculator users - 14 days
- Signup page visitors who didn't convert - 7 days

---

## Campaign 1: Lead Generation (ROI Calculator)

**Objective:** Lead Generation
**Daily Budget:** $50
**Placement:** Facebook Feed, Instagram Feed, Stories

### Ad Set 1: Pain Point - No Shows

**Primary Text:**
```
Med spa owners: Quick math.

20 no-shows per month × $350 avg treatment = $7,000 lost.

That's $84,000/year walking out your door.

Our AI fixes this by texting patients within 1 hour of a missed appointment. 70% rebook within 48 hours.

Find out exactly how much you're losing (and could recover):
👉 Free ROI Calculator - takes 30 seconds
```

**Headline:** Calculate Your Lost Revenue
**CTA:** Learn More
**Link:** /roi-calculator.html

**Creative:** Before/after style showing empty treatment chair vs. busy practice. Or simple text-based creative with "$7,000" crossed out.

---

### Ad Set 2: Pain Point - Slow Response

**Primary Text:**
```
🚨 Uncomfortable truth for med spa owners:

79% of leads go to whoever responds FIRST.

If you're taking 30+ minutes to reply to inquiries, you're losing 79% of your leads to competitors who answer faster.

We built an AI that responds in under 5 minutes. 24/7. While you're with patients, sleeping, or living your life.

Calculate exactly how much revenue you're losing to slow follow-up 👇
```

**Headline:** How Much Are Slow Responses Costing You?
**CTA:** Calculate Now
**Link:** /roi-calculator.html

---

### Ad Set 3: Solution Focused

**Primary Text:**
```
What if your med spa had a receptionist who:
✅ Answers every call in under 1 second
✅ Responds to leads in under 5 minutes
✅ Works 24/7/365
✅ Never calls in sick
✅ Costs $497/mo (not $3,500+)

That's MedSpa RevAI.

The average med spa recovers $8,750/month in revenue our AI saves from no-shows, slow follow-up, and lapsed clients.

See your personalized numbers 👇
```

**Headline:** Your AI Receptionist is Ready
**CTA:** Get Free ROI Report
**Link:** /roi-calculator.html

---

## Campaign 2: Traffic (Demo Calls)

**Objective:** Traffic
**Daily Budget:** $30
**Optimization:** Link clicks

### Ad Set 1: Try It Now

**Primary Text:**
```
Talk to an AI receptionist right now.

No signup. No credit card. Just call.

(833) 425-1223

Ask it about pricing. Ask it to book an appointment. Ask it anything a patient would ask.

Then imagine never missing another call.

👆 Tap the number above or visit our demo page.
```

**Headline:** Call Our AI Demo - (833) 425-1223
**CTA:** Call Now
**Link:** /demo.html

**Creative:** Phone screen showing call interface with "(833) 425-1223" and "MedSpa AI" caller ID

---

## Campaign 3: Retargeting

**Objective:** Conversions
**Daily Budget:** $20
**Audience:** Website visitors who didn't convert

### Ad Set 1: ROI Calculator Visitors

**Primary Text:**
```
You calculated your lost revenue...

Now recover it.

Start your 14-day free trial. No credit card required.

Our AI starts recovering no-shows and responding to leads from day one.
```

**Headline:** Start Recovering Lost Revenue Today
**CTA:** Start Free Trial
**Link:** /signup.html

---

### Ad Set 2: General Retargeting

**Primary Text:**
```
Still thinking about MedSpa RevAI?

Here's what med spas see in their first month:

📈 70% of no-shows rescheduled
⚡ Lead response time: 5 minutes → instant
💰 Average revenue recovered: $8,750

14-day free trial. Cancel anytime.
```

**Headline:** Your First Month Could Pay for the Year
**CTA:** Try Free
**Link:** /signup.html

---

## Campaign 4: Video Ads

**Objective:** Video Views → Retarget viewers
**Daily Budget:** $25

### Video Script (30 seconds)

```
[0-5s] "Med spa owner, quick question:"

[5-10s] "How much did no-shows cost you last month? $5K? $10K?"

[10-15s] "What about leads who booked with a competitor because you didn't respond fast enough?"

[15-22s] "MedSpa RevAI is an AI that texts no-shows within an hour, responds to leads in 5 minutes, and answers calls 24/7."

[22-28s] "The average spa recovers $8,750 per month."

[28-30s] "Try our demo - call 833-425-1223. No signup required."
```

**Thumbnail:** Person looking at phone with shocked expression, text overlay "$8,750/mo"

---

## Creative Best Practices

### Image Ads
- 1:1 ratio for feeds
- 9:16 for stories
- High contrast, readable text
- Professional but not corporate
- Before/after or problem/solution

### Video Ads
- Hook in first 3 seconds
- Subtitles always (85% watch muted)
- 15-30 seconds optimal
- End with clear CTA

### Copy
- Lead with pain point
- Use specific numbers ($7,000 not "thousands")
- Social proof when available
- Always include CTA
- Emojis sparingly

---

## Budget Allocation (First Month)

| Campaign | Daily | Monthly |
|----------|-------|---------|
| Lead Gen - ROI Calculator | $50 | $1,500 |
| Traffic - Demo Calls | $30 | $900 |
| Retargeting | $20 | $600 |
| Video | $25 | $750 |
| **Total** | **$125** | **$3,750** |

---

## Pixel Events to Track

```javascript
// Already configured in tracking.js:
fbq('track', 'PageView');           // All pages
fbq('track', 'Lead');               // Email capture
fbq('track', 'Contact');            // Demo call click
fbq('track', 'InitiateCheckout');   // Signup page
fbq('track', 'Purchase');           // Successful subscription
fbq('track', 'CustomizeProduct');   // ROI calculator used
```

---

## Launch Checklist

- [ ] Install Facebook Pixel (use tracking.js)
- [ ] Verify pixel is firing (use Facebook Pixel Helper)
- [ ] Create Custom Audiences
- [ ] Upload creative assets
- [ ] Set up ad campaigns
- [ ] Configure conversion events
- [ ] Set up automated rules (pause if CPA > $150)
- [ ] Schedule weekly creative refresh
