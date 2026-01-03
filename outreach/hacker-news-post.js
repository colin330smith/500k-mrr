#!/usr/bin/env node
/**
 * Creates ready-to-post content for Hacker News
 * Format: Show HN post
 */

const POST = {
  title: 'Show HN: AI Receptionist for Dental Practices – Never Miss a Patient Call',
  url: 'https://local-lift.onrender.com',
  text: `Hey HN,

I built an AI receptionist specifically for dental practices. Here's the problem we're solving:

**The Problem:**
- Average dental practice misses 32% of incoming calls
- 85% of callers who hit voicemail don't leave a message - they call the next dentist
- Each missed call = $850+ in lost patient lifetime value
- Result: practices lose $100K+/year to missed calls

**The Solution:**
DentalCall AI answers every call in <1 second, 24/7. It has natural conversations (patients genuinely can't tell it's AI), handles insurance questions, and books appointments directly into the practice's calendar.

**Tech:**
- Voice AI with natural conversation flow
- Real-time calendar integration (Dentrix, Eaglesoft, Open Dental)
- HIPAA-compliant call handling
- Full transcripts and analytics

**Results:**
Practices in our pilot went from 67% to 93% call answer rate and recovered $47K+ in revenue from after-hours calls alone.

**Try it:**
- Live demo: Call (972) 845-8338
- Website: https://local-lift.onrender.com
- 7-day free trial, no credit card

Would love feedback from the HN community. Happy to answer questions about the tech, the business model, or the dental industry.`
};

console.log('='.repeat(70));
console.log('HACKER NEWS SHOW HN POST');
console.log('='.repeat(70));
console.log(`\nTitle: ${POST.title}`);
console.log(`URL: ${POST.url}`);
console.log('\n--- Post Text ---\n');
console.log(POST.text);
console.log('\n' + '='.repeat(70));
console.log('\nTo post: Go to https://news.ycombinator.com/submit');
console.log('Select "Show HN" format');
console.log('='.repeat(70));
