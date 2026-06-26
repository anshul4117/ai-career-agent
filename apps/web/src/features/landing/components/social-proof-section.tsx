import { LandingSection, SectionHeading } from "@/features/landing/components/section-primitives";
import { socialProofStats } from "@/features/landing/data/landing-content";
import { StatsCard } from "@/components/ui/stats-card";
import { Grid, Divider } from "@/components/ui/layout-primitives";
import { Briefcase, Building, Target, ShieldCheck } from "lucide-react";

const iconMap = {
  jobs: Briefcase,
  companies: Building,
  match: Target,
  agent: ShieldCheck,
};

export function SocialProofSection() {
  return (
    <LandingSection ariaLabelledBy="social-proof-heading" className="bg-surface-secondary/40">
      <SectionHeading
        id="social-proof-heading"
        title="Trusted by Serious Candidates"
        description="A growing career operating system focusing on verified opportunities, not spam."
        className="mb-10"
      />

      <Grid cols={1} colsSm={2} colsLg={4} gap={6} role="list" className="w-full">
        {socialProofStats.map((stat) => {
          const Icon = iconMap[stat.id as keyof typeof iconMap];
          return (
            <li key={stat.id} className="list-none">
              <StatsCard
                label={stat.label}
                value={stat.value}
                icon={Icon}
                className="h-full border-[3px] border-border"
              />
            </li>
          );
        })}
      </Grid>

      {/* Spacing divider line */}
      <Divider thickness="sm" className="mt-16 mb-12 opacity-15" />

      {/* Tasteful Company Trust Logo Placeholders */}
      <div className="space-y-8">
        <h3 className="text-center text-xs font-bold uppercase tracking-[0.2em] text-foreground-muted">
          Matching Candidates to Leading Tech Teams
        </h3>
        <Grid cols={2} colsSm={3} colsLg={6} gap={4} className="w-full">
          {["Linear Labs", "Vercel", "Linear", "Wellfound", "Y Combinator", "GitHub"].map((name) => (
            <div
              key={name}
              className="flex items-center justify-center h-14 bg-surface brutal-border-secondary px-4 rounded-md select-none opacity-40 hover:opacity-75 transition-opacity"
            >
              <span className="font-heading font-bold text-xs tracking-tight text-foreground uppercase">
                {name}
              </span>
            </div>
          ))}
        </Grid>
      </div>
    </LandingSection>
  );
}
