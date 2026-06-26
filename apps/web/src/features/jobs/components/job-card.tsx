"use client";

import Link from "next/link";
import { Bookmark, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatPercent } from "@/lib/utils";
import type { Job } from "@/features/jobs/mock/jobs";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  isSelected?: boolean;
  onSelect?: () => void;
}

function getScoreVariant(score: number): "success" | "warning" | "secondary" {
  if (score >= 80) return "success";
  if (score < 60) return "warning";
  return "secondary";
}

export function JobCard({ job, isSelected, onSelect }: JobCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-transform duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow-hover",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
      )}
      onClick={onSelect}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">{job.title}</CardTitle>
            <p className="mt-1 text-sm font-medium text-foreground-secondary">{job.company}</p>
          </div>
          <Badge variant={getScoreVariant(job.matchScore)}>{formatPercent(job.matchScore)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 text-sm text-foreground-muted">
          <span>{job.location}</span>
          <span>·</span>
          <span>{job.employmentType.replace("_", " ")}</span>
          <span>·</span>
          <span>{formatDate(job.postedAt)}</span>
        </div>
        <p className="mt-3 text-sm text-foreground-secondary">
          Quality Score: <strong>{formatPercent(job.qualityScore)}</strong>
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="secondary" size="sm" asChild onClick={(e) => e.stopPropagation()}>
          <Link href={`/jobs/${job.id}`}>
            <Eye className="h-4 w-4" />
            View
          </Link>
        </Button>
        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
          <Bookmark className="h-4 w-4" />
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
