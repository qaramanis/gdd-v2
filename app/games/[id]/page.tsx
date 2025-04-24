"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameHeader from "@/components/games/game-header";
import GameDocument from "@/components/games/game-document";
import GameStoryPoints from "@/components/games/game-notes";
import GameTeam from "@/components/games/game-team";
import GameScenes from "@/components/games/game-scenes";
import { supabase } from "@/database/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [game, setGame] = useState<any>(null);
  const [document, setDocument] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!params.id) {
          throw new Error("Game ID is missing");
        }

        setLoading(true);

        // Fetch game data
        const { data: gameData, error: gameError } = await supabase
          .from("games")
          .select("*")
          .eq("id", params.id)
          .single();

        if (gameError) throw gameError;
        if (!gameData) throw new Error("Game not found");

        setGame(gameData);

        // Fetch document data
        const { data: documentData, error: documentError } = await supabase
          .from("documents")
          .select("*")
          .eq("game_id", params.id)
          .single();

        if (!documentError && documentData) {
          setDocument(documentData);

          // Fetch sections data
          const { data: sectionsData, error: sectionsError } = await supabase
            .from("document_sections")
            .select("*")
            .eq("document_id", documentData.id)
            .order("order", { ascending: true });

          if (!sectionsError) {
            setSections(sectionsData || []);
          }
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  if (loading) {
    return <GamePageSkeleton />;
  }

  if (error || !game) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Game</h2>
        <p className="text-muted-foreground mb-4">
          {error || "Game not found"}
        </p>
        <button
          onClick={() => router.push("/home")}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 pt-0">
      <GameHeader game={game} />

      <Tabs defaultValue="document" className="w-full">
        <TabsList className="border-b p-1 w-full md:w-1/2 justify-start gap-6 bg-white dark:bg-gray-800">
          <TabsTrigger value="document">Document</TabsTrigger>
          <TabsTrigger value="story-points">Notes</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="scenes">Scenes</TabsTrigger>
        </TabsList>

        <TabsContent value="document" className="mt-0">
          <GameDocument game={game} document={document} sections={sections} />
        </TabsContent>

        <TabsContent value="story-points" className="mt-0">
          <GameStoryPoints game={game.id} />
        </TabsContent>

        <TabsContent value="team" className="mt-0">
          <GameTeam gameId={game.id} team={game.game_users || []} />
        </TabsContent>

        <TabsContent value="scenes" className="mt-0">
          <GameScenes gameId={game.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GamePageSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-4 pt-0">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-1/3" />
        <div className="flex gap-4">
          <Skeleton className="h-24 w-24 rounded-lg" />
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>

      <div className="flex gap-4 border-b pb-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}
