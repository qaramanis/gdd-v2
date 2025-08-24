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
        <CardDescription>Your latest games and documents</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="games" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="games">
            <GamesTabContent games={games} />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsTabContent documents={documents} />
          </TabsContent>

          <TabsContent value="notes">
            <NotesTabContent notes={notes} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
