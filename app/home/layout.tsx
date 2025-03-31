import Dashboard from "@/components/dashboard/dashboard";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Dashboard>{children}</Dashboard>;
}
