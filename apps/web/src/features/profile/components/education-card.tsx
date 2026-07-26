"use client";

import React, { useMemo } from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading, Text } from "@/components/ui/typography";
import {
  GraduationCap,
  Calendar,
  MapPin,
  Star,
  Award,
  Building,
  BookOpen,
} from "lucide-react";
import type { Education } from "../types/education.types";

interface EducationCardProps {
  education: Education[];
}

export function EducationCard({ education }: EducationCardProps) {
  // Sort education entries by end date (latest first, current study at top)
  const sortedEdu = useMemo(() => {
    return [...education].sort((a, b) => {
      if (a.currentStudy && !b.currentStudy) return -1;
      if (!a.currentStudy && b.currentStudy) return 1;
      if (a.currentStudy && b.currentStudy) {
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      }
      const aEnd = a.endDate ? new Date(a.endDate).getTime() : 0;
      const bEnd = b.endDate ? new Date(b.endDate).getTime() : 0;
      return bEnd - aEnd;
    });
  }, [education]);

  // Statistics calculations
  const totalEntries = education.length;

  const highestDegree = useMemo(() => {
    const designated = education.find((e) => e.highestEducation);
    if (designated) return designated.degree;

    // Fallback: get the latest entry by start date
    if (education.length === 0) return "None";
    const sortedByStart = [...education].sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );
    return sortedByStart[0]?.degree || "None";
  }, [education]);

  const currentStatus = useMemo(() => {
    const studying = education.find((e) => e.currentStudy);
    if (studying) {
      return `Studying at ${studying.institution}`;
    }
    return "Graduated / Completed";
  }, [education]);

  const latestInstitution = useMemo(() => {
    if (education.length === 0) return "None";
    const sortedByStart = [...education].sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );
    return sortedByStart[0]?.institution || "None";
  }, [education]);

  // Format date helper: "Aug 2020" or "Present"
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  if (education.length === 0) {
    return (
      <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
        <div className="space-y-4">
          <Heading
            level="h4"
            className="text-base font-black uppercase tracking-tight flex items-center gap-2"
          >
            <GraduationCap
              className="h-5 w-5 text-primary"
              aria-hidden="true"
            />
            Education History
          </Heading>
          <div className="py-8 text-center space-y-2">
            <Text className="text-foreground-secondary text-xs">
              No education added yet. Add qualification details in the
              workspace.
            </Text>
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
          <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />
          Education History
        </Heading>

        {/* Education Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-2 border-border p-4 bg-surface-secondary brutal-shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" /> Total Entries
            </p>
            <p className="font-mono text-sm font-black text-foreground">
              {totalEntries} degrees
            </p>
          </div>

          <div className="space-y-1 border-t-2 md:border-t-0 md:border-l-2 border-border/10 pt-2.5 md:pt-0 md:pl-4">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-warning" /> Highest Level
            </p>
            <p
              className="text-xs font-black text-foreground truncate uppercase"
              title={highestDegree}
            >
              {highestDegree}
            </p>
          </div>

          <div className="space-y-1 border-t-2 lg:border-t-0 lg:border-l-2 border-border/10 pt-2.5 lg:pt-0 lg:pl-4 md:col-span-2 lg:col-span-1">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-primary" /> Latest College
            </p>
            <p
              className="text-xs font-semibold text-foreground truncate"
              title={latestInstitution}
            >
              {latestInstitution}
            </p>
          </div>

          <div className="space-y-1 border-t-2 lg:border-t-0 lg:border-l-2 border-border/10 pt-2.5 lg:pt-0 lg:pl-4 md:col-span-2 lg:col-span-1">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-primary" /> Current Status
            </p>
            <p
              className="text-xs font-semibold text-foreground truncate"
              title={currentStatus}
            >
              {currentStatus}
            </p>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="space-y-4">
          <p className="text-[10px] uppercase font-black tracking-widest text-foreground-muted border-b-2 border-border/10 pb-1">
            Academic Timeline
          </p>

          <div className="relative pl-6 border-l-[3px] border-border space-y-6 ml-3 py-2">
            {sortedEdu.map((edu) => (
              <div key={edu.id} className="relative">
                {/* Timeline node node indicator */}
                <div className="absolute -left-[37px] top-1 h-6 w-6 rounded-full border-2 border-border bg-surface flex items-center justify-center brutal-shadow-sm select-none">
                  <GraduationCap className="h-3.5 w-3.5 text-foreground shrink-0" />
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="font-extrabold uppercase text-foreground text-sm tracking-tight">
                      {edu.degree}
                    </h5>
                    {edu.highestEducation && (
                      <span className="px-1.5 py-0.5 border border-border bg-warning text-black text-[8px] font-black uppercase brutal-shadow-sm flex items-center gap-1">
                        <Star className="h-2.5 w-2.5 fill-current" />
                        Highest
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-foreground-secondary">
                    {edu.fieldOfStudy} •{" "}
                    <span className="font-medium">{edu.institution}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-foreground-muted font-mono pt-0.5">
                    <span className="flex items-center gap-1 font-bold">
                      <Calendar className="h-3 w-3" />
                      {formatDate(edu.startDate)} –{" "}
                      {edu.currentStudy ? "Present" : formatDate(edu.endDate)}
                    </span>
                    {edu.location && (
                      <span className="flex items-center gap-1 font-bold">
                        <MapPin className="h-3 w-3" />
                        {edu.location}
                      </span>
                    )}
                    {edu.cgpa && (
                      <span className="px-1.5 py-0.2 border border-border/20 bg-surface-secondary font-black uppercase text-foreground">
                        Grade: {edu.cgpa}
                      </span>
                    )}
                  </div>
                  {edu.description && (
                    <p className="text-foreground-secondary leading-relaxed pt-1.5 border-t border-border/5 mt-1.5 max-w-xl">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrutalCard>
  );
}
