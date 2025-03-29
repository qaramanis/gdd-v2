import Dashboard from "@/components/dashboard/dashboard";
import { ThemeProvider } from "next-themes";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Dashboard />
    </main>
  );
}
