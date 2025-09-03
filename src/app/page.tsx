import { HeroSection } from "@/components/landing/hero-section";
import { AssistantsSection } from "@/components/landing/assistants-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AssistantsSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </main>
  );
}