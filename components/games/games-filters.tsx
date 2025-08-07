import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  viewMode: string;
  setViewMode: (mode: string) => void;
  onNewGame: () => void;
}

export function GamesFilters({
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  onNewGame,
}: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
          <Input
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex gap-1">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            List
          </Button>
        </div>
        <Button className="gap-2" onClick={onNewGame}>
          <Plus className="h-4 w-4" />
          New Game
        </Button>
      </div>
    </div>
  );
}
