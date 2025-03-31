import Dashboard from "@/components/dashboard/dashboard";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Dashboard>{children}</Dashboard>;
}
