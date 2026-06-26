import { LandingSection, SectionHeading } from "@/features/landing/components/section-primitives";
import { testimonials } from "@/features/landing/data/landing-content";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Grid } from "@/components/ui/layout-primitives";
import { Heading, Text } from "@/components/ui/typography";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TestimonialsSection() {
  return (
    <LandingSection id="testimonials" ariaLabelledBy="testimonials-heading">
      <SectionHeading
        id="testimonials-heading"
        title="Loved by Candidates"
        description="Here is how AI Career Agent is changing the job search experience."
      />

      <Grid cols={1} colsSm={2} colsLg={3} gap={6} role="list" className="w-full">
        {testimonials.map((t, idx) => (
          <li key={t.name} className="list-none">
            <BrutalCard
              hoverable
              className="h-full flex flex-col justify-between gap-6 border-[3px] border-border brutal-shadow hover:brutal-shadow-hover"
            >
              <Text variant="body" className="italic text-foreground text-sm md:text-base leading-relaxed">
                "{t.content}"
              </Text>
              
              <div className="flex items-center gap-3 pt-4 border-t border-border/10">
                <Avatar className="h-10 w-10 border-2 border-foreground rounded-full shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold font-heading text-sm">
                    {t.avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Heading level="h6" className="text-sm md:text-base font-bold">
                    {t.name}
                  </Heading>
                  <Text variant="small" className="text-xs md:text-sm text-foreground-muted">
                    {t.role} at <span className="font-semibold text-foreground-secondary">{t.company}</span>
                  </Text>
                </div>
              </div>
            </BrutalCard>
          </li>
        ))}
      </Grid>
    </LandingSection>
  );
}
