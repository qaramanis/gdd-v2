import Dashboard from "@/components/dashboard/dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Dashboard children={children} />;
}
