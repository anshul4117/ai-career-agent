import type { LucideIcon } from "lucide-react";
import { ClipboardList, FileText, Mail, Search, Target } from "lucide-react";
import { LandingSection, SectionHeading } from "@/features/landing/components/section-primitives";
import { landingFeatures } from "@/features/landing/data/landing-content";

const iconMap: Record<(typeof landingFeatures)[number]["icon"], LucideIcon> = {
  search: Search,
  file: FileText,
  mail: Mail,
  target: Target,
  clipboard: ClipboardList,
};

export function FeaturesSection() {
  return (
    <LandingSection id="features" ariaLabelledBy="features-heading">
      <SectionHeading
        id="features-heading"
        title="Built for Serious Candidates"
        description="Every feature is designed around quality, clarity, and speed — not endless scrolling."
      />

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {landingFeatures.map((feature) => {
          const Icon = iconMap[feature.icon];
          return (
            <li key={feature.id} className={feature.id === "tracking" ? "sm:col-span-2 lg:col-span-1" : undefined}>
              <FeatureCard
                icon={Icon}
                title={feature.title}
                description={feature.description}
              />
            </li>
          );
        })}
      </ul>
    </LandingSection>
  );
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <article className="flex h-full flex-col brutal-card transition-transform duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow-hover">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-surface-secondary brutal-border-secondary">
        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
      </div>
      <h3 className="font-heading text-lg font-bold md:text-xl">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground-secondary md:text-base">
        {description}
      </p>
    </article>
  );
}
