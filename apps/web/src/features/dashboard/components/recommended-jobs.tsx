"use client";

import React from "react";
import Link from "next/link";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { RECOMMENDED_JOBS } from "../data/mock-dashboard-data";
import { Briefcase, ArrowRight, Bookmark } from "lucide-react";

export function RecommendedJobs() {
  return (
    <div className="space-y-4 w-full min-w-0">
      <div className="flex items-center justify-between">
        <Heading level="h3" className="text-xl font-black uppercase tracking-tight">
          Recommended Jobs
        </Heading>
        <Link 
          href="/jobs" 
          className="text-xs font-bold uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
        >
          View All Feed
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {RECOMMENDED_JOBS.map((job) => {
          const initials = job.company
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <BrutalCard
              key={job.id}
              className="bg-surface border-[3px] border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 brutal-shadow transition-transform duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow-hover"
            >
              <div className="flex items-start gap-4 min-w-0 w-full">
                {/* Logo Placeholder */}
                <div className="h-12 w-12 border-2 border-border bg-surface-secondary flex items-center justify-center font-black text-sm brutal-shadow-sm rounded-sm shrink-0 select-none">
                  {initials}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Heading level="h4" className="text-base font-bold uppercase tracking-tight break-words">
                      {job.title}
                    </Heading>
                    <span className="text-[10px] font-black text-success uppercase bg-success/10 border-2 border-success px-1.5 py-0.5 rounded-sm brutal-shadow-sm shrink-0">
                      {job.matchScore}% Match
                    </span>
                  </div>
                  <Text className="text-foreground-secondary text-xs break-words">
                    {job.company} • {job.location} • {job.salary}
                  </Text>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <BrutalButton asChild variant="secondary" className="flex-1 sm:flex-initial h-10 px-4 uppercase font-bold text-xs tracking-wider">
                  <Link href={`/jobs/${job.id}`}>View Details</Link>
                </BrutalButton>
                <BrutalButton variant="ghost" className="h-10 w-10 p-0 flex items-center justify-center border-2 border-border brutal-shadow-sm" aria-label="Save Job">
                  <Bookmark className="h-4 w-4" />
                </BrutalButton>
              </div>
            </BrutalCard>
          );
        })}
      </div>
    </div>
  );
}
