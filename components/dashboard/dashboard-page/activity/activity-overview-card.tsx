import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Gamepad2, FileText, Users, StickyNote, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import ActivityItem from "./activity-item";
import { DashboardData, ActivityLog } from "./dashboard-page";
import { Button } from "@/components/ui/button";

export default function ActivityOverviewCard({
  data,
}: {
  data: DashboardData;
}) {
  const router = useRouter();
  const { activities, documentSections } = data;

  const getActivityIcon = (entityType: string) => {
    switch (entityType) {
      case "game":
        return Gamepad2;
      case "document":
        return FileText;
      case "team":
        return Users;
      case "note":
        return StickyNote;
      default:
        return Activity;
    }
  };

  const formatActivityAction = (activity: ActivityLog) => {
    const entityType = activity.entity_type || "item";
    const action = activity.action || "updated";
    return `${action.charAt(0).toUpperCase() + action.slice(1)} ${entityType}`;
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
        <CardDescription>Recent changes and updates</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => (
                <ActivityItem
                  key={activity.id}
                  icon={getActivityIcon(activity.entity_type)}
                  action={formatActivityAction(activity)}
                  time={formatDistanceToNow(new Date(activity.created_at), {
                    addSuffix: true,
                  })}
                />
              ))}
            </div>
            {activities.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => router.push("/activity")}
              >
                View all activity
              </Button>
            )}
          </div>
        ) : documentSections.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm font-medium mb-2">Recent Document Sections</p>
            {documentSections.slice(0, 5).map((section) => (
              <ActivityItem
                key={section.id}
                icon={FileText}
                action={section.title}
                time={formatDistanceToNow(new Date(section.updated_at), {
                  addSuffix: true,
                })}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
            <p className="text-xs mt-1">Your activity will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
