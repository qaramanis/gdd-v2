// components/notes/active-filters.tsx
import React from "react";
import { GamepadIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActiveFiltersProps {
  selectedGame: string | null;
  selectedTag: string | null;
  setSelectedGame: (game: string | null) => void;
  setSelectedTag: (tag: string | null) => void;
}

export function ActiveFilters({
  selectedGame,
  selectedTag,
  setSelectedGame,
  setSelectedTag,
}: ActiveFiltersProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-sm text-gray-500">Active filters:</span>
      {selectedGame && (
        <Button
          variant="secondary"
          size="sm"
          className="h-7 gap-1.5 text-xs cursor-pointer"
          onClick={() => setSelectedGame(null)}
        >
          <GamepadIcon className="size-3" />
          {selectedGame}
          <X className="size-3" />
        </Button>
      )}
      {selectedTag && (
        <Button
          variant="secondary"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={() => setSelectedTag(null)}
        >
          #{selectedTag}
          <X className="size-3" />
        </Button>
      )}
    </div>
  );
}
