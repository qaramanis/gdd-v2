// components/notes/notes-search.tsx
import React from "react";
import { Filter, GamepadIcon, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotesSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedGame: string | null;
  setSelectedGame: (game: string | null) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  allGames: string[];
  allTags: string[];
}

export function NotesSearch({
  searchTerm,
  setSearchTerm,
  selectedGame,
  setSelectedGame,
  selectedTag,
  setSelectedTag,
  allGames,
  allTags,
}: NotesSearchProps) {
  const activeFiltersCount = (selectedGame ? 1 : 0) + (selectedTag ? 1 : 0);

  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
        <Input
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-white/80"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => setSearchTerm("")}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      <FiltersDropdown
        selectedGame={selectedGame}
        setSelectedGame={setSelectedGame}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        allGames={allGames}
        allTags={allTags}
        activeFiltersCount={activeFiltersCount}
      />
    </div>
  );
}

interface FiltersDropdownProps {
  selectedGame: string | null;
  setSelectedGame: (game: string | null) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  allGames: string[];
  allTags: string[];
  activeFiltersCount: number;
}

function FiltersDropdown({
  selectedGame,
  setSelectedGame,
  selectedTag,
  setSelectedTag,
  allGames,
  allTags,
  activeFiltersCount,
}: FiltersDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 gap-2">
          <Filter className="size-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-1 size-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filter By Game</DropdownMenuLabel>
        {allGames.length > 0 ? (
          allGames.map((game) => (
            <DropdownMenuItem
              key={`game-${game}`}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() =>
                setSelectedGame(selectedGame === game ? null : game)
              }
            >
              <GamepadIcon className="size-4" />
              {game}
              {selectedGame === game && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No games available</DropdownMenuItem>
        )}

        {allTags.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Filter By Tag</DropdownMenuLabel>
            {allTags.map((tag) => (
              <DropdownMenuItem
                key={`tag-${tag}`}
                className="cursor-pointer"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                #{tag}
                {selectedTag === tag && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            ))}
          </>
        )}

        {(selectedGame || selectedTag) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-500 cursor-pointer"
              onClick={() => {
                setSelectedGame(null);
                setSelectedTag(null);
              }}
            >
              Clear All Filters
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
