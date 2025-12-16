import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-accent">
          Welcome back! Here&apos;s an overview of your projects.
        </p>
      </div>
      <Button onClick={() => router.push("/new-game")} className="gap-2">
        <Plus className="h-4 w-4" />
        New Game
      </Button>
    </div>
  );
}
