"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Plus,
  PenLine,
  BookOpen,
  Download,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/database/supabase";

interface DocumentSection {
  id: string;
  document_id: string;
  title: string;
  order: number;
  content?: string;
}

interface GameDocumentProps {
  game: any;
}

export default function GameDocument({ game }: GameDocumentProps) {
  const [viewMode, setViewMode] = useState<"view" | "edit">("view");
  const [document, setDocument] = useState<any>(null);
  const [sections, setSections] = useState<DocumentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchDocument() {
      try {
        setLoading(true);
        // Fetch the document for this game
        const { data: documentData, error: documentError } = await supabase
          .from("documents")
          .select("*")
          .eq("game_id", game.id)
          .single();

        if (documentError) throw documentError;

        setDocument(documentData);

        // Fetch the document sections
        if (documentData) {
          const { data: sectionsData, error: sectionsError } = await supabase
            .from("document_sections")
            .select("*")
            .eq("document_id", documentData.id)
            .order("order", { ascending: true });

          if (sectionsError) throw sectionsError;

          setSections(sectionsData || []);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    }

    if (game && game.id) {
      fetchDocument();
    }
  }, [game]);

  const handleOpenFullEditor = (sectionId?: string) => {
    if (!document) return;

    // Navigate to the full editor page
    const route = sectionId
      ? `/games/${game.id}/document/section/${sectionId}`
      : `/games/${game.id}/document`;

    router.push(route);
  };

  const handleOpenSectionPreview = (section: DocumentSection) => {
    router.push(`/games/${game.id}/document/preview/${section.id}`);
  };

  const handleAddSection = async () => {
    if (!document) return;

    try {
      // Calculate the next order value
      const nextOrder =
        sections.length > 0 ? Math.max(...sections.map((s) => s.order)) + 1 : 0;

      // Create a new section
      const { data, error } = await supabase
        .from("document_sections")
        .insert({
          document_id: document.id,
          title: "New Section",
          order: nextOrder,
          content: "",
        })
        .select()
        .single();

      if (error) throw error;

      // Add the new section to our state
      setSections([...sections, data]);
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  if (loading) {
    return <div>Loading document...</div>;
  }

  if (!document) {
    return (
      <div className="space-y-6">
        <p>No document found for this game.</p>
        <Button
          onClick={() => router.push(`/games/${game.id}/document/create`)}
        >
          Create Document
        </Button>
      </div>
    );
  }

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
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => handleOpenFullEditor()}
          >
            <FileText className="size-4" />
            Open Full Editor
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Card key={section.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center text-lg">
                <span>{section.title}</span>
                {viewMode === "edit" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => handleOpenFullEditor(section.id)}
                  >
                    <PenLine className="size-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {section.content ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: section.content.substring(0, 150) + "...",
                    }}
                  />
                ) : (
                  "No content yet"
                )}
              </p>
              <div className="flex justify-end mt-4">
                {viewMode === "edit" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary hover:text-primary gap-1"
                    onClick={() => handleOpenFullEditor(section.id)}
                  >
                    <PenLine className="size-4" />
                    Edit Section
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary hover:text-primary gap-1"
                    onClick={() => handleOpenSectionPreview(section)}
                  >
                    <ChevronRight className="size-4" />
                    View Section
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {viewMode === "edit" && (
          <Card
            className="border-dashed hover:shadow-md hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center"
            onClick={handleAddSection}
          >
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

      <Card className="mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="size-5" />
            Table of Contents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {index + 1}.
                  </span>
                  <span className="font-medium">{section.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1"
                  onClick={() =>
                    viewMode === "edit"
                      ? handleOpenFullEditor(section.id)
                      : handleOpenSectionPreview(section)
                  }
                >
                  {viewMode === "edit" ? (
                    <>
                      <PenLine className="size-3.5" />
                      <span className="text-xs">Edit</span>
                    </>
                  ) : (
                    <>
                      <ChevronRight className="size-3.5" />
                      <span className="text-xs">View</span>
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
