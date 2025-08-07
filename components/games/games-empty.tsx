import { Gamepad2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GamesEmptyProps {
  searchTerm: string;
  onNewGame: () => void;
}

export function GamesEmpty({ searchTerm, onNewGame }: GamesEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-muted/50 rounded-lg">
      <Gamepad2 className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-lg font-medium mb-2">
        {searchTerm ? "No games found" : "No games yet"}
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        {searchTerm
          ? "Try adjusting your search"
          : "Create your first game to get started"}
      </p>
      {!searchTerm && (
        <Button onClick={onNewGame} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Game
        </Button>
      )}
    </div>
  );
}
