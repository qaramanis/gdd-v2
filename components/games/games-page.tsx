"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/database/supabase";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/user-context";
import { formatDate } from "@/lib/date-utils";
import { GamesHeader } from "./games-header";
import { GamesStats } from "./games-stats";
import { GamesFilters } from "./games-filters";
import { GamesList } from "./games-list";
import { GamesQuickActions } from "./games-quick-actions";
import { GamesEmpty } from "./games-empty";
import { GamesPagination } from "./games-pagination";

// Define the type for a single game object
interface Game {
  id: string;
  name: string;
  concept: string;
  updated_at: string;
  documents: { id: string; title: string }[];
}

export default function GamesPage() {
  const router = useRouter();
  const { userId, loading: userLoading } = useUser();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const gamesPerPage = 3;
  const [stats, setStats] = useState({
    totalGames: 0,
    totalDocuments: 0,
    totalNotes: 0,
    recentGames: 0,
  });

  useEffect(() => {
    if (!userLoading && userId) {
      fetchGamesAndStats();
    } else if (!userLoading && !userId) {
      setLoading(false);
    }
  }, [userId, userLoading]);

  const fetchGamesAndStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch games
      const { data: gamesData, error: gamesError } = await supabase
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
        .order("updated_at", { ascending: false });

      if (gamesError) throw gamesError;

      // Fetch notes count
      const { count: notesCount, error: notesError } = await supabase
        .from("notes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (notesError) throw notesError;

      // Fetch documents count
      const { count: docsCount, error: docsError } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .in("game_id", gamesData?.map((g) => g.id) || []);

      if (docsError) throw docsError;

      // Calculate stats
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 7);
      const recentGames =
        gamesData?.filter((game) => new Date(game.updated_at) > recentDate)
          .length || 0;

      setGames(gamesData || []);
      setStats({
        totalGames: gamesData?.length || 0,
        totalDocuments: docsCount || 0,
        totalNotes: notesCount || 0,
        recentGames: recentGames,
      });
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (game.concept &&
        game.concept.toLowerCase().includes(searchTerm.toLowerCase()));

    // Since we don't have a status field in the database, we'll use this logic:
    // "all" shows everything
    // For now, other filters won't work until you add a status field
    const matchesStatus = filterStatus === "all";

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
  const startIndex = (currentPage - 1) * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  const displayedGames = showAll
    ? filteredGames
    : filteredGames.slice(startIndex, endIndex);

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Add type annotation for the 'date' parameter
  const getTimeAgo = (date: string) => {
    const now = new Date();
    const updated = new Date(date);
    const diffMs = now.getTime() - updated.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(date);
  };

  if (userLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-264" />
          ))}
        </div>
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
    <div className="space-y-8">
      <GamesHeader />
      <GamesStats stats={stats} />

      <GamesFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onNewGame={() => router.push("/new-game")}
      />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Your Games</h2>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {showAll
                ? `Showing all ${filteredGames.length} games`
                : `Showing ${Math.min(displayedGames.length, gamesPerPage)} of ${filteredGames.length} games`}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowAll(!showAll);
                setCurrentPage(1);
              }}
              className="gap-2"
            >
              {showAll ? "Show Pages" : "View All"}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-lg text-red-500 mb-4">{error}</p>
            <Button onClick={fetchGamesAndStats}>Try Again</Button>
          </div>
        ) : filteredGames.length === 0 ? (
          <GamesEmpty
            searchTerm={searchTerm}
            onNewGame={() => router.push("/new-game")}
          />
        ) : (
          <>
            <GamesList
              games={displayedGames}
              viewMode={viewMode}
              getTimeAgo={getTimeAgo}
              onView={(gameId) => router.push(`/games/${gameId}`)}
              onEdit={(gameId) => router.push(`/games/${gameId}/edit`)}
            />

            {!showAll && totalPages > 1 && (
              <GamesPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>

      <GamesQuickActions router={router} />
    </div>
  );
}
