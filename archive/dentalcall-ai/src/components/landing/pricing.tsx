"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Perfect for solo practitioners",
    monthlyPrice: 299,
    annualPrice: 239,
    features: [
      "500 minutes/month",
      "1 phone number",
      "Basic call analytics",
      "Email support",
      "Standard voice",
      "Business hours priority",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    description: "Most popular for growing practices",
    monthlyPrice: 599,
    annualPrice: 479,
    features: [
      "2,000 minutes/month",
      "3 phone numbers",
      "Advanced analytics",
      "Priority support",
      "Custom voice & greeting",
      "CRM integration",
      "SMS confirmations",
      "24/7 coverage",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Business",
    description: "For multi-location practices",
    monthlyPrice: 999,
    annualPrice: 799,
    features: [
      "5,000 minutes/month",
      "Unlimited phone numbers",
      "Real-time dashboard",
      "Phone + email support",
      "Custom integrations",
      "Dedicated success manager",
      "Multi-location support",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="bg-muted/50 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            No per-minute surprises. Fixed monthly price. Cancel anytime.
          </p>

          <div className="mb-12 flex items-center justify-center gap-3">
            <span
              className={`text-sm ${!annual ? "font-semibold" : "text-muted-foreground"}`}
            >
              Monthly
            </span>
            <Switch checked={annual} onCheckedChange={setAnnual} />
            <span
              className={`text-sm ${annual ? "font-semibold" : "text-muted-foreground"}`}
            >
              Annual{" "}
              <span className="text-green-600">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl border bg-card p-8 shadow-sm ${
                plan.popular ? "border-primary shadow-lg ring-2 ring-primary" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">
                  ${annual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-muted-foreground">/month</span>
                {annual && (
                  <div className="mt-1 text-sm text-green-600">
                    Billed annually (2 months free)
                  </div>
                )}
              </div>

              <Button
                className="mb-6 w-full"
                variant={plan.popular ? "default" : "outline"}
                asChild
              >
                <Link href={`/auth/signup?plan=${plan.name.toLowerCase()}`}>
                  {plan.cta}
                </Link>
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a 7-day free trial. No credit card required.
            Overage: $0.15/minute. Need more?{" "}
            <Link href="/contact" className="text-primary underline">
              Contact us for Enterprise pricing
            </Link>
            .
          </p>
        </div>

        {/* ROI Calculator Callout */}
        <div className="mx-auto mt-16 max-w-3xl rounded-2xl bg-primary p-8 text-center text-primary-foreground">
          <h3 className="mb-2 text-2xl font-bold">
            DentalCall AI Pays For Itself
          </h3>
          <p className="mb-4 text-primary-foreground/90">
            At $200/appointment, just 3 additional bookings cover your
            Professional plan. Most practices see 15-30 new appointments in the
            first month.
          </p>
          <div className="text-3xl font-bold">
            ROI: 10x or more in month one
          </div>
        </div>
      </div>
    </section>
  );
}
