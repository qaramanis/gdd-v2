import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyNotesStateProps {
  onClearFilters: () => void;
}

export function EmptyNotesState({ onClearFilters }: EmptyNotesStateProps) {
  return (
    <div className="flex flex-col w-fit self-center items-center justify-center p-8 bg-white border shadow-xl rounded-lg">
      <p className="text-lg font-medium text-foreground">No notes found</p>
      <p className="text-sm text-accent mt-2">
        Try adjusting your search filters
      </p>
      <p className="text-sm text-accent mb-4">or create a new note</p>
      <Button variant="outline" onClick={onClearFilters}>
        Clear filters
      </Button>
    </div>
  );
}
