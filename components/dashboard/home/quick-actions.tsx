import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Shield, Terminal } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="bg-primary/5 p-6 rounded-lg md:w-2/5 dark:bg-gray-900/60">
      <h2 className="text-xl font-bold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-2 h-auto py-6 bg-gray-800/20 dark:bg-gray-800/50 hover:bg-gray-800/30 dark:hover:bg-gray-800/70 rounded-lg"
        >
          <Shield className="text-cyan-400 size-6" />
          <span>Security Scan</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-2 h-auto py-6 bg-gray-800/20 dark:bg-gray-800/50 hover:bg-gray-800/30 dark:hover:bg-gray-800/70 rounded-lg"
        >
          <RefreshCw className="text-cyan-400 size-6" />
          <span>Sync Data</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-2 h-auto py-6 bg-gray-800/20 dark:bg-gray-800/50 hover:bg-gray-800/30 dark:hover:bg-gray-800/70 rounded-lg"
        >
          <Download className="text-cyan-400 size-6" />
          <span>Backup</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center gap-2 h-auto py-6 bg-gray-800/20 dark:bg-gray-800/50 hover:bg-gray-800/30 dark:hover:bg-gray-800/70 rounded-lg"
        >
          <Terminal className="text-cyan-400 size-6" />
          <span>Console</span>
        </Button>
      </div>
    </div>
  );
}
