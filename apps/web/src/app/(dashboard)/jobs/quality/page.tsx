"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  Building,
  BarChart2,
  ChevronLeft,
  Info,
} from "lucide-react";
import { mockJobs, mockCompanies } from "@/features/jobs/mock/jobs-data";
import { cn } from "@/lib/utils";

export default function JobQualityDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "verified" | "fresh" | "none"
  >("all");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800); // Simulated 800ms delay
    return () => clearTimeout(timer);
  }, []);

  // Compute stats from mockJobs and mockCompanies
  const stats = React.useMemo(() => {
    const totalJobs = mockJobs.length;

    // Average quality score
    const avgQuality = Math.round(
      mockJobs.reduce(
        (acc, j) => acc + (j.trustScore * 0.6 + j.freshnessScore * 0.4),
        0,
      ) / totalJobs,
    );

    // Trusted companies (trustScore >= 85)
    const trustedCount = mockCompanies.filter((c) => c.isActivelyHiring).length;

    // Fresh jobs (within 3 days)
    const freshCount = mockJobs.filter((j) => {
      const ageDays =
        (Date.now() - new Date(j.postedDate).getTime()) / (24 * 60 * 60 * 1000);
      return ageDays <= 3;
    }).length;

    // Duplicate jobs removed (mocked count)
    const duplicatesBlocked = 14;

    return {
      avgQuality,
      trustedCount,
      freshCount,
      duplicatesBlocked,
    };
  }, []);

  // Compute distributions
  const distributions = React.useMemo(() => {
    // Quality Distribution
    let excellent = 0,
      good = 0,
      average = 0,
      poor = 0;
    mockJobs.forEach((j) => {
      const score = Math.round(j.trustScore * 0.6 + j.freshnessScore * 0.4);
      if (score >= 90) excellent++;
      else if (score >= 75) good++;
      else if (score >= 50) average++;
      else poor++;
    });

    // Trust Distribution
    let vCount = 0,
      hCount = 0,
      mCount = 0,
      lCount = 0;
    mockJobs.forEach((j) => {
      if (j.trustScore >= 95) vCount++;
      else if (j.trustScore >= 80) hCount++;
      else if (j.trustScore >= 60) mCount++;
      else lCount++;
    });

    return {
      quality: { excellent, good, average, poor },
      trust: { verified: vCount, high: hCount, medium: mCount, low: lCount },
    };
  }, []);

  // Handle empty state triggers
  if (loading) {
    return (
      <div className="space-y-6 pb-12 select-none text-left max-w-[1200px] mx-auto w-full">
        <Button
          variant="ghost"
          disabled
          className="h-9 px-3 border-2 border-border brutal-shadow-xs opacity-50 text-[10px] font-black uppercase flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> Back to discovery
        </Button>
        <PageHeader
          title="Quality Analytics Engine"
          description="Auditing data transparency and trust metrics..."
        />

        {/* Skeleton grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <BrutalCard
              key={i}
              className="h-20 animate-pulse bg-surface-secondary/40 border-2 border-border"
            />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <BrutalCard className="h-64 animate-pulse bg-surface-secondary/40 border-2 border-border" />
          <BrutalCard className="h-64 animate-pulse bg-surface-secondary/40 border-2 border-border" />
        </div>
      </div>
    );
  }

  // Handle Empty States
  if (activeFilter === "verified") {
    // Return empty state for no verified jobs (mocking a scenario where verified filters out everything)
    return (
      <div className="space-y-6 pb-12 select-none text-left max-w-[1200px] mx-auto w-full">
        <Button
          onClick={() => setActiveFilter("all")}
          className="h-9 px-3 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary text-[10px] font-black uppercase flex items-center gap-1 bg-surface text-foreground rounded-sm"
        >
          <ChevronLeft className="h-4 w-4" /> Reset Filters
        </Button>
        <EmptyState
          icon={ShieldCheck}
          title="No verified jobs found"
          description="There are currently no listings passing the high-trust verified hiring partner checklist in this target category."
          primaryAction={{
            label: "Reset Dashboard Filters",
            onClick: () => setActiveFilter("all"),
          }}
        />
      </div>
    );
  }

  if (activeFilter === "fresh") {
    return (
      <div className="space-y-6 pb-12 select-none text-left max-w-[1200px] mx-auto w-full">
        <Button
          onClick={() => setActiveFilter("all")}
          className="h-9 px-3 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary text-[10px] font-black uppercase flex items-center gap-1 bg-surface text-foreground rounded-sm"
        >
          <ChevronLeft className="h-4 w-4" /> Reset Filters
        </Button>
        <EmptyState
          icon={Clock}
          title="No fresh jobs found"
          description="We couldn't detect any active openings posted within the last 24 hours under the current parameters."
          primaryAction={{
            label: "Show All Openings",
            onClick: () => setActiveFilter("all"),
          }}
        />
      </div>
    );
  }

  if (activeFilter === "none") {
    return (
      <div className="space-y-6 pb-12 select-none text-left max-w-[1200px] mx-auto w-full">
        <Button
          onClick={() => setActiveFilter("all")}
          className="h-9 px-3 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary text-[10px] font-black uppercase flex items-center gap-1 bg-surface text-foreground rounded-sm"
        >
          <ChevronLeft className="h-4 w-4" /> Reset Filters
        </Button>
        <EmptyState
          icon={AlertTriangle}
          title="No quality data available"
          description="The Quality Audit database is temporarily undergoing index synchronization. Please check back in a few minutes."
          primaryAction={{
            label: "Reload Audit Data",
            onClick: () => setActiveFilter("all"),
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 select-none text-left max-w-[1200px] mx-auto w-full">
      {/* Back to discovery */}
      <div>
        <BrutalButton
          onClick={() => router.push("/jobs")}
          className="h-9 px-3.5 text-[9px] font-black uppercase border-2 border-border rounded-sm flex items-center gap-1.5"
        >
          <ChevronLeft className="h-4 w-4 stroke-[3px]" /> Back to discovery
        </BrutalButton>
      </div>

      <PageHeader
        title="Job Quality Engine Dashboard"
        description="Verify listing transparency, duplicate indexes, and freshness scores across all job openings."
      />

      {/* Stats Widgets Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <BrutalCard className="border-2 border-border bg-surface p-4 text-left brutal-shadow-xs">
          <p className="text-[8px] font-black uppercase tracking-wider text-foreground-secondary">
            Average Quality score
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-mono text-2xl font-black text-primary">
              {stats.avgQuality}%
            </span>
            <span className="text-[8px] font-bold text-green-600 uppercase">
              Good
            </span>
          </div>
        </BrutalCard>

        {/* Stat 2 */}
        <BrutalCard className="border-2 border-border bg-surface p-4 text-left brutal-shadow-xs">
          <p className="text-[8px] font-black uppercase tracking-wider text-foreground-secondary">
            Actively Hiring Partners
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-mono text-2xl font-black text-foreground">
              {stats.trustedCount}
            </span>
            <span className="text-[8px] font-bold text-foreground-muted uppercase">
              Verified
            </span>
          </div>
        </BrutalCard>

        {/* Stat 3 */}
        <BrutalCard className="border-2 border-border bg-surface p-4 text-left brutal-shadow-xs">
          <p className="text-[8px] font-black uppercase tracking-wider text-foreground-secondary">
            Fresh Postings (3d)
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-mono text-2xl font-black text-foreground">
              {stats.freshCount}
            </span>
            <span className="text-[8px] font-bold text-primary uppercase">
              Active
            </span>
          </div>
        </BrutalCard>

        {/* Stat 4 */}
        <BrutalCard className="border-2 border-border bg-surface p-4 text-left brutal-shadow-xs">
          <p className="text-[8px] font-black uppercase tracking-wider text-foreground-secondary">
            Duplicates Filtered
          </p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-mono text-2xl font-black text-error">
              {stats.duplicatesBlocked}
            </span>
            <span className="text-[8px] font-bold text-error uppercase">
              Blocked
            </span>
          </div>
        </BrutalCard>
      </div>

      {/* Filter Options for testing empty states */}
      <div className="flex items-center gap-2 bg-surface-secondary/40 p-3 border-2 border-border rounded-sm">
        <span className="text-[8px] font-black uppercase text-foreground-muted flex items-center gap-0.5">
          <Info className="h-3 w-3" /> Filter States:
        </span>
        <button
          onClick={() => setActiveFilter("all")}
          className={cn(
            "px-2 py-1 text-[8px] font-black uppercase border border-border transition-colors",
            activeFilter === "all"
              ? "bg-primary text-white"
              : "bg-surface hover:bg-surface-secondary",
          )}
        >
          Active Listings
        </button>
        <button
          onClick={() => setActiveFilter("verified")}
          className={cn(
            "px-2 py-1 text-[8px] font-black uppercase border border-border transition-colors",
            (activeFilter as string) === "verified"
              ? "bg-primary text-white"
              : "bg-surface hover:bg-surface-secondary",
          )}
        >
          Test No Verified
        </button>
        <button
          onClick={() => setActiveFilter("fresh")}
          className={cn(
            "px-2 py-1 text-[8px] font-black uppercase border border-border transition-colors",
            (activeFilter as string) === "fresh"
              ? "bg-primary text-white"
              : "bg-surface hover:bg-surface-secondary",
          )}
        >
          Test No Fresh
        </button>
        <button
          onClick={() => setActiveFilter("none")}
          className={cn(
            "px-2 py-1 text-[8px] font-black uppercase border border-border transition-colors",
            (activeFilter as string) === "none"
              ? "bg-primary text-white"
              : "bg-surface hover:bg-surface-secondary",
          )}
        >
          Test Sync Error
        </button>
      </div>

      {/* Distributions & Analytics panels */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Panel 1: Quality distribution */}
        <BrutalCard className="border-[3px] border-border bg-surface p-5 brutal-shadow text-left">
          <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5 border-b border-border/10 pb-2 mb-4">
            <BarChart2 className="h-4 w-4 text-primary" /> Quality Score
            Distribution
          </h3>
          <div className="space-y-3.5 text-[9px] font-bold uppercase tracking-wide text-foreground-secondary">
            {/* Range 1 */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span>Excellent (90-100)</span>
                <span className="font-mono text-primary font-black">
                  {distributions.quality.excellent} jobs
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-surface-hover rounded-sm overflow-hidden border border-border/10">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${(distributions.quality.excellent / mockJobs.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Range 2 */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span>Good (75-89)</span>
                <span className="font-mono text-foreground font-black">
                  {distributions.quality.good} jobs
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-surface-hover rounded-sm overflow-hidden border border-border/10">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${(distributions.quality.good / mockJobs.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Range 3 */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span>Average (50-74)</span>
                <span className="font-mono text-foreground font-black">
                  {distributions.quality.average} jobs
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-surface-hover rounded-sm overflow-hidden border border-border/10">
                <div
                  className="h-full bg-amber-500"
                  style={{
                    width: `${(distributions.quality.average / mockJobs.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Range 4 */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span>Poor (&lt;50)</span>
                <span className="font-mono text-foreground font-black">
                  {distributions.quality.poor} jobs
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-surface-hover rounded-sm overflow-hidden border border-border/10">
                <div
                  className="h-full bg-red-500"
                  style={{
                    width: `${(distributions.quality.poor / mockJobs.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </BrutalCard>

        {/* Panel 2: Trust distribution */}
        <BrutalCard className="border-[3px] border-border bg-surface p-5 brutal-shadow text-left">
          <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5 border-b border-border/10 pb-2 mb-4">
            <ShieldCheck className="h-4 w-4 text-primary" /> Company Trust
            Evaluation Index
          </h3>
          <div className="space-y-3.5 text-[9px] font-bold uppercase tracking-wide text-foreground-secondary">
            {/* Level 1 */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span>Verified Partner (Score &gt;= 95)</span>
                <span className="font-mono text-primary font-black">
                  {distributions.trust.verified} jobs
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-surface-hover rounded-sm overflow-hidden border border-border/10">
                <div
                  className="h-full bg-green-500"
                  style={{
                    width: `${(distributions.trust.verified / mockJobs.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Level 2 */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span>High Trust (Score 80-94)</span>
                <span className="font-mono text-foreground font-black">
                  {distributions.trust.high} jobs
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-surface-hover rounded-sm overflow-hidden border border-border/10">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${(distributions.trust.high / mockJobs.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Level 3 */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span>Medium Trust (Score 60-79)</span>
                <span className="font-mono text-foreground font-black">
                  {distributions.trust.medium} jobs
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-surface-hover rounded-sm overflow-hidden border border-border/10">
                <div
                  className="h-full bg-amber-500"
                  style={{
                    width: `${(distributions.trust.medium / mockJobs.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Level 4 */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span>Low Trust (&lt;60)</span>
                <span className="font-mono text-foreground font-black">
                  {distributions.trust.low} jobs
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-surface-hover rounded-sm overflow-hidden border border-border/10">
                <div
                  className="h-full bg-red-500"
                  style={{
                    width: `${(distributions.trust.low / mockJobs.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </BrutalCard>
      </div>

      {/* Top verified Hiring Companies */}
      <BrutalCard className="border-[3px] border-border bg-surface p-5 brutal-shadow text-left">
        <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5 border-b border-border/10 pb-2 mb-4">
          <Building className="h-4 w-4 text-primary" /> Certified Hiring
          Companies Directory
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {mockCompanies.slice(0, 6).map((c) => (
            <div
              key={c.id}
              className="border-2 border-border p-3.5 bg-surface-secondary/20 flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="text-[10px] font-black uppercase text-foreground truncate max-w-[150px]">
                    {c.name}
                  </h4>
                  <Badge className="text-[7px] font-black uppercase bg-green-100 text-green-700 border border-green-300 shadow-none px-1.5 py-0.2 rounded-sm">
                    Verified
                  </Badge>
                </div>
                <p className="text-[8px] font-bold text-foreground-muted uppercase tracking-wide mt-0.5">
                  {c.industry}
                </p>
                <p className="text-[8px] font-semibold text-foreground-secondary normal-case leading-snug mt-2 italic">
                  &quot;{c.cultureDescription}&quot;
                </p>
              </div>

              <div className="border-t border-border/10 pt-2 flex items-center justify-between text-[7.5px] font-black uppercase tracking-wider text-foreground-muted">
                <span>Hiring: {c.openPositionsCount} positions</span>
                <span className="text-primary font-extrabold">
                  {c.headquarters.split(",")[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </BrutalCard>
    </div>
  );
}
