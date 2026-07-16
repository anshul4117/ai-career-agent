"use client";

import React, { useEffect, useState, use } from "react";
import { useJobsStore } from "@/features/jobs/store/jobs.store";
import { jobService } from "@/features/jobs/services/job.service";
import { JobDetailsPane } from "@/features/jobs/components/job-details-pane";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { JobDetailsSkeleton } from "@/components/ui/skeleton-loaders";
import Link from "next/link";


interface PageProps {
  params: Promise<{ id: string }>;
}

export default function JobDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { selectJob, selectedJob, loading } = useJobsStore();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchTargetJob = async () => {
      try {
        const job = await jobService.getJobById(resolvedParams.id);
        if (job) {
          await selectJob(job.id);
        } else {
          setHasError(true);
        }
      } catch {
        setHasError(true);
      }
    };
    fetchTargetJob();
  }, [resolvedParams.id, selectJob]);

  if (hasError) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center bg-background px-4 text-center select-none">
        <BrutalCard className="p-8 max-w-md w-full border-[3px] border-border bg-surface brutal-shadow space-y-6 rounded-sm">
          <div className="inline-flex p-3 bg-red-100 border-2 border-border text-red-600 rounded-sm">
            <AlertCircle className="h-10 w-10 stroke-[2.5px]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase text-foreground">Listing Not Found</h1>
            <p className="text-[10px] text-foreground-muted leading-relaxed font-semibold uppercase">
              The job listing ID does not exist or has expired.
            </p>
          </div>
          <Button asChild className="h-10 px-5 text-xs font-black uppercase border-2 border-border brutal-shadow-xs">
            <Link href="/jobs">Return to Jobs Discovery</Link>
          </Button>
        </BrutalCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 text-left select-none relative max-w-[1200px] mx-auto w-full">

      {/* Back button */}
      <div>
        <Button
          variant="ghost"
          asChild
          className="h-9 px-3 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary text-[10px] font-black uppercase flex items-center gap-1 rounded-sm"
        >
          <Link href="/jobs">
            <ChevronLeft className="h-4 w-4 stroke-[2.5px]" /> Back to Discovery
          </Link>
        </Button>
      </div>

      {/* Detail Pane container */}
      {loading || !selectedJob ? (
        <JobDetailsSkeleton />
      ) : (
        <JobDetailsPane job={selectedJob} />
      )}

    </div>
  );
}
