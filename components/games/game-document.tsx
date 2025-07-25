"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, PenLine, Download, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";

interface GameDocumentProps {
  game: any;
  document: any;
  sections: any[];
}

export default function GameDocument({
  game,
  document,
  sections,
}: GameDocumentProps) {
  const [viewMode] = useState<"view" | "edit">("view");
  const router = useRouter();

  const handleOpenFullEditor = (sectionId?: string) => {
    if (!document) return;

    const route = sectionId
      ? `/games/${game.id}/document`
      : `/games/${game.id}/document`;

    router.push(route);
  };

  const includedSections = (game.game_sections || [])
    .filter((s: any) => s.is_included)
    .sort((a: any, b: any) => a.section_order - b.section_order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Game Design Document</h2>
        </div>

        <div className="flex gap-2"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

      <Card className="mt-8 bg-white dark:bg-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <FileText className="size-5" />
              <p className="text-xl">Document Section Preview</p>
            </div>
            <div>
              {document && (
                <Button
                  variant="outline"
                  size="sm"
                  className="m-1"
                  onClick={() => handleOpenFullEditor()}
                >
                  View Full Document
                </Button>
              )}
              <Button variant="default" size="sm" className="m-1">
                Export
                <Download className="ml-2 size-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          {sections.length > 0 ? (
            sections.map((section) => (
              <div key={section.id} className="mb-6">
                <div className="flex  flex-row items-center gap-6 my-2">
                  <h3 className="text-lg font-semibold ">{section.title}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary/50 mt-1"
                    onClick={() => router.push(`/games/${game.id}/document/`)}
                  >
                    View in editor
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {section.content ? (
                  <>
                    <div className="text-sm text-muted-foreground my-2">
                      {(() => {
                        try {
                          const contentObj = JSON.parse(section.content);

                          let extractedText = "";
                          if (contentObj?.root?.children) {
                            contentObj.root.children.forEach(
                              (paragraph: { children: any[] }) => {
                                if (paragraph?.children) {
                                  paragraph.children.forEach((textNode) => {
                                    if (textNode?.text) {
                                      extractedText += textNode.text + " ";
                                    }
                                  });
                                  extractedText += "\n";
                                }
                              }
                            );
                          }

                          return (
                            extractedText.substring(0, 150) +
                            (extractedText.length > 150 ? "..." : "")
                          );
                        } catch (e) {
                          console.error("Error parsing content JSON:", e);
                          return "Error displaying content";
                        }
                      })()}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No content available yet.
                  </p>
                )}
                <Separator className="mt-4" />
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No sections have been added to this document yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
