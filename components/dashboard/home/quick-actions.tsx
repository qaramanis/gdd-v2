import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Settings, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="bg-primary/5 p-6 rounded-lg md:w-128 md:h-128 flex flex-col dark:bg-gray-900/60 md:flex-shrink-0">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4 flex-1">
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center gap-3 h-full bg-gray-800/20 dark:bg-gray-800/50 hover:bg-gray-800/30 dark:hover:bg-gray-800/70 rounded-lg"
        >
          <Shield className="text-cyan-400 size-12" />
          <span className="text-base">Security Scan</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center gap-3 h-full bg-gray-800/20 dark:bg-gray-800/50 hover:bg-gray-800/30 dark:hover:bg-gray-800/70 rounded-lg"
        >
          <RefreshCw className="text-cyan-400 size-12" />
          <span className="text-base">Sync Data</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center gap-3 h-full bg-gray-800/20 dark:bg-gray-800/50 hover:bg-gray-800/30 dark:hover:bg-gray-800/70 rounded-lg"
        >
          <Download className="text-cyan-400 size-12" />
          <span className="text-base">Backup</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center gap-3 h-full bg-gray-800/20 dark:bg-gray-800/50 hover:bg-gray-800/30 dark:hover:bg-gray-800/70 rounded-lg"
          onClick={() => router.push("/settings")}
        >
          <Settings className="text-cyan-400 size-12" />
          <span className="text-base">Settings</span>
        </Button>
      </div>
    </div>
  );
}
