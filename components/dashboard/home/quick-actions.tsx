import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FileText, NotebookPen, Play, Users } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  // const handleSecurityScan = () => {
  //   // TODO: Implement security scan functionality
  //   console.log("Security scan initiated");
  // };

  // const handleSyncData = () => {
  //   // TODO: Implement data sync functionality
  //   console.log("Data sync initiated");
  // };

  // const handleBackup = () => {
  //   // TODO: Implement backup functionality
  //   console.log("Backup initiated");
  // };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          className="w-full justify-start"
          variant="outline"
          onClick={() => router.push("/new-game")}
        >
          <FileText className="mr-2 h-4 w-4" />
          Create New Document
        </Button>
        <Button
          className="w-full justify-start"
          variant="outline"
          onClick={() => router.push("/playground")}
        >
          <Play className="mr-2 h-4 w-4" />
          Open Playground
        </Button>
        <Button
          className="w-full justify-start"
          variant="outline"
          onClick={() => router.push("/notes")}
        >
          <NotebookPen className="mr-2 h-4 w-4" />
          View All Notes
        </Button>
        <Button
          className="w-full justify-start"
          variant="outline"
          onClick={() => router.push("/teams")}
        >
          <Users className="mr-2 h-4 w-4" />
          Manage Teams
        </Button>
      </CardContent>
    </Card>
  );
}
