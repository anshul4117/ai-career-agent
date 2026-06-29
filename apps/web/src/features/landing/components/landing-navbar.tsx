"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { announcementBar } from "@/features/landing/data/landing-content";

export function LandingNavbar() {
  return (
    <div className="w-full">
      {/* Announcement Bar */}
      <div className="bg-foreground text-surface text-center py-2 px-4 text-xs font-semibold uppercase tracking-wider brutal-border-secondary border-t-0 border-x-0">
        {announcementBar.text}
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b-[3px] border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:h-[72px] md:px-6">
          <Logo />

          <nav className="hidden items-center gap-6 md:flex" aria-label="Landing page navigation">
            <Link
              href="#features"
              className="text-sm font-semibold text-foreground-secondary transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-semibold text-foreground-secondary transition-colors hover:text-foreground"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-semibold text-foreground-secondary transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-foreground-secondary transition-colors hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="#faq"
              className="text-sm font-semibold text-foreground-secondary transition-colors hover:text-foreground"
            >
              FAQ
            </Link>
            <a
              href="https://github.com/anshul4117/ai-career-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground-secondary transition-colors hover:text-foreground"
              aria-label="GitHub Repository"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <BrutalButton
              variant="secondary"
              size="sm"
              hasLift={false}
              className="hidden sm:inline-flex border-none hover:bg-surface-secondary text-sm font-bold uppercase tracking-wide"
              asChild
            >
              <Link href={siteConfig.links.login}>Sign In</Link>
            </BrutalButton>
            <BrutalButton
              variant="default"
              size="sm"
              hasLift={true}
              className="text-xs sm:text-sm font-bold uppercase tracking-wide"
              asChild
            >
              <Link href={siteConfig.links.register}>Get Started</Link>
            </BrutalButton>
          </div>
        </div>
      </header>
    </div>
  );
}
