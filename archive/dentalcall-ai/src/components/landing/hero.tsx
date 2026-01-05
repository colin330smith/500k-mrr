"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-16 pb-20 md:pt-24 md:pb-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Phone className="mr-2 h-4 w-4" />
              AI-Powered Dental Receptionist
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Never Miss Another
              <span className="text-primary"> Patient Call</span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Your dental practice misses 32% of calls. Each missed call costs
              you $850+. DentalCall AI answers every call 24/7, books
              appointments, and pays for itself in 3 bookings.
            </p>

            <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/auth/signup">
                  Start Free 7-Day Trial
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link href="#pricing">
                  View Pricing
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Setup in 5 minutes
              </div>
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Cancel anytime
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3"
        >
          <div className="rounded-2xl bg-card p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-primary">32%</div>
            <div className="mt-2 text-sm text-muted-foreground">
              of dental calls go unanswered
            </div>
          </div>
          <div className="rounded-2xl bg-card p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-primary">$850+</div>
            <div className="mt-2 text-sm text-muted-foreground">
              lost per missed patient call
            </div>
          </div>
          <div className="rounded-2xl bg-card p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-primary">93%</div>
            <div className="mt-2 text-sm text-muted-foreground">
              reduction in missed calls
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
