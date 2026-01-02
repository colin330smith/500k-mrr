import { Hero } from "@/components/landing/hero";
import { Benefits } from "@/components/landing/benefits";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Benefits />
      <Pricing />
      <Footer />
    </main>
  );
}
