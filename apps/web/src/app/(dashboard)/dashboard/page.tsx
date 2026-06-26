import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDashboardStats } from "@/features/dashboard/mock/stats";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  const stats = mockDashboardStats;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your career command center — quality jobs, not spam."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Profile Completion" value={`${stats.profileCompletion}%`} />
        <StatCard
          title="Resume Status"
          value={stats.resumeUploaded ? "Uploaded" : "Not Uploaded"}
        />
        <StatCard title="Job Matches" value={String(stats.jobMatches)} />
        <StatCard title="Applications" value={String(stats.totalApplications)} />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {stats.recentActivity.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between border-b-[2px] border-border pb-4 last:border-0 last:pb-0"
              >
                <span className="text-sm font-medium">{item.action}</span>
                <span className="text-xs text-foreground-muted">{item.time}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-foreground-secondary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
