"use client";

import React from "react";
import type { Company } from "../types/jobs.types";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <BrutalCard className="border-[3px] border-border brutal-shadow-xs hover:brutal-shadow transition-all bg-surface rounded-sm p-4 relative flex flex-col justify-between gap-4 text-left">
      <div>
        {/* Header (Logo fallback and Name) */}
        <div className="flex gap-3 items-start">
          <div className="h-10 w-10 border-2 border-border bg-amber-200 flex items-center justify-center font-black uppercase text-xs rounded-sm shrink-0 brutal-shadow-xs">
            {company.name.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-black uppercase text-foreground truncate leading-tight tracking-tight">
              {company.name}
            </h3>
            <p className="text-[9px] font-bold text-foreground-muted uppercase tracking-wider mt-0.5">
              {company.industry}
            </p>
          </div>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <Badge className="text-[8px] font-black uppercase tracking-wider bg-surface border-2 border-border text-foreground px-1.5 py-0.5">
            {company.companySize} employees
          </Badge>
          <Badge className="text-[8px] font-black uppercase tracking-wider bg-surface border-2 border-border text-foreground px-1.5 py-0.5">
            {company.headquarters.split(",")[0]}
          </Badge>
          {company.isActivelyHiring ? (
            <Badge className="text-[8px] font-black uppercase tracking-wider bg-green-200 border-2 border-border text-green-800 dark:text-green-300 px-1.5 py-0.5">
              Hiring
            </Badge>
          ) : (
            <Badge className="text-[8px] font-black uppercase tracking-wider bg-slate-100 dark:bg-surface-hover border-2 border-border text-foreground-muted px-1.5 py-0.5">
              Closed
            </Badge>
          )}
        </div>

        {/* Culture short summary */}
        <p className="text-[10px] font-semibold text-foreground-secondary line-clamp-2 mt-3 leading-relaxed">
          {company.cultureDescription}
        </p>

        {/* Tech Stack tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {company.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[8px] font-bold bg-surface-secondary border border-border/40 text-foreground px-1.5 py-0.5 rounded-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Footer link trigger */}
      <div className="border-t border-border/10 pt-3 flex items-center justify-between">
        <span className="text-[9px] font-black uppercase tracking-wider text-primary flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5" /> {company.openPositionsCount} Open Roles
        </span>
        
        <Button
          variant="ghost"
          asChild
          className="h-8 px-3 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary text-[9px] font-black uppercase flex items-center gap-1 rounded-sm"
        >
          <Link href={`/companies/${company.id}`}>
            View Profile <ArrowRight className="h-3 w-3 stroke-[2.5px]" />
          </Link>
        </Button>
      </div>
    </BrutalCard>
  );
}
