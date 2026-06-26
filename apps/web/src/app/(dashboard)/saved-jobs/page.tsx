import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { JobCard } from "@/features/jobs/components/job-card";
import { mockSavedJobIds } from "@/features/applications/mock/applications";
import { mockJobs } from "@/features/jobs/mock/jobs";

export const metadata: Metadata = {
  title: "Saved Jobs",
};

export default function SavedJobsPage() {
  const savedJobs = mockJobs.filter((job) => mockSavedJobIds.includes(job.id));

  return (
    <div>
      <PageHeader
        title="Saved Jobs"
        description="Jobs you've bookmarked for later."
      />

      {savedJobs.length === 0 ? (
        <EmptyState
          title="No saved jobs"
          description="Save jobs from the listings page to review them here."
          actionLabel="Browse Jobs"
          actionHref="/jobs"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
