"use client";

import React, { useMemo } from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading } from "@/components/ui/typography";
import { Briefcase, Building, Landmark, Star, Clock } from "lucide-react";
import type { Experience } from "../types/experience.types";

interface ExperienceCardProps {
  experience: Experience[];
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  // Sort and calculate preview: current position first, then start date descending
  const sortedExp = useMemo(() => {
    return [...experience].sort((a, b) => {
      if (a.currentPosition && !b.currentPosition) return -1;
      if (!a.currentPosition && b.currentPosition) return 1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }, [experience]);

  const previewExp = useMemo(() => sortedExp.slice(0, 3), [sortedExp]);

  // Statistics Calculations
  const stats = useMemo(() => {
    if (experience.length === 0) {
      return {
        yearsOfExp: "0 mos",
        companiesCount: 0,
        currentCompany: "None",
        currentPosition: "None",
        latestJob: "None",
      };
    }

    // 1. Total Months of Experience
    const totalMonths = experience.reduce((acc, exp) => {
      const start = new Date(exp.startDate);
      const end = exp.currentPosition
        ? new Date()
        : new Date(exp.endDate || "");
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth()) +
        1;
      return acc + Math.max(0, months);
    }, 0);

    const yrs = Math.floor(totalMonths / 12);
    const mos = totalMonths % 12;
    const yearsOfExp =
      yrs > 0
        ? `${yrs} yr${yrs > 1 ? "s" : ""}${mos > 0 ? ` ${mos} mo${mos > 1 ? "s" : ""}` : ""}`
        : `${mos} mo${mos > 1 ? "s" : ""}`;

    // 2. Unique Companies
    const companies = new Set(
      experience.map((e) => e.companyName.trim().toLowerCase()),
    );
    const companiesCount = companies.size;

    // 3. Current Position Info
    const current = experience.find((e) => e.currentPosition);
    const currentCompany = current ? current.companyName : "None";
    const currentPosition = current ? current.jobTitle : "None";

    // 4. Latest Job (by start date)
    const latest = [...experience].sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    )[0];
    const latestJob = latest
      ? `${latest.jobTitle} at ${latest.companyName}`
      : "None";

    return {
      yearsOfExp,
      companiesCount,
      currentCompany,
      currentPosition,
      latestJob,
    };
  }, [experience]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  if (experience.length === 0) {
    return (
      <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
        <div className="space-y-4">
          <Heading
            level="h4"
            className="text-base font-black uppercase tracking-tight flex items-center gap-2"
          >
            <Briefcase className="h-5 w-5 text-primary" aria-hidden="true" />
            Work Experience
          </Heading>
          <div className="py-8 text-center space-y-2">
            <p className="text-foreground-secondary text-xs">
              No professional experience added yet. Add your work history in the
              workspace.
            </p>
          </div>
        </div>
      </BrutalCard>
    );
  }

  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
      <div className="space-y-6">
        {/* Header */}
        <Heading
          level="h4"
          className="text-base font-black uppercase tracking-tight flex items-center gap-2"
        >
          <Briefcase className="h-5 w-5 text-primary" aria-hidden="true" />
          Work Experience
        </Heading>

        {/* Experience Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-2 border-border p-4 bg-surface-secondary brutal-shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" /> Experience Time
            </p>
            <p className="font-mono text-sm font-black text-foreground">
              {stats.yearsOfExp}
            </p>
          </div>

          <div className="space-y-1 border-t-2 md:border-t-0 md:border-l-2 border-border/10 pt-2.5 md:pt-0 md:pl-4">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <Landmark className="h-3.5 w-3.5 text-primary" /> Companies
            </p>
            <p className="font-mono text-sm font-black text-foreground">
              {stats.companiesCount} worked
            </p>
          </div>

          <div className="space-y-1 border-t-2 lg:border-t-0 lg:border-l-2 border-border/10 pt-2.5 lg:pt-0 lg:pl-4 md:col-span-2 lg:col-span-1">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-warning" /> Current Position
            </p>
            <p
              className="text-xs font-black text-foreground truncate uppercase"
              title={stats.currentPosition}
            >
              {stats.currentPosition}
            </p>
          </div>

          <div className="space-y-1 border-t-2 lg:border-t-0 lg:border-l-2 border-border/10 pt-2.5 lg:pt-0 lg:pl-4 md:col-span-2 lg:col-span-1">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-primary" /> Current Company
            </p>
            <p
              className="text-xs font-semibold text-foreground truncate"
              title={stats.currentCompany}
            >
              {stats.currentCompany}
            </p>
          </div>
        </div>

        {/* Timeline Preview */}
        <div className="space-y-4">
          <p className="text-[10px] uppercase font-black tracking-widest text-foreground-muted border-b-2 border-border/10 pb-1">
            Experience Timeline Preview
          </p>

          <div className="relative pl-6 border-l-[3px] border-border space-y-5 ml-3 py-1">
            {previewExp.map((exp) => (
              <div key={exp.id} className="relative">
                {/* Timeline node node indicator */}
                <div className="absolute -left-[37px] top-0.5 h-6 w-6 rounded-full border-2 border-border bg-surface flex items-center justify-center brutal-shadow-sm select-none">
                  <Briefcase className="h-3 w-3 text-foreground shrink-0" />
                </div>

                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="font-extrabold uppercase text-foreground text-sm tracking-tight">
                      {exp.jobTitle}
                    </h5>
                    {exp.currentPosition && (
                      <span className="px-1.5 py-0.5 border border-border bg-success text-white text-[8px] font-black uppercase brutal-shadow-sm select-none">
                        Present
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-foreground-secondary">
                    {exp.companyName} •{" "}
                    <span className="font-medium text-foreground-muted">
                      {exp.location}
                    </span>
                  </p>
                  <p className="text-[10px] text-foreground-muted font-mono">
                    {formatDate(exp.startDate)} –{" "}
                    {exp.currentPosition ? "Present" : formatDate(exp.endDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrutalCard>
  );
}
