import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { landingHero } from "@/features/landing/data/landing-content";
import { HeroPreviewCard } from "@/features/landing/components/hero-preview-card";

export function HeroSection() {
  return (
    <section
      className="border-b-[3px] border-border px-4 py-16 md:py-24 lg:py-32"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="text-center lg:text-left">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary md:text-sm">
            {landingHero.eyebrow}
          </p>

          <h1
            id="hero-heading"
            className="font-heading text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-[4rem]"
          >
            {landingHero.headline}
            <br />
            <span className="text-primary">{landingHero.headlineAccent}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-foreground-secondary md:text-lg lg:mx-0 lg:text-xl">
            {landingHero.subheadline}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href={siteConfig.links.register}>
                {landingHero.primaryCta}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto">
              <Link href="#features">
                <Play className="h-5 w-5" aria-hidden="true" />
                {landingHero.secondaryCta}
              </Link>
            </Button>
          </div>

          <p className="mt-8 text-sm text-foreground-muted">
            Quality over quantity. Trusted sources. AI-matched opportunities.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <HeroPreviewCard />
        </div>
      </div>
    </section>
  );
}
