// components/dashboard/view-all/view-all.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TiltedCard from "@/components/tilted-card";
import { supabase } from "@/database/supabase";

interface Game {
  id: number;
  name: string;
  image_url: string;
}

export default function ViewAll() {
  const [documents, setDocuments] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);

        let { data: games, error } = await supabase.from("games").select("*");

        if (error) {
          throw error;
        }

        setDocuments(games || []);
      } catch (err) {
        console.error("Error fetching games:", err);
        setError("Failed to load games. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Documents</h1>
        <Button
          variant="ghost"
          className={cn(
            "w-auto rounded-full justify-between m-2 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center transition-all cursor-pointer",
            "bg-black hover:bg-black/80",
            "dark:bg-white dark:hover:bg-white text-white",
            "[&>svg]:text-white dark:[&>svg]:text-black"
          )}
        >
          <Plus className="size-4" />
          <span className="flex text-white dark:text-black items-center group-data-[collapsible=icon]:hidden">
            <span>New Document</span>
          </span>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading games...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">
            No games found. Add some games to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 select-none">
          {documents.map((doc) => (
            <TiltedCard
              key={doc.id}
              imageSrc={doc.image_url}
              altText={doc.name}
              captionText={doc.name}
              showTooltip={true}
              scaleOnHover={1}
              containerWidth="auto"
              imageWidth="100%"
              displayOverlayContent={true}
              overlayContent={doc.name}
              showMobileWarning={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
