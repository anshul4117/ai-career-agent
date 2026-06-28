import { Check, X } from "lucide-react";
import { LandingSection, SectionHeading } from "@/features/landing/components/section-primitives";
import { whyChooseUs } from "@/features/landing/data/landing-content";
import { Text } from "@/components/ui/typography";

export function WhyChooseUsSection() {
  return (
    <LandingSection id="why-choose-us" ariaLabelledBy="comparison-heading" className="bg-surface-secondary/20">
      <SectionHeading
        id="comparison-heading"
        title={whyChooseUs.title}
        description={whyChooseUs.description}
      />

      <div className="overflow-x-auto rounded-md brutal-border brutal-shadow bg-surface">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-[3px] border-border bg-surface-secondary">
              {whyChooseUs.headers.map((header, idx) => (
                <th
                  key={header}
                  className={`px-6 py-4 font-heading font-bold text-base md:text-lg border-r-[2px] border-border last:border-r-0 ${
                    idx === 1 ? "text-primary bg-primary/5" : ""
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {whyChooseUs.rows.map((row) => (
              <tr
                key={row.feature}
                className={`border-b-[2px] border-border last:border-b-0 hover:bg-surface-hover/50`}
              >
                <td className="px-6 py-4 font-bold border-r-[2px] border-border font-heading text-sm md:text-base">
                  {row.feature}
                </td>
                <td className="px-6 py-4 border-r-[2px] border-border bg-primary/5 text-primary-foreground">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-primary text-surface mt-0.5">
                      <Check className="h-3.5 w-3.5 stroke-[3px]" aria-hidden="true" />
                    </div>
                    <Text variant="small" className="font-semibold text-foreground text-sm leading-relaxed">
                      {row.us}
                    </Text>
                  </div>
                </td>
                <td className="px-6 py-4 text-foreground-secondary">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-error/10 text-error mt-0.5 border border-error/20">
                      <X className="h-3.5 w-3.5 stroke-[3px]" aria-hidden="true" />
                    </div>
                    <Text variant="small" className="text-foreground-secondary text-sm leading-relaxed">
                      {row.them}
                    </Text>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LandingSection>
  );
}
