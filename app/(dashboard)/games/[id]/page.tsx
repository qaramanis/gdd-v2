"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/database/supabase";
import { useUser } from "@/providers/user-context";
import GameDetailView from "@/components/games/game-detail-view";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface Game {
  id: number;
  name: string;
  concept: string;
  image_url: string;
  platforms: string[];
  sections: string[];
  start_date: string;
  timeline: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface Document {
  id: string;
  game_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

interface DocumentSection {
  id: string;
  document_id: string;
  title: string;
  content: string;
  order: number;
}

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const { userId, loading: userLoading } = useUser();
  const [game, setGame] = useState<Game | null>(null);
  const [document, setDocument] = useState<Document | null>(null);
  const [sections, setSections] = useState<DocumentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && userId) {
      fetchGameData();
    } else if (!userLoading && !userId) {
      setLoading(false);
      setError("Please sign in to view this game");
    }
  }, [params.id, userId, userLoading]);

  const fetchGameData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch game details
      const { data: gameData, error: gameError } = await supabase
        .from("games")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", userId)
        .single();

      if (gameError) {
        if (gameError.code === "PGRST116") {
          setError("Game not found or you don't have access to it");
        } else {
          throw gameError;
        }
        return;
      }

      setGame(gameData);

      // Fetch document
      const { data: documentData, error: documentError } = await supabase
        .from("documents")
        .select("*")
        .eq("game_id", params.id)
        .single();

      if (documentData) {
        setDocument(documentData);

        // Fetch document sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from("document_sections")
          .select("*")
          .eq("document_id", documentData.id)
          .order("order", { ascending: true });

        if (sectionsError) {
          console.error("Error fetching sections:", sectionsError);
        } else {
          setSections(sectionsData || []);
        }
      }
    } catch (err: any) {
      console.error("Error fetching game data:", err);
      setError(err.message || "Failed to load game data");
    } finally {
      setLoading(false);
    }
  };

  if (loading || userLoading) {
    return <GameDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg mb-4">{error}</p>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/games")}>Back to Games</Button>
          {error.includes("sign in") && (
            <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
          )}
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg mb-4">Game not found</p>
        <Button onClick={() => router.push("/games")}>Back to Games</Button>
      </div>
    );
  }

  return <GameDetailView game={game} document={document} sections={sections} />;
}

function GameDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-96" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-64" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-64" />
        </div>
      </div>
    </div>
  );
}
