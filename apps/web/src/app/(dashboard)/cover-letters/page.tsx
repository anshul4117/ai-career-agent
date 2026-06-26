import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Cover Letters",
};

export default function CoverLettersPage() {
  return (
    <div>
      <PageHeader
        title="Cover Letters"
        description="Generate personalized cover letters with AI."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input id="jobTitle" placeholder="Backend Engineer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Linear Labs" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <textarea
                id="description"
                rows={6}
                placeholder="Paste the job description..."
                className="flex w-full rounded-md bg-surface px-4 py-2 text-base brutal-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
            </div>
            <Button>Generate</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[300px] rounded-md bg-surface-secondary p-4 text-sm text-foreground-muted brutal-border-secondary">
              Generated cover letter will appear here. (Mock UI — AI not connected)
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" size="sm">
                Copy
              </Button>
              <Button variant="secondary" size="sm">
                Download
              </Button>
              <Button variant="ghost" size="sm">
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
