"use client";

import React from "react";
import Link from "next/link";
import { LandingNavbar } from "@/features/landing/components/landing-navbar";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNavbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 md:py-20 space-y-8">
        <div className="flex items-center gap-3 border-b-[3px] border-border pb-6">
          <div className="p-2.5 border-[3px] border-border bg-surface brutal-shadow rounded-md">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <Heading level="h1" className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              TERMS OF SERVICE
            </Heading>
            <Text className="text-foreground-secondary text-xs font-mono uppercase font-bold mt-1">
              Last Updated: June 2026 • AI Career Agent Platform
            </Text>
          </div>
        </div>

        <BrutalCard className="bg-surface border-[3px] border-border p-6 md:p-8 space-y-6 brutal-shadow">
          {/* Section 1 */}
          <div className="space-y-2">
            <Heading level="h2" className="text-xl font-black uppercase tracking-tight">
              1. Acceptance of Terms
            </Heading>
            <Text className="text-foreground-secondary text-sm leading-relaxed">
              By accessing, registering, or utilizing the AI Career Agent platform, matching services, or resume builder tools, you agree to be bound by these Terms of Service. If you do not accept these conditions, you may not utilize the platform.
            </Text>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <Heading level="h2" className="text-xl font-black uppercase tracking-tight">
              2. User Responsibilities
            </Heading>
            <Text className="text-foreground-secondary text-sm leading-relaxed">
              You represent that the coordinates, skills, work histories, and files submitted are accurate. You are solely responsible for maintaining the confidentiality of your session cookies and account credentials.
            </Text>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <Heading level="h2" className="text-xl font-black uppercase tracking-tight">
              3. Prohibited Use
            </Heading>
            <Text className="text-foreground-secondary text-sm leading-relaxed">
              When utilizing the platform, you agree not to:
            </Text>
            <ul className="list-disc list-inside pl-2 text-xs space-y-1 text-foreground-secondary leading-relaxed">
              <li>Submit fraudulent experience documents, outdated details, or copyrighted assets.</li>
              <li>Attempt to scrape, reverse-engineer, or compromise the integrity of job matching indices.</li>
              <li>Use unauthorized bots or automation paths that exceed target API boundaries.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <Heading level="h2" className="text-xl font-black uppercase tracking-tight">
              4. Intellectual Property
            </Heading>
            <Text className="text-foreground-secondary text-sm leading-relaxed">
              The AI Career Agent codebase, visual styling, logo systems, and structural layouts are properties of the project developers and protected by trademark and copyright regulations. Candidate resumes generated inside the platform belong strictly to the user.
            </Text>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <Heading level="h2" className="text-xl font-black uppercase tracking-tight">
              5. Limitation of Liability
            </Heading>
            <Text className="text-foreground-secondary text-sm leading-relaxed">
              AI Career Agent provides mock metrics, parsing outputs, and automated resume optimizations for assistance purposes. We do not guarantee employment, offer conversions, or error-free parsing accuracy.
            </Text>
          </div>

          {/* Section 6 */}
          <div className="space-y-2">
            <Heading level="h2" className="text-xl font-black uppercase tracking-tight">
              6. Termination of Services
            </Heading>
            <Text className="text-foreground-secondary text-sm leading-relaxed">
              We reserve the right to suspend or close candidate accounts that breach these terms or engage in malicious API requests.
            </Text>
          </div>

          {/* Section 7 */}
          <div className="space-y-2">
            <Heading level="h2" className="text-xl font-black uppercase tracking-tight">
              7. Governing Law
            </Heading>
            <Text className="text-foreground-secondary text-sm leading-relaxed">
              These terms are governed by the laws of India, without regard to conflict of law principles. Any legal actions will be resolved in courts located in Bengaluru, Karnataka.
            </Text>
          </div>

          {/* Section 8 */}
          <div className="space-y-2">
            <Heading level="h2" className="text-xl font-black uppercase tracking-tight">
              8. Contact coordinates
            </Heading>
            <Text className="text-foreground-secondary text-sm leading-relaxed">
              For administrative inquiries or formal notifications regarding intellectual rights, please write to: <a href="mailto:legal@aicareeragent.com" className="text-primary hover:underline font-semibold">legal@aicareeragent.com</a>.
            </Text>
          </div>
        </BrutalCard>

        <div className="pt-4 flex justify-center">
          <BrutalButton asChild variant="secondary" className="px-6 h-12 uppercase font-bold text-sm tracking-wide">
            <Link href="/" className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </BrutalButton>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
