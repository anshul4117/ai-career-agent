import type { Metadata } from "next";
import Link from "next/link";
import { Upload } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockResumes } from "@/features/resume/mock/resumes";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Resume",
};

function parsingVariant(status: string): "success" | "warning" | "secondary" {
  if (status === "COMPLETED") return "success";
  if (status === "PROCESSING") return "warning";
  return "secondary";
}

export default function ResumePage() {
  return (
    <div>
      <PageHeader
        title="Resume"
        description="Upload and manage your resumes."
        action={
          <Button asChild>
            <Link href="/resume/new">Create Resume</Link>
          </Button>
        }
      />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-md border-[3px] border-dashed border-border bg-surface-secondary px-6 py-12 text-center">
            <Upload className="mb-4 h-10 w-10 text-foreground-muted" aria-hidden="true" />
            <p className="mb-2 font-semibold">Drag & drop your resume here</p>
            <p className="mb-4 text-sm text-foreground-muted">PDF or DOCX up to 5MB</p>
            <Button variant="secondary">Browse Files</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Resumes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {mockResumes.map((resume) => (
              <li
                key={resume.id}
                className="flex flex-col gap-4 rounded-md bg-surface-secondary p-4 brutal-border-secondary sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">{resume.fileName}</p>
                  <p className="text-sm text-foreground-muted">
                    {formatDate(resume.uploadedAt)} · {resume.fileSize}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={parsingVariant(resume.parsingStatus)}>
                    {resume.parsingStatus}
                  </Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/resume/${resume.id}`}>View</Link>
                  </Button>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                  <Button variant="ghost" size="sm">
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
