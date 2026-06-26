import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { mockApplications } from "@/features/applications/mock/applications";
import { formatDate } from "@/lib/utils";
import type { ApplicationStatus } from "@/types";

export const metadata: Metadata = {
  title: "Applications",
};

function statusVariant(status: ApplicationStatus): "default" | "success" | "warning" | "secondary" {
  switch (status) {
    case "OFFER_RECEIVED":
    case "ACCEPTED":
      return "success";
    case "INTERVIEW_SCHEDULED":
    case "INTERVIEW_COMPLETED":
      return "warning";
    case "REJECTED":
      return "default";
    default:
      return "secondary";
  }
}

function formatStatus(status: ApplicationStatus): string {
  return status.replace(/_/g, " ");
}

export default function ApplicationsPage() {
  return (
    <div>
      <PageHeader
        title="Applications"
        description="Track your job application pipeline."
      />

      <div className="overflow-x-auto rounded-md brutal-border brutal-shadow">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-surface-secondary">
            <tr className="border-b-[2px] border-border">
              <th className="px-4 py-3 font-semibold">Job</th>
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">Applied Date</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockApplications.map((app) => (
              <tr
                key={app.id}
                className="border-b border-border/30 transition-colors hover:bg-surface-hover"
              >
                <td className="px-4 py-4 font-medium">{app.jobTitle}</td>
                <td className="px-4 py-4 text-foreground-secondary">{app.company}</td>
                <td className="px-4 py-4 text-foreground-muted">{formatDate(app.appliedAt)}</td>
                <td className="px-4 py-4">
                  <Badge variant={statusVariant(app.status)}>{formatStatus(app.status)}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
