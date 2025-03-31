import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyNotesStateProps {
  onClearFilters: () => void;
}

export function EmptyNotesState({ onClearFilters }: EmptyNotesStateProps) {
  return (
    <div className="flex flex-col w-fit self-center items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
        No notes found
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
        Try adjusting your search filters
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
        or create a new note
      </p>
      <Button variant="outline" onClick={onClearFilters}>
        Clear filters
      </Button>
    </div>
  );
}
