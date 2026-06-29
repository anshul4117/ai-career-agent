"use client";

import React from "react";
import Link from "next/link";
import { LandingNavbar } from "@/features/landing/components/landing-navbar";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Target, 
  Eye, 
  Cpu, 
  ShieldCheck, 
  Users, 
  Rocket, 
  ArrowRight,
  Code
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNavbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 md:py-20 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="secondary" className="px-3 py-1 text-xs uppercase font-black border-2 border-border brutal-shadow-sm tracking-wider">
            Our Story
          </Badge>
          <Heading level="h1" className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none">
            REDEFINING THE JOB SEARCH SYSTEM
          </Heading>
          <Text variant="large" className="text-foreground-secondary text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            AI Career Agent was founded to eliminate ghost listings and resume adaptation fatigue, empowering developers and designers with high-leverage matching.
          </Text>
        </section>

        {/* Mission & Vision */}
        <section className="grid gap-6 md:grid-cols-2">
          <BrutalCard className="bg-surface border-[3px] border-border p-8 space-y-4 brutal-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-sm bg-primary/10 text-primary border-2 border-border flex items-center justify-center brutal-shadow-sm">
                <Target className="h-6 w-6" />
              </div>
              <Heading level="h2" className="text-2xl font-black uppercase tracking-tight">Our Mission</Heading>
              <Text className="text-foreground-secondary leading-relaxed text-sm">
                To build the most trusted, zero-spam portal for technical talent. We curate verified postings directly from engineering repositories and YC portfolios, ensuring every listing has active hiring intent.
              </Text>
            </div>
          </BrutalCard>

          <BrutalCard className="bg-surface border-[3px] border-border p-8 space-y-4 brutal-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-sm bg-primary/10 text-primary border-2 border-border flex items-center justify-center brutal-shadow-sm">
                <Eye className="h-6 w-6" />
              </div>
              <Heading level="h2" className="text-2xl font-black uppercase tracking-tight">Our Vision</Heading>
              <Text className="text-foreground-secondary leading-relaxed text-sm">
                A job application workflow that requires only one click to optimize resumes, tailor cover letters, and log timelines in a consolidated dashboard, eliminating spreadsheets.
              </Text>
            </div>
          </BrutalCard>
        </section>

        {/* Why AI Career Agent */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <Heading level="h2" className="text-3xl font-black uppercase tracking-tight">Why We Built This</Heading>
            <Text className="text-foreground-secondary text-sm max-w-lg mx-auto">
              Job boards treat applicants like products. We design systems that treat applicants like professionals.
            </Text>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "100% Verified Listings",
                desc: "We parse employer career domains directly, completely eliminating aggregators and obsolete third-party job ads.",
              },
              {
                icon: Cpu,
                title: "Decoupled AI Matching",
                desc: "Our ATS optimizer checks your skills against target listings inside a local cache before submitting files.",
              },
              {
                icon: Rocket,
                title: "Modern Candidate UX",
                desc: "We ditch complex UI templates for bold brutalist typography and fast, responsive layout flows.",
              },
            ].map((feature, i) => (
              <BrutalCard key={i} className="bg-surface border-[3px] border-border p-6 space-y-3 brutal-shadow">
                <div className="h-10 w-10 rounded-sm bg-primary/10 text-primary border-2 border-border flex items-center justify-center brutal-shadow-sm">
                  {React.createElement(feature.icon, { className: "h-5 w-5" })}
                </div>
                <Heading level="h3" className="text-lg font-black uppercase tracking-tight">{feature.title}</Heading>
                <Text className="text-foreground-secondary text-xs leading-relaxed">{feature.desc}</Text>
              </BrutalCard>
            ))}
          </div>
        </section>

        {/* Product Timeline */}
        <section className="space-y-8">
          <Heading level="h2" className="text-3xl font-black uppercase tracking-tight text-center">Product Timeline</Heading>
          
          <div className="relative border-l-[3px] border-border ml-4 md:ml-32 space-y-6 pb-2">
            {[
              {
                date: "Q2 2025",
                title: "Beta Foundations (Sprint 0.8)",
                desc: "Refactored monorepo store controllers, edge-guards, and layout router handshakes.",
              },
              {
                date: "Q3 2025",
                title: "Profile & Builder Wizard",
                desc: "Deploys drag-and-drop resume managers and ATS validation panels.",
              },
              {
                date: "Q4 2025",
                title: "Spam-Free Job Feeds",
                desc: "Launches verified aggregator feeds from direct career portals.",
              },
              {
                date: "Q1 2026",
                title: "AI Optimizers & MVP Release",
                desc: "Automated cover letter integrations and public candidate pipelines dashboard.",
              },
            ].map((milestone, idx) => (
              <div key={idx} className="relative pl-6">
                <span className="absolute -left-[10px] top-1.5 h-4 w-4 rounded-full border-2 border-border bg-foreground brutal-shadow-sm" />
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-primary font-mono uppercase bg-primary/10 border border-primary px-1.5 py-0.5 rounded-sm">
                    {milestone.date}
                  </span>
                  <Heading level="h4" className="text-base font-black uppercase tracking-tight pt-1">
                    {milestone.title}
                  </Heading>
                  <Text className="text-foreground-secondary text-xs leading-relaxed max-w-xl">
                    {milestone.desc}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Stack */}
        <section className="space-y-6">
          <Heading level="h2" className="text-3xl font-black uppercase tracking-tight text-center">Engineered For Performance</Heading>
          
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4 select-none">
            {[
              { title: "Next.js App Router", label: "SSR Gateway" },
              { title: "TypeScript (Strict)", label: "Static Safety" },
              { title: "Zustand Stores", label: "State Layer" },
              { title: "Vanilla CSS Variables", label: "Styles Base" },
            ].map((tech, i) => (
              <div key={i} className="p-4 border-[3px] border-border bg-surface text-center brutal-shadow-sm rounded-sm">
                <Code className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-extrabold text-sm">{tech.title}</p>
                <p className="text-[10px] text-foreground-muted uppercase font-bold mt-1">{tech.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Meet the Team Placeholder */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <Heading level="h2" className="text-3xl font-black uppercase tracking-tight flex items-center justify-center gap-2">
              <Users className="h-7 w-7 text-primary" />
              Meet the Builders
            </Heading>
            <Text className="text-foreground-secondary text-sm max-w-lg mx-auto">
              Our core engineering and product leadership group.
            </Text>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-2xl mx-auto">
            {[
              {
                name: "Anshul Kumar",
                role: "Chief Technology Officer & Lead Architect",
                avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=anshul",
                desc: "Specialist in high-fidelity React architectures, type safety layers, and monorepo configurations.",
              },
              {
                name: "ACA Copilot",
                role: "AI Career Systems Specialist",
                avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=copilot",
                desc: "Generates tailored bullet updates, ATS evaluations, and automated cover letters.",
              },
            ].map((member, i) => (
              <BrutalCard key={i} className="bg-surface border-[3px] border-border p-6 text-center space-y-3 brutal-shadow">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-16 w-16 mx-auto rounded-full border-2 border-border brutal-shadow-sm"
                />
                <div>
                  <Heading level="h4" className="text-base font-black uppercase tracking-tight">{member.name}</Heading>
                  <p className="text-[10px] text-primary uppercase font-bold mt-0.5">{member.role}</p>
                </div>
                <Text className="text-foreground-secondary text-xs leading-relaxed">{member.desc}</Text>
              </BrutalCard>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center pt-8">
          <BrutalCard className="bg-surface-secondary border-[3px] border-border p-8 max-w-2xl mx-auto space-y-6 brutal-shadow">
            <Heading level="h3" className="text-2xl font-black uppercase tracking-tight leading-none">
              Ready to find high-match positions?
            </Heading>
            <Text className="text-foreground-secondary text-sm leading-relaxed max-w-md mx-auto">
              Stop filing manual customization spreadsheets. Create a profile, compile your resume draft, and automate your job search tracker.
            </Text>
            <div className="pt-2">
              <BrutalButton asChild className="w-full sm:w-auto px-8 h-12 uppercase font-bold text-sm tracking-wide inline-flex items-center justify-center gap-1.5">
                <Link href="/register">
                  Get Started Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </BrutalButton>
            </div>
          </BrutalCard>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
