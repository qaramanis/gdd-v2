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

  // Get the sections that are included in the document
  const includedSections = (game.game_sections || [])
    .filter((s: any) => s.is_included)
    .sort((a: any, b: any) => a.section_order - b.section_order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Game Design Document</h2>
        </div>

        <div className="flex gap-2">
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
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Display sections */}
        {includedSections.map((section: any) => (
          <Card
            key={section.section_id}
            className="hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center text-lg">
                <span>{section.section.name}</span>
                {viewMode === "edit" && (
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <PenLine className="size-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {section.section.description || "No description provided"}
              </p>
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary hover:text-primary"
                >
                  {viewMode === "edit" ? "Edit Section" : "View Section"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add section card (only in edit mode) */}
        {viewMode === "edit" && (
          <Card className="border-dashed hover:shadow-md hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center">
            <CardContent className="py-8 flex flex-col items-center gap-2">
              <div className="p-3 rounded-full bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <p className="font-medium">Add New Section</p>
              <p className="text-xs text-muted-foreground text-center max-w-48">
                Create a custom section for your game design document
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Document content preview */}
      <Card className="mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="size-5" />
            Document Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <h1>{game.name}</h1>
            <p className="lead">{game.concept}</p>

            {includedSections.map((section: any) => (
              <div key={section.section_id} className="mb-4">
                <h2>{section.section.name}</h2>
                <p className="text-muted-foreground italic">
                  {section.section.description}
                </p>
                <p>Content for this section will be displayed here.</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
