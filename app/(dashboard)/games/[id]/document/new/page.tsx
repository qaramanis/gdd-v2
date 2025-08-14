"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/database/supabase";
import { useUser } from "@/providers/user-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import CreateDocumentForm from "@/components/document/create-new-document-form";

interface Game {
  id: number;
  name: string;
  concept: string;
}

export default function NewDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const { userId, loading: userLoading } = useUser();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (!userLoading && userId) {
      fetchGameData();
    } else if (!userLoading && !userId) {
      setLoading(false);
      setError("Please sign in to create a document");
    }
  }, [params.id, userId, userLoading]);

  const fetchGameData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch game details to verify ownership and get game info
      const { data: gameData, error: gameError } = await supabase
        .from("games")
        .select("id, name, concept")
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

      // Check if document already exists
      const { data: existingDoc } = await supabase
        .from("documents")
        .select("id")
        .eq("game_id", params.id)
        .single();

      if (existingDoc) {
        // Document already exists, redirect to it
        router.push(`/games/${params.id}/document`);
        return;
      }

      setGame(gameData);
    } catch (err: any) {
      console.error("Error fetching game data:", err);
      setError(err.message || "Failed to load game data");
    } finally {
      setLoading(false);
    }
  };

  if (loading || userLoading) {
    return <CreateDocumentSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg mb-4">{error}</p>
        <div className="flex gap-2">
          <Button onClick={() => router.push(`/games/${params.id}`)}>
            Back to Game
          </Button>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/games/${game.id}`)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {game.name}
        </Button>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold">Create Game Design Document</h1>
        <p className="text-muted-foreground mt-2">
          Set up your game design document for {game.name}
        </p>
      </div>

      {/* Form */}
      <CreateDocumentForm game={game} />
    </div>
  );
}

function CreateDocumentSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-32" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-6 w-64" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}
