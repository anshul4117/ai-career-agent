import { LandingNavbar } from "@/features/landing/components/landing-navbar";
import { HeroSection } from "@/features/landing/components/hero-section";
import { SocialProofSection } from "@/features/landing/components/social-proof-section";
import { FeaturesSection } from "@/features/landing/components/features-section";
import { HowItWorksSection } from "@/features/landing/components/how-it-works-section";
import { WhyChooseUsSection } from "@/features/landing/components/why-choose-us-section";
import { TestimonialsSection } from "@/features/landing/components/testimonials-section";
import { FaqSection } from "@/features/landing/components/faq-section";
import { FinalCtaSection } from "@/features/landing/components/final-cta-section";
import { LandingFooter } from "@/features/landing/components/landing-footer";

export function LandingPage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-surface"
      >
        Skip to main content
      </a>

      <LandingNavbar />

      <main id="main-content">
        <HeroSection />
        <SocialProofSection />
        <FeaturesSection />
        <HowItWorksSection />
        <WhyChooseUsSection />
        <TestimonialsSection />
        <FaqSection />
        <FinalCtaSection />
      </main>

      <LandingFooter />
    </>
  );
}
