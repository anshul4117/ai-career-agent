import type { LucideIcon } from "lucide-react";
import { ClipboardList, FileText, Mail, Search, Target, Shield } from "lucide-react";
import { LandingSection, SectionHeading } from "@/features/landing/components/section-primitives";
import { landingFeatures } from "@/features/landing/data/landing-content";
import { FeatureCard } from "@/components/ui/feature-card";
import { Grid } from "@/components/ui/layout-primitives";

const iconMap: Record<(typeof landingFeatures)[number]["icon"], LucideIcon> = {
  search: Search,
  file: FileText,
  mail: Mail,
  target: Target,
  clipboard: ClipboardList,
  shield: Shield,
};

export function FeaturesSection() {
  return (
    <LandingSection id="features" ariaLabelledBy="features-heading">
      <SectionHeading
        id="features-heading"
        title="Built for Serious Candidates"
        description="Every feature is designed around quality, clarity, and speed — not endless scrolling."
      />

      <Grid cols={1} colsSm={2} colsLg={3} gap={6} role="list" className="w-full">
        {landingFeatures.map((feature) => {
          const Icon = iconMap[feature.icon];
          return (
            <li key={feature.id} className="list-none">
              <FeatureCard
                icon={Icon}
                title={feature.title}
                description={feature.description}
                className="h-full border-[3px] border-border brutal-shadow hover:brutal-shadow-hover"
              />
            </li>
          );
        })}
      </Grid>
    </LandingSection>
  );
}
