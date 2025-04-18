import { Button } from "@/components/ui/button";

export default function RecentActivity() {
  return (
    <div className="bg-primary/5 p-4 rounded-lg md:w-full dark:bg-gray-900/60">
      <h2 className="text-xl font-bold mb-2">Recent Activity</h2>
      <div className="space-y-2">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-md flex justify-between items-center">
          <div>
            <p className="font-medium">Elden Ring</p>
            <p className="text-sm text-gray-500">Updated 2 hours ago</p>
          </div>
          <Button variant="ghost" size="sm">
            Open
          </Button>
        </div>
        <div className="p-2 bg-white dark:bg-gray-800 rounded-md flex justify-between items-center">
          <div>
            <p className="font-medium">Horizon Forbidden West</p>
            <p className="text-sm text-gray-500">Updated yesterday</p>
          </div>
          <Button variant="ghost" size="sm">
            Open
          </Button>
        </div>
      </div>
    </div>
  );
}
