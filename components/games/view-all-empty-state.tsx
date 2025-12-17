import { Gamepad2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ViewAllEmptyState() {
  return (
    <div className="flex flex-col w-fit self-center items-center justify-center p-8 bg-white border shadow-xl rounded-lg">
      <Gamepad2 className="h-12 w-12 text-accent mb-4" />
      <p className="text-lg font-medium text-foreground">No games found</p>
      <p className="text-sm text-accent mt-2">
        You haven&apos;t created any games yet.
      </p>
      <p className="text-sm text-accent mb-4">
        Start by creating your first game project.
      </p>
      <Link href="/new-game">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create New Game
        </Button>
      </Link>
    </div>
  );
}
