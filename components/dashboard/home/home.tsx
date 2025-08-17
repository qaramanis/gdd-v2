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
import { supabase } from "@/database/supabase";
import Notes from "./notes";
import { useUser } from "@/providers/user-context";

interface Game {
  id: number;
  name: string;
  image_url: string;
  user_id: string;
}

export default function Home() {
  const router = useRouter();
  const { userId, loading: userLoading } = useUser();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGames() {
      if (!userId || userLoading) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Only fetch games for the authenticated user
        const { data: games, error } = await supabase
          .from("games")
          .select(
            `
            *,
            documents (
              id,
              title
            )
          `,
          )
          .eq("user_id", userId)
          .order("updated_at", { ascending: false })
          .limit(6);

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
  }, [userId, userLoading]);
  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Skeleton className="w-32 h-8" />
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg mb-4">Please sign in to view your games</p>
        <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
      </div>
    );
  }

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
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-lg mb-4">
                No games found. Create your first game to get started!
              </p>
              <Button onClick={() => router.push("/new")}>
                Create New Game
              </Button>
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
      {loading ? (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-auto md:flex-1 flex flex-col gap-6">
            <div className="bg-primary/5 p-4 rounded-lg md:w-full">
              <Skeleton className="w-40 h-7 mb-4" />
              <div className="space-y-2">
                <Skeleton className="w-full h-16 rounded-md" />
                <Skeleton className="w-full h-16 rounded-md" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="w-full h-64 rounded-lg" />
              <Skeleton className="w-full h-64 rounded-lg" />
            </div>
          </div>
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
