import { GameCard } from "./game-card";

interface GamesListProps {
  games: any[];
  viewMode: string;
  getTimeAgo: (date: string) => string;
  onView: (gameId: number) => void;
  onEdit: (gameId: number) => void;
}

export function GamesList({
  games,
  viewMode,
  getTimeAgo,
  onView,
  onEdit,
}: GamesListProps) {
  return (
    <div
      className={
        viewMode === "grid"
          ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          : "space-y-4"
      }
    >
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          viewMode={viewMode}
          getTimeAgo={getTimeAgo}
          onView={() => onView(game.id)}
          onEdit={() => onEdit(game.id)}
        />
      ))}
    </div>
  );
}
