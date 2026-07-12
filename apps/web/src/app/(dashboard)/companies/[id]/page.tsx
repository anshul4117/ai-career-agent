"use client";

import React, { useEffect, useState, use } from "react";
import { useCompanyStore } from "@/features/jobs/store/company.store";
import { companyService } from "@/features/jobs/services/company.service";
import type { Company } from "@/features/jobs/types/jobs.types";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CompanyDetailsSkeleton } from "@/components/ui/skeleton-loaders";
import { 
  MapPin, 
  Globe, 
  Briefcase, 
  Users, 
  TrendingUp, 
  ChevronLeft,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } }
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CompanyDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { selectCompany, selectedCompany, companyJobs, loading } = useCompanyStore();
  const [similarCompanies, setSimilarCompanies] = useState<Company[]>([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const company = await companyService.getCompanyById(resolvedParams.id);
        if (company) {
          await selectCompany(company.id);
          const similar = await companyService.getSimilarCompanies(company.id);
          setSimilarCompanies(similar);
        } else {
          setHasError(true);
        }
      } catch {
        setHasError(true);
      }
    };
    loadData();
  }, [resolvedParams.id, selectCompany]);

  if (hasError) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center bg-background px-4 text-center select-none">
        <BrutalCard className="p-8 max-w-md w-full border-[3px] border-border bg-surface brutal-shadow space-y-6 rounded-sm">
          <div className="inline-flex p-3 bg-red-100 border-2 border-border text-red-600 rounded-sm">
            <AlertCircle className="h-10 w-10 stroke-[2.5px]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase text-foreground">Company Not Found</h1>
            <p className="text-[10px] text-foreground-muted leading-relaxed font-semibold uppercase">
              The company profile ID does not exist or is inactive.
            </p>
          </div>
          <Button asChild className="h-10 px-5 text-xs font-black uppercase border-2 border-border brutal-shadow-xs">
            <Link href="/companies">Return to Directory</Link>
          </Button>
        </BrutalCard>
      </div>
    );
  }

  if (loading || !selectedCompany) {
    return (
      <div className="space-y-6">
        <div>
          <Button
            variant="ghost"
            disabled
            className="h-9 px-3 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary text-[10px] font-black uppercase flex items-center gap-1 rounded-sm opacity-50"
          >
            <ChevronLeft className="h-4 w-4 stroke-[2.5px]" /> Back to Directory
          </Button>
        </div>
        <CompanyDetailsSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 text-left select-none relative">
      
      {/* Back to list redirection button */}
      <div>
        <Button
          variant="ghost"
          asChild
          className="h-9 px-3 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary text-[10px] font-black uppercase flex items-center gap-1 rounded-sm"
        >
          <Link href="/companies">
            <ChevronLeft className="h-4 w-4 stroke-[2.5px]" /> Back to Directory
          </Link>
        </Button>
      </div>

      {/* Header Profile Card */}
      <BrutalCard className="border-[3px] border-border bg-surface p-6 brutal-shadow rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-4 items-center">
          <div className="h-16 w-16 border-[3px] border-border bg-amber-200 flex items-center justify-center font-black uppercase text-xl rounded-sm brutal-shadow-xs shrink-0">
            {selectedCompany.name.slice(0, 2)}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black uppercase tracking-tight text-foreground leading-none">
                {selectedCompany.name}
              </h1>
              {selectedCompany.isActivelyHiring && (
                <Badge className="text-[8px] font-black uppercase bg-green-200 border-2 border-border text-green-800 dark:text-green-300 px-1.5 py-0.5 rounded-sm brutal-shadow-xs">
                  Hiring
                </Badge>
              )}
            </div>
            <p className="text-xs font-bold text-foreground-secondary">{selectedCompany.industry}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-foreground-muted uppercase">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {selectedCompany.headquarters}</span>
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {selectedCompany.companySize} employees</span>
            </div>
          </div>
        </div>

        <div>
          <BrutalButton
            onClick={() => window.open(selectedCompany.website, "_blank")}
            className="h-10 px-5 text-xs font-black uppercase tracking-wide brutal-shadow-xs flex items-center justify-center gap-1.5"
          >
            Visit Website <Globe className="h-4 w-4 stroke-[2.5px]" />
          </BrutalButton>
        </div>
      </BrutalCard>

      {/* Main grids sections */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Left Column: About, Culture & Active Jobs */}
        <div className="md:col-span-2 space-y-6">
          <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground border-b border-border/10 pb-2 mb-3">
              Corporate Culture & Mission
            </h3>
            <p className="text-xs font-semibold text-foreground-secondary leading-relaxed">
              {selectedCompany.cultureDescription}
            </p>
          </BrutalCard>

          {/* Active Job Positions */}
          <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground border-b border-border/10 pb-2 flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-primary" /> Active Job Openings ({companyJobs.length})
            </h3>
            {companyJobs.length === 0 ? (
              <p className="text-[10px] font-bold text-foreground-muted uppercase">
                No active listings posted. Check back later or view similar companies.
              </p>
            ) : (
              <motion.div variants={container} initial="hidden" animate="show" className="grid gap-3">
                {companyJobs.map((job) => (
                  <motion.div variants={item} key={job.id} className="p-3.5 border-2 border-border bg-surface-secondary/10 flex items-center justify-between gap-4 rounded-sm hover:-translate-y-0.5 transition-all">
                    <div className="min-w-0">
                      <h4 className="text-xs font-black uppercase truncate text-foreground">{job.title}</h4>
                      <p className="text-[9px] font-bold text-foreground-muted uppercase mt-0.5">
                        {job.location} • {job.remoteType} • {job.experienceLevel}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      asChild
                      className="h-8 px-3 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary text-[9px] font-black uppercase flex items-center gap-1 shrink-0 rounded-sm"
                    >
                      <Link href={`/jobs/${job.id}`}>
                        Apply
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </BrutalCard>
        </div>

        {/* Right Column: Details metadata, Stack & Benefits */}
        <div className="space-y-6">
          <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground border-b border-border/10 pb-2">
              Company Facts
            </h3>
            
            <div className="space-y-2 text-[10px] font-bold text-foreground-muted uppercase">
              <div className="flex justify-between">
                <span>Funding round:</span>
                <span className="text-foreground">{selectedCompany.fundingStage}</span>
              </div>
              <div className="flex justify-between">
                <span>Company Size:</span>
                <span className="text-foreground">{selectedCompany.companySize} employees</span>
              </div>
              <div className="flex justify-between">
                <span>Industry:</span>
                <span className="text-foreground">{selectedCompany.industry}</span>
              </div>
              <div className="flex justify-between">
                <span>Headquarters:</span>
                <span className="text-foreground">{selectedCompany.headquarters}</span>
              </div>
            </div>
          </BrutalCard>

          {/* Tech Stack Badges */}
          <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground border-b border-border/10 pb-2 mb-3">
              Engineering Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedCompany.techStack.map((tech) => (
                <Badge key={tech} className="text-[9px] font-black uppercase tracking-wider bg-surface border-2 border-border text-foreground px-2 py-0.5">
                  {tech}
                </Badge>
              ))}
            </div>
          </BrutalCard>

          {/* Benefits */}
          <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground border-b border-border/10 pb-2 mb-3">
              Perks & Benefits
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedCompany.benefitsList.map((ben) => (
                <Badge key={ben} className="text-[9px] font-bold bg-surface-secondary border border-border/40 text-foreground-secondary px-2 py-0.5">
                  {ben}
                </Badge>
              ))}
            </div>
          </BrutalCard>
        </div>

      </div>

      {/* 4. Similar Companies Recommendation */}
      {similarCompanies.length > 0 && (
        <div className="space-y-3.5 border-t border-border/10 pt-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-primary" /> Similar Companies in {selectedCompany.industry}
          </h3>
          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-3">
            {similarCompanies.map((simCo) => (
              <motion.div variants={item} key={simCo.id}>
                <BrutalCard
                  className="border-2 border-border bg-surface p-4 brutal-shadow-xs hover:brutal-shadow-sm rounded-sm h-full"
                >
                  <div className="flex gap-2 items-center">
                  <div className="h-8 w-8 border-2 border-border bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center font-black uppercase text-[10px] rounded-sm shrink-0">
                    {simCo.name.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black uppercase truncate text-foreground leading-tight">{simCo.name}</h4>
                    <p className="text-[8px] font-bold text-foreground-muted uppercase tracking-wider mt-0.5">{simCo.headquarters.split(",")[0]}</p>
                  </div>
                </div>
                
                <div className="mt-3.5 flex justify-between items-center text-[8px] font-black text-foreground-muted uppercase">
                  <span>{simCo.openPositionsCount} Open Positions</span>
                  <Button
                    variant="ghost"
                    asChild
                    className="h-7 px-2 border border-border/30 text-[8px] font-bold uppercase rounded-sm"
                  >
                    <Link href={`/companies/${simCo.id}`}>
                      Profile
                    </Link>
                  </Button>
                  </div>
                </BrutalCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

    </div>
  );
}
