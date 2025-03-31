// components/dashboard/view-all/view-all.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TiltedCard from "@/components/tilted-card";
import { supabase } from "@/database/supabase";
import { Skeleton } from "@/components/ui/skeleton";

interface Game {
  id: number;
  name: string;
  image_url: string;
}

export default function ViewAll() {
  const [games, setGames] = useState<Game[]>([]);
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

        setGames(games || []);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="flex flex-col">
              <Skeleton className="w-full h-64 rounded-lg" />
              <Skeleton className="w-3/4 h-6 mt-3 rounded-md" />
              <Skeleton className="w-1/2 h-4 mt-2 rounded-md" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      ) : games.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">
            No games found. Add some games to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 select-none">
          {games.map((game) => (
            <TiltedCard
              key={game.id}
              imageSrc={game.image_url}
              altText={game.name}
              captionText={game.name}
              showTooltip={true}
              scaleOnHover={1}
              containerWidth="auto"
              imageWidth="100%"
              displayOverlayContent={true}
              overlayContent={game.name}
              showMobileWarning={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
