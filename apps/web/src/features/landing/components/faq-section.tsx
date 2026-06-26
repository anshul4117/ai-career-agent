"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LandingSection, SectionHeading } from "@/features/landing/components/section-primitives";
import { faqItems } from "@/features/landing/data/landing-content";
import { Heading, Text } from "@/components/ui/typography";

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);

  return (
    <LandingSection id="faq" ariaLabelledBy="faq-heading">
      <SectionHeading
        id="faq-heading"
        title="Frequently Asked Questions"
        description="Everything you need to know before getting started."
      />

      <div className="mx-auto max-w-3xl space-y-4">
        {faqItems.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="brutal-card overflow-hidden p-0 border-[3px] border-border brutal-shadow">
              <Heading level="h3">
                <button
                  type="button"
                  id={`${item.id}-button`}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-heading text-base font-bold transition-colors hover:bg-surface-secondary md:text-lg outline-none focus-visible:bg-surface-secondary"
                  aria-expanded={isOpen}
                  aria-controls={`${item.id}-panel`}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 transition-transform duration-200 text-foreground",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </button>
              </Heading>
              <div
                id={`${item.id}-panel`}
                role="region"
                aria-labelledby={`${item.id}-button`}
                hidden={!isOpen}
                className={cn(
                  "border-t-[2px] border-border px-6 pb-5 pt-4 bg-surface",
                  !isOpen && "hidden",
                )}
              >
                <Text variant="body" className="text-sm md:text-base leading-relaxed text-foreground-secondary">
                  {item.answer}
                </Text>
              </div>
            </div>
          );
        })}
      </div>
    </LandingSection>
  );
}
