import { LandingSection, SectionHeading } from "@/features/landing/components/section-primitives";
import { socialProofStats } from "@/features/landing/data/landing-content";

export function SocialProofSection() {
  return (
    <LandingSection ariaLabelledBy="social-proof-heading">
      <SectionHeading
        id="social-proof-heading"
        title="Trusted by Serious Candidates"
        description="A growing network of quality opportunities and engaged job seekers."
        className="mb-10"
      />

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3" role="list">
        {socialProofStats.map((stat) => (
          <li key={stat.id}>
            <StatCard label={stat.label} value={stat.value} />
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="brutal-card text-center transition-transform duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow-hover">
      <p className="font-heading text-4xl font-bold tracking-tight md:text-5xl">{value}</p>
      <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-foreground-secondary">
        {label}
      </p>
    </article>
  );
}
