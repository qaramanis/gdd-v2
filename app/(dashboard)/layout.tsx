import DashboardLayout from "@/components/dashboard/dashboard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
