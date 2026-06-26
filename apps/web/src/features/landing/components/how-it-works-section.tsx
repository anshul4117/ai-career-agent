import { LandingSection, SectionHeading } from "@/features/landing/components/section-primitives";
import { howItWorksSteps } from "@/features/landing/data/landing-content";

export function HowItWorksSection() {
  return (
    <LandingSection id="how-it-works" ariaLabelledBy="how-it-works-heading">
      <SectionHeading
        id="how-it-works-heading"
        title="How It Works"
        description="Four steps from profile to application — with AI at every stage."
      />

      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
        {howItWorksSteps.map((step) => (
          <li key={step.step}>
            <StepCard step={step.step} title={step.title} description={step.description} />
          </li>
        ))}
      </ol>
    </LandingSection>
  );
}

interface StepCardProps {
  step: number;
  title: string;
  description: string;
}

function StepCard({ step, title, description }: StepCardProps) {
  return (
    <article className="relative h-full brutal-card">
      <span
        className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-foreground font-heading text-lg font-bold text-surface brutal-border-secondary"
        aria-hidden="true"
      >
        {String(step).padStart(2, "0")}
      </span>
      <h3 className="font-heading text-lg font-bold md:text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground-secondary md:text-base">
        {description}
      </p>
    </article>
  );
}
