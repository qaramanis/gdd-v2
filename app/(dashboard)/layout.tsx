import DashboardLayout from "@/components/dashboard/dashboard-layout/dashboard-layout";
import { BreadcrumbProvider } from "@/providers/breadcrumb-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <BreadcrumbProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </BreadcrumbProvider>
  );
}
