"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JobCard } from "@/features/jobs/components/job-card";
import { mockJobs, type Job } from "@/features/jobs/mock/jobs";
import { formatPercent } from "@/lib/utils";

export default function JobsPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(mockJobs[0] ?? null);

  return (
    <div>
      <PageHeader
        title="Jobs"
        description="Quality-ranked opportunities matched to your profile."
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Filters */}
        <aside className="lg:col-span-3">
          <div className="brutal-card space-y-4">
            <h2 className="font-semibold">Filters</h2>
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input id="search" placeholder="Job title, keyword..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="City or Remote" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employment">Employment Type</Label>
              <Input id="employment" placeholder="Full-time, Remote..." />
            </div>
          </div>
        </aside>

        {/* Job List */}
        <div className="space-y-4 lg:col-span-5">
          {mockJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSelected={selectedJob?.id === job.id}
              onSelect={() => setSelectedJob(job)}
            />
          ))}
        </div>

        {/* Preview */}
        <aside className="hidden lg:col-span-4 lg:block">
          {selectedJob ? (
            <div className="brutal-card sticky top-24">
              <h2 className="mb-1 text-xl font-bold">{selectedJob.title}</h2>
              <p className="mb-4 text-sm text-foreground-secondary">{selectedJob.company}</p>
              <div className="mb-4 flex gap-4">
                <div>
                  <p className="text-xs text-foreground-muted">Match</p>
                  <p className="text-2xl font-bold text-success">
                    {formatPercent(selectedJob.matchScore)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-foreground-muted">Quality</p>
                  <p className="text-2xl font-bold">{formatPercent(selectedJob.qualityScore)}</p>
                </div>
              </div>
              <p className="text-sm text-foreground-secondary line-clamp-6">
                {selectedJob.description}
              </p>
            </div>
          ) : (
            <div className="brutal-card text-center text-sm text-foreground-muted">
              Select a job to preview
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
