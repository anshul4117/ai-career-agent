"use client";

import React from "react";
import Link from "next/link";
import { LandingNavbar } from "@/features/landing/components/landing-navbar";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNavbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 md:py-20 space-y-8">
        <div className="flex items-center gap-3 border-b-[3px] border-border pb-6">
          <div className="p-2.5 border-[3px] border-border bg-surface brutal-shadow rounded-md">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <Heading level="h1" className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
              PRIVACY POLICY
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
              1. Introduction
            </Heading>
            <Text className="text-foreground-secondary text-sm leading-relaxed">
              At AI Career Agent (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), we prioritize user trust and data safety. This Privacy Policy details exactly how we collect, store, process, and secure your candidate profiles, resumes, and matched job records when you access our system.
            </Text>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <Heading level="h2" className="text-xl font-black uppercase tracking-tight">
              2. Information We Collect
            </Heading>
            <Text className="text-foreground-secondary text-sm leading-relaxed">
              We collect information that you explicitly submit to the platform to facilitate matching services:
            </Text>
            <ul className="list-disc list-inside pl-2 text-xs space-y-1 text-foreground-secondary leading-relaxed">
              <li><strong>Account Credentials:</strong> Email addresses and secure password hashes.</li>
              <li><strong>Profile Parameters:</strong> First name, last name, professional headline, preferred roles, target locations, and skills.</li>
              <li><strong>Resume Documents:</strong> Text contents and metadata extracted from uploaded PDF resumes.</li>
              <li><strong>Usage logs:</strong> Interactions with job matching feeds and Kanban columns.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <Heading level="h2" className="text-xl font-black uppercase tracking-tight">
              3. Cookies and Local Storage
            </Heading>
            <Text className="text-foreground-secondary text-sm leading-relaxed">
              We utilize secure HTTP-only cookies and local storage tokens to preserve active user sessions and coordinate dark/light appearance preferences. We do not use third-party tracking or advertising cookies.
            </Text>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <Heading level="h2" className="text-xl font-black uppercase tracking-tight">
              4. Data Security
            </Heading>
            <Text className="text-foreground-secondary text-sm leading-relaxed">
              We implement industry-standard security protocols:
            </Text>
            <ul className="list-disc list-inside pl-2 text-xs space-y-1 text-foreground-secondary leading-relaxed">
              <li>Hashing all passwords using bcrypt before database storage.</li>
              <li>Encrypting session payloads with JSON Web Tokens (JWT) or secure HTTP-only cookies.</li>
              <li>Sanitizing user inputs via strict schemas to prevent SQL injections or Cross-Site Scripting (XSS).</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <Heading level="h2" className="text-xl font-black uppercase tracking-tight">
              5. Third-Party Services
            </Heading>
            <Text className="text-foreground-secondary text-sm leading-relaxed">
              We coordinate integrations with LLM providers (e.g., OpenAI or Anthropic) for PDF text extraction and match scoring. These integrations process resume details temporarily and do not utilize your personal files for model training.
            </Text>
          </div>

          {/* Section 6 */}
          <div className="space-y-2">
            <Heading level="h2" className="text-xl font-black uppercase tracking-tight">
              6. Your User Rights
            </Heading>
            <Text className="text-foreground-secondary text-sm leading-relaxed">
              You maintain full authority over your data. At any time, you can edit your profile coordinates, delete uploaded resume PDFs, or permanently close your account via the settings dashboard, which immediately expunges your records.
            </Text>
          </div>

          {/* Section 7 */}
          <div className="space-y-2">
            <Heading level="h2" className="text-xl font-black uppercase tracking-tight">
              7. Updates to This Policy
            </Heading>
            <Text className="text-foreground-secondary text-sm leading-relaxed">
              We may periodically revise this policy to reflect platform updates. The active revision date will always be visible at the top of this page.
            </Text>
          </div>

          {/* Section 8 */}
          <div className="space-y-2">
            <Heading level="h2" className="text-xl font-black uppercase tracking-tight">
              8. Contact Us
            </Heading>
            <Text className="text-foreground-secondary text-sm leading-relaxed">
              For any questions regarding security audits or data policy details, please contact us at: <a href="mailto:support@aicareeragent.com" className="text-primary hover:underline font-semibold">support@aicareeragent.com</a>.
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
