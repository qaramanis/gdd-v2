"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/database/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PenLine } from "lucide-react";

export default function SectionPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [game, setGame] = useState<any>(null);
  const [document, setDocument] = useState<any>(null);
  const [section, setSection] = useState<any>(null);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        if (!params.id || !params.sectionId) {
          throw new Error("Required parameters are missing");
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

        if (documentError) throw documentError;
        if (!documentData) throw new Error("Document not found");

        setDocument(documentData);

        // Fetch section data
        const { data: sectionData, error: sectionError } = await supabase
          .from("document_sections")
          .select("*")
          .eq("document_id", documentData.id)
          .eq("id", params.sectionId)
          .single();

        if (sectionError) throw sectionError;
        if (!sectionData) throw new Error("Section not found");

        setSection(sectionData);
        setContent(sectionData.content || "");
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id, params.sectionId]);

  const handleBackNavigation = () => {
    router.back();
  };

  const handleEditSection = () => {
    router.push(`/games/${params.id}/document/section/${params.sectionId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error || !game || !document || !section) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold mb-2">Error Loading Section</h2>
        <p className="text-muted-foreground mb-4">
          {error || "Data not found"}
        </p>
        <button
          onClick={() => router.push(`/games/${params.id}`)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
        >
          Back to Game
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackNavigation}
            className="gap-1"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{game.name}</h1>
            <p className="text-sm text-muted-foreground">{section.title}</p>
          </div>
        </div>

        <Button onClick={handleEditSection} size="sm" className="gap-1">
          <PenLine className="size-4" />
          Edit
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 max-w-6xl mx-auto rounded-lg shadow p-6 min-h-screen">
          {content ? (
            <div
              className="quill-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-muted-foreground text-center py-8">
              This section has no content yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
