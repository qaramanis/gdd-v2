"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import TiltedCard from "@/components/tilted-card";
import { useRouter } from "next/navigation";
import QuickActions from "./quick-actions";
import RecentActivity from "./recent-activity";
import { Component as PieChart } from "@/components/charts/pie-chart";
import { Component as BarChart } from "@/components/charts/bar-chart-mixed";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/database/supabase";
import Notes from "./notes";

interface Game {
  id: number;
  name: string;
  image_url: string;
}

export default function Home() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);

        let { data: games, error } = await supabase
          .from("games")
          .select("*")
          .limit(6);

        if (error) {
          throw error;
        }

        setGames(games || []);
        console.log(games);
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
    <div className="flex flex-col gap-6 p-4 pt-0">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Games</h2>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-full dark:hover:bg-sky-600/80"
              onClick={() => router.push("/games")}
            >
              View All <ArrowRightIcon className="size-4" />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 select-none">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex flex-col">
                  <Skeleton className="w-full h-48 rounded-lg" />
                  <Skeleton className="w-2/3 h-5 mt-3 rounded-md" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-lg text-red-500">{error}</p>
            </div>
          ) : games.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-lg">
                No games found. Add some games to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 select-none">
              {games.map((game) => (
                <div
                  key={game.id}
                  onClick={() => router.push(`/games/${game.id}`)}
                  className="cursor-pointer"
                >
                  <TiltedCard
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* <Separator className="bg-black/20 dark:bg-white/20" /> */}
      <Separator className="bg-primary/10 dark:bg-gray-400/20 m-2" />
      {loading ? (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-auto md:flex-1 flex flex-col gap-6">
            {/* Recent Activity skeleton */}
            <div className="bg-primary/5 p-4 rounded-lg md:w-full">
              <Skeleton className="w-40 h-7 mb-4" />
              <div className="space-y-2">
                <Skeleton className="w-full h-16 rounded-md" />
                <Skeleton className="w-full h-16 rounded-md" />
              </div>
            </div>

            {/* Charts skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="w-full h-64 rounded-lg" />
              <Skeleton className="w-full h-64 rounded-lg" />
            </div>
          </div>

          {/* Quick Actions skeleton */}
          <Skeleton className="bg-primary/5 p-6 rounded-lg md:w-128 md:h-128 md:flex-shrink-0" />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-auto md:flex-1 flex flex-col gap-6">
            <RecentActivity />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PieChart />
              <BarChart />
            </div>
          </div>
          <div className="flex flex-col gap-6 ">
            <QuickActions />
            <Notes />
          </div>
        </div>
      )}
    </div>
  );
}
