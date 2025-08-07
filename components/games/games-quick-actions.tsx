import { FileText, Play, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GamesQuickActionsProps {
  router: any;
}

export function GamesQuickActions({ router }: GamesQuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 md:grid-cols-4">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => router.push("/new")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Create Document
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => router.push("/playground")}
          >
            <Play className="mr-2 h-4 w-4" />
            Open Playground
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => router.push("/notes")}
          >
            <FileText className="mr-2 h-4 w-4" />
            View Notes
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => router.push("/teams")}
          >
            <Users className="mr-2 h-4 w-4" />
            Manage Teams
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
