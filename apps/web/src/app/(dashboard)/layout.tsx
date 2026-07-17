import { AuthGuard } from "@/features/auth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DashboardOnboarding } from "@/features/onboarding/components/dashboard-onboarding";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
      <DashboardOnboarding />
    </AuthGuard>
  );
}
