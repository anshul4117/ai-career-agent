import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getJobById } from "@/features/jobs/mock/jobs";
import { formatDate, formatPercent } from "@/lib/utils";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const job = getJobById(id);
  return { title: job?.title ?? "Job Not Found" };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title={job.title}
        description={`${job.company} · ${job.location}`}
        action={
          <div className="flex gap-2">
            <Button variant="secondary">Save</Button>
            <Button asChild>
              <Link href={`/jobs/${job.id}/apply`}>
                Apply
              </Link>
            </Button>
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap gap-4">
        <ScoreBlock label="Match Score" value={job.matchScore} highlight />
        <ScoreBlock label="Quality Score" value={job.qualityScore} />
        <div className="brutal-card px-6 py-4">
          <p className="text-xs text-foreground-muted">Posted</p>
          <p className="text-lg font-bold">{formatDate(job.postedAt)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground-secondary">{job.description}</p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Required Skills</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill) => (
                <Badge key={skill} variant="default">
                  {skill}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferred Skills</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {job.preferredSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">{job.company}</p>
              <p className="mt-1 text-sm text-foreground-secondary">{job.location}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Button variant="ghost" asChild>
          <Link href="/jobs">← Back to jobs</Link>
        </Button>
      </div>
    </div>
  );
}

function ScoreBlock({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className="brutal-card px-6 py-4">
      <p className="text-xs text-foreground-muted">{label}</p>
      <p className={`text-3xl font-bold ${highlight && value >= 80 ? "text-success" : ""}`}>
        {formatPercent(value)}
      </p>
    </div>
  );
}
