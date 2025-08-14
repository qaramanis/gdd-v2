import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

export default function RecentActivity() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest updates and changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            {
              action: "Updated",
              item: "Character Controller Scene",
              time: "2 hours ago",
            },
            {
              action: "Created",
              item: "New Game Design Document",
              time: "5 hours ago",
            },
            { action: "Shared", item: "Level Design Notes", time: "Yesterday" },
            {
              action: "Modified",
              item: "Unity Scene - Main Menu",
              time: "2 days ago",
            },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 bg-primary rounded-full" />
                <div>
                  <p className="text-sm font-medium">
                    {activity.action}{" "}
                    <span className="text-muted-foreground">
                      {activity.item}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
