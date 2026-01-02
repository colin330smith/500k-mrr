"use client";

import { motion } from "framer-motion";
import { Phone, Calendar, Clock, BarChart3 } from "lucide-react";

const benefits = [
  {
    icon: Phone,
    title: "Answer Every Call",
    description:
      "AI receptionist answers instantly, 24/7. No hold times, no voicemail, no missed opportunities. Handles unlimited simultaneous calls.",
  },
  {
    icon: Calendar,
    title: "Book Appointments Automatically",
    description:
      "Integrates with your scheduling system. Books, reschedules, and confirms appointments. Sends SMS reminders to reduce no-shows.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Nights, weekends, lunch breaks, holidays. Your AI receptionist never sleeps. Capture after-hours calls that competitors miss.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "See every call, booking, and outcome. Track ROI in real-time. Know exactly how much revenue DentalCall AI generates.",
  },
];

export function Benefits() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Stop Losing Patients to Voicemail
          </h2>
          <p className="mb-12 text-lg text-muted-foreground">
            Only 14% of new patients leave voicemails. The rest call your
            competitors. DentalCall AI ensures every caller gets immediate,
            professional service.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mx-auto mt-16 max-w-4xl rounded-2xl bg-primary/5 p-8 text-center">
          <p className="text-lg italic text-muted-foreground">
            "We went from missing 30% of calls to answering 98%. In the first
            month, we booked 47 additional appointments worth over $9,400.
            DentalCall AI paid for itself in the first week."
          </p>
          <div className="mt-4 font-semibold">
            Dr. Sarah Chen, Smile Dental Austin
          </div>
        </div>
      </div>
    </section>
  );
}
