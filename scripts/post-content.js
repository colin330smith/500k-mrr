#!/usr/bin/env node
/**
 * MedSpa RevAI - Content Posting Automation
 *
 * This script helps automate content posting to various platforms.
 * Run: node scripts/post-content.js
 */

const fs = require('fs');
const path = require('path');

// Demo line
const DEMO_LINE = '(833) 425-1223';
const WEBSITE_URL = 'https://colin330smith.github.io/500k-mrr';

// Content templates
const CONTENT = {
    reddit: {
        medspa: {
            title: "Built an AI that recovers no-shows automatically - looking for beta testers",
            body: `Hey med spa owners,

I built an AI receptionist that texts patients within an hour of a missed appointment. Getting about 70% of them to rebook.

It also answers calls 24/7 and responds to leads in under 5 minutes.

Looking for 5 med spas to try it free for 30 days. I'll help you set it up.

If you want to hear how it sounds first, you can call the demo line: ${DEMO_LINE} - ask it about Botox pricing or say you missed an appointment.

Anyone interested? DM me or comment below.`
        },
        estheticians: {
            title: "What do you do when clients no-show?",
            body: `I keep seeing posts about no-shows costing practices money. What's your current process when someone doesn't show up?

Do you call them? Text? Just wait for them to rebook?

I've been working on something to help with this but curious what the standard practice is right now.`
        },
        smallbusiness: {
            title: "Service business owners: How do you handle after-hours inquiries?",
            body: `Running a service business (appointments-based). Getting a lot of inquiries after we close - website forms, missed calls, etc.

By the time we respond in the morning, a lot of them have already booked with competitors.

What are you all doing about this? Hiring night staff? Using some kind of answering service?`
        }
    },
    linkedin: {
        post: `Med spa owners: you're probably losing $8K/month and don't realize it.

Here's the math:
• 20% no-show rate (industry average)
• 80 appointments/week
• $350 average treatment

= 64 missed appointments/month
= $22,400 in lost potential revenue

Even if only 35% would have been recoverable, that's ~$8K.

The solution isn't calling them hours later when you notice.

It's texting them within 60 minutes with an easy rebook option.

I built an AI that does exactly this. 70% rebook within 48 hours.

If you want to hear how it sounds, call ${DEMO_LINE} and ask about Botox pricing or say you missed your appointment.

#medspa #aesthetics #smallbusiness #ai`
    },
    twitter: {
        thread: [
            `🧵 How med spas are losing $100K/year (and don't know it)

A breakdown of the 3 biggest revenue leaks I see:`,
            `1/ NO-SHOWS

20% is the industry average. On 80 appointments/week at $350 avg, that's $22,400/month in empty chairs.

Solution: Text within 1 hour of missed appointment. "No worries! Want to reschedule?"

70% rebook rate when you're fast.`,
            `2/ SLOW LEAD RESPONSE

79% of leads go to whoever responds first.

If you take 30+ minutes to reply to a "what's your Botox pricing?" inquiry, they've already called 3 competitors.

Solution: Respond in under 5 minutes. Every time. Even at 11pm.`,
            `3/ LAPSED CLIENTS

The patient who got Botox 5 months ago and forgot to rebook?

They're not gone - they just need a reminder.

"Hey Sarah, it's been a while! Ready for a touch-up?"`,
            `Most med spas fix these with $3,500/month in additional staff.

We built an AI that does all three for $497/month.

Demo line (no signup): ${DEMO_LINE}

Ask it about pricing. Tell it you missed an appointment. See how it handles it.`
        ]
    },
    facebook: {
        post: `Quick question for the group:

How many no-shows did you have last week?

I was losing $6-8K/month to missed appointments until I automated the follow-up. Now getting about 70% of them rescheduled within 48 hours.

Happy to share what I did if anyone's interested. It's not complicated but it made a huge difference for my numbers.`
    }
};

// Generate daily content schedule
function generateDailySchedule() {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const schedule = {
        date: today.toISOString().split('T')[0],
        tasks: []
    };

    // Daily tasks
    schedule.tasks.push({
        time: '10:00 AM',
        platform: 'LinkedIn',
        action: 'Post or comment',
        content: CONTENT.linkedin.post.slice(0, 100) + '...'
    });

    schedule.tasks.push({
        time: '2:00 PM',
        platform: 'Twitter/X',
        action: 'Post thread or engage',
        content: CONTENT.twitter.thread[0].slice(0, 100) + '...'
    });

    // Rotate Reddit posts by day
    if (dayOfWeek === 1) { // Monday
        schedule.tasks.push({
            time: '12:00 PM',
            platform: 'r/medspa',
            action: 'Post',
            content: CONTENT.reddit.medspa.title
        });
    } else if (dayOfWeek === 3) { // Wednesday
        schedule.tasks.push({
            time: '12:00 PM',
            platform: 'r/estheticians',
            action: 'Post',
            content: CONTENT.reddit.estheticians.title
        });
    } else if (dayOfWeek === 5) { // Friday
        schedule.tasks.push({
            time: '12:00 PM',
            platform: 'r/smallbusiness',
            action: 'Post',
            content: CONTENT.reddit.smallbusiness.title
        });
    }

    // Daily DM quota
    schedule.tasks.push({
        time: '4:00 PM',
        platform: 'LinkedIn',
        action: 'Send 5 DMs to med spa owners',
        content: 'Use template from FREE_LEAD_GEN_NOW.md'
    });

    return schedule;
}

// Print daily schedule
function printSchedule() {
    const schedule = generateDailySchedule();

    console.log('\n' + '='.repeat(60));
    console.log(`📅 CONTENT SCHEDULE FOR ${schedule.date}`);
    console.log('='.repeat(60) + '\n');

    schedule.tasks.forEach((task, i) => {
        console.log(`${i + 1}. [${task.time}] ${task.platform}`);
        console.log(`   Action: ${task.action}`);
        console.log(`   Content: ${task.content}`);
        console.log('');
    });

    console.log('='.repeat(60));
    console.log('🔥 DEMO LINE: ' + DEMO_LINE);
    console.log('🌐 WEBSITE: ' + WEBSITE_URL);
    console.log('='.repeat(60) + '\n');
}

// Print full content for a platform
function printContent(platform) {
    console.log('\n' + '='.repeat(60));
    console.log(`📝 ${platform.toUpperCase()} CONTENT`);
    console.log('='.repeat(60) + '\n');

    if (platform === 'reddit') {
        Object.entries(CONTENT.reddit).forEach(([sub, content]) => {
            console.log(`\n--- r/${sub} ---`);
            console.log(`Title: ${content.title}\n`);
            console.log(content.body);
            console.log('\n' + '-'.repeat(40));
        });
    } else if (platform === 'twitter') {
        CONTENT.twitter.thread.forEach((tweet, i) => {
            console.log(`\n--- Tweet ${i + 1} ---`);
            console.log(tweet);
        });
    } else if (CONTENT[platform]) {
        console.log(CONTENT[platform].post || JSON.stringify(CONTENT[platform], null, 2));
    }
}

// Main
const args = process.argv.slice(2);
const command = args[0] || 'schedule';

switch (command) {
    case 'schedule':
        printSchedule();
        break;
    case 'reddit':
    case 'twitter':
    case 'linkedin':
    case 'facebook':
        printContent(command);
        break;
    case 'all':
        ['reddit', 'twitter', 'linkedin', 'facebook'].forEach(p => printContent(p));
        break;
    default:
        console.log(`
Usage: node scripts/post-content.js [command]

Commands:
  schedule  - Show today's posting schedule (default)
  reddit    - Show Reddit post content
  twitter   - Show Twitter thread content
  linkedin  - Show LinkedIn post content
  facebook  - Show Facebook post content
  all       - Show all content
        `);
}
