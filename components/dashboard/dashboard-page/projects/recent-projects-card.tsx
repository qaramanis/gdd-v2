import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { DashboardData } from "../dashboard-page";
import NotesTabContent from "../notes/notes-tab-content";
import GamesTabContent from "../games/games-tab-content";
import DocumentsTabContent from "../documents-tab-content";

export default function RecentProjectsCard({ data }: { data: DashboardData }) {
  const { games, documents, notes } = data;

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
        <CardDescription>Your most recently viewed projects</CardDescription>
      </CardHeader>
      <CardContent>
        <GamesTabContent games={games} />
      </CardContent>
    </Card>
  );
}
