"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, PenLine, BookOpen, Download } from "lucide-react";
import { useState } from "react";

interface GameDocumentProps {
  game: any;
}

export default function GameDocument({ game }: GameDocumentProps) {
  const [viewMode, setViewMode] = useState<"view" | "edit">("view");

  const includedSections = (game.game_sections || [])
    .filter((s: any) => s.is_included)
    .sort((a: any, b: any) => a.section_order - b.section_order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Game Design Document</h2>
        </div>

        {/* <div className="flex gap-2">
          <Button
            variant={viewMode === "view" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("view")}
            className="gap-2"
          >
            <BookOpen className="size-4" />
            View
          </Button>
          <Button
            variant={viewMode === "edit" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("edit")}
            className="gap-2"
          >
            <PenLine className="size-4" />
            Edit
          </Button>
        </div> */}
      </div>

      {/* Document content preview */}
      <Card className="mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="size-5" />
            Notes
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
