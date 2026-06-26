import { Badge } from "@/components/ui/badge";

export function HeroPreviewCard() {
  return (
    <div
      className="w-full max-w-md rotate-1 brutal-card lg:max-w-lg"
      aria-hidden="true"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <Badge variant="success">92% Match</Badge>
        <Badge variant="secondary">Quality 88</Badge>
      </div>

      <h3 className="font-heading text-xl font-bold">Backend Engineer</h3>
      <p className="mt-1 text-sm font-medium text-foreground-secondary">Linear Labs</p>
      <p className="mt-1 text-sm text-foreground-muted">Bengaluru · Full-time · Remote OK</p>

      <div className="mt-6 space-y-3 border-t-[2px] border-border pt-4">
        <PreviewRow label="Freshness" value="High" />
        <PreviewRow label="Trust Score" value="Verified" />
        <PreviewRow label="Skills Match" value="Node.js, TypeScript, PostgreSQL" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-md bg-foreground px-4 py-3 text-center text-sm font-semibold text-surface brutal-border-secondary">
          View Job
        </div>
        <div className="rounded-md bg-surface-secondary px-4 py-3 text-center text-sm font-semibold brutal-border-secondary">
          Save
        </div>
      </div>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
