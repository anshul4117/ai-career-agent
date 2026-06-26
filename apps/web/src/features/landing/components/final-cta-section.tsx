"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { LandingSection } from "@/features/landing/components/section-primitives";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalInput } from "@/components/ui/brutal-input";
import { siteConfig } from "@/config/site";
import { Alert } from "@/components/ui/alert";

export function FinalCtaSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <LandingSection id="cta" ariaLabelledBy="cta-heading" className="bg-surface">
      <div className="brutal-card bg-surface-secondary border-[3px] border-border brutal-shadow text-center p-8 md:p-12 lg:p-16 max-w-4xl mx-auto space-y-6">
        <div className="mx-auto inline-flex items-center justify-center p-2 rounded-sm bg-primary/10 text-primary border border-primary/20">
          <Sparkles className="h-5 w-5" />
        </div>
        
        <Heading
          level="h2"
          id="cta-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight max-w-2xl mx-auto leading-none"
        >
          Ready to stop searching and start getting hired?
        </Heading>

        <Text variant="large" className="max-w-xl mx-auto text-foreground-secondary text-sm md:text-base leading-relaxed">
          Skip the duplicates and spam jobs. Create your profile, upload your resume, and let our AI agent coordinate your application stack.
        </Text>

        {isSubmitted ? (
          <div className="max-w-md mx-auto pt-4">
            <Alert
              variant="success"
              title="Success!"
              description="You have successfully joined the AI Career Agent waitlist. We will notify you once onboarding slots open."
              onClose={() => setIsSubmitted(false)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6 items-center justify-center pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <BrutalButton
                variant="default"
                size="lg"
                className="w-full sm:w-auto text-base font-bold uppercase tracking-wide"
                asChild
              >
                <Link href={siteConfig.links.register}>
                  Get Started Now
                  <ArrowRight className="h-5 w-5 ml-1.5" />
                </Link>
              </BrutalButton>
            </div>
            
            <div className="w-full max-w-md border-t-[2px] border-border/10 pt-6">
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                <BrutalInput
                  type="email"
                  placeholder="name@example.com"
                  label="Or join waitlist for early features"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-surface h-12 brutal-border-secondary text-sm"
                />
                <BrutalButton
                  type="submit"
                  variant="secondary"
                  size="default"
                  className="w-full sm:w-auto h-12 uppercase font-bold text-xs tracking-wide brutal-border-secondary text-foreground hover:bg-foreground hover:text-surface"
                >
                  Join Waitlist
                </BrutalButton>
              </form>
            </div>
          </div>
        )}
      </div>
    </LandingSection>
  );
}
