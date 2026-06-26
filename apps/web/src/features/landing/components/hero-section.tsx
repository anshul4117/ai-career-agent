import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";
import { landingHero } from "@/features/landing/data/landing-content";
import { HeroPreviewCard } from "@/features/landing/components/hero-preview-card";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden border-b-[3px] border-border px-4 py-16 md:py-24 lg:py-32"
      aria-labelledby="hero-heading"
    >
      {/* Subtle Geometric/Neural Connection Background Pattern */}
      <div className="absolute inset-0 -z-10 select-none overflow-hidden bg-background" aria-hidden="true">
        <svg
          className="absolute inset-0 h-full w-full stroke-foreground/[0.03] text-foreground/[0.03] fill-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="neural-grid" width="80" height="80" patternUnits="userSpaceOnUse" x="0" y="0">
              {/* Subtle Grid Base */}
              <path d="M 80 0 L 0 0 0 80" strokeWidth="0.5" strokeDasharray="4 4" />
              
              {/* Connections (Neural Network Paths) */}
              <line x1="20" y1="20" x2="60" y2="20" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="20" y1="20" x2="40" y2="60" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="60" y1="20" x2="40" y2="60" strokeWidth="1" strokeDasharray="2 2" />
              
              <line x1="40" y1="60" x2="30" y2="80" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="30" y1="0" x2="20" y2="20" strokeWidth="1" strokeDasharray="2 2" />
              
              <line x1="40" y1="60" x2="50" y2="80" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="50" y1="0" x2="60" y2="20" strokeWidth="1" strokeDasharray="2 2" />
              
              <line x1="20" y1="20" x2="0" y2="40" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="80" y1="40" x2="60" y2="60" strokeWidth="1" strokeDasharray="2 2" />
              
              <line x1="60" y1="20" x2="80" y2="40" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="0" y1="40" x2="20" y2="60" strokeWidth="1" strokeDasharray="2 2" />

              {/* Nodes (Neural Data Points) */}
              <circle cx="20" cy="20" r="3" strokeWidth="1.5" />
              <circle cx="20" cy="20" r="1" fill="currentColor" />
              <circle cx="60" cy="20" r="3" strokeWidth="1.5" />
              <circle cx="60" cy="20" r="1" fill="currentColor" />
              <circle cx="40" cy="60" r="3" strokeWidth="1.5" />
              <circle cx="40" cy="60" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
        </svg>
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="text-center lg:text-left space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary md:text-sm">
            {landingHero.eyebrow}
          </p>

          <Heading
            level="h1"
            id="hero-heading"
            className="font-heading text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[4rem]"
          >
            {landingHero.headline}
            <br />
            <span className="text-primary">{landingHero.headlineAccent}</span>
          </Heading>

          <Text
            variant="large"
            className="mx-auto max-w-xl text-base text-foreground-secondary md:text-lg lg:mx-0 lg:text-xl leading-relaxed"
          >
            {landingHero.subheadline}
          </Text>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start pt-4">
            <BrutalButton
              variant="default"
              size="lg"
              className="w-full sm:w-auto text-base font-bold uppercase tracking-wide"
              asChild
            >
              <Link href={siteConfig.links.register}>
                {landingHero.primaryCta}
                <ArrowRight className="h-5 w-5 ml-1.5" aria-hidden="true" />
              </Link>
            </BrutalButton>
            <BrutalButton
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto text-base font-bold uppercase tracking-wide"
              asChild
            >
              <Link href="#features">
                <Play className="h-5 w-5 mr-1.5" aria-hidden="true" />
                {landingHero.secondaryCta}
              </Link>
            </BrutalButton>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">
            Quality over quantity · Trusted sources · AI-matched opportunities
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <HeroPreviewCard />
        </div>
      </div>
    </section>
  );
}
