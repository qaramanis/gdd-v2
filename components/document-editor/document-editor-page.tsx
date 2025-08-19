"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import {
  FileText,
  ChevronLeft,
  AlertCircle,
  Eye,
  EyeOff,
  Download,
  Plus,
  Trash2,
  Edit3,
  Menu,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/database/supabase";
import { useUser } from "@/providers/user-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import DocumentEditorSkeleton from "@/components/document-editor/document-editor-skeleton";
import EditorToolbar from "@/components/document-editor/document-editor-toolbar";
import { useBreadcrumb } from "@/providers/breadcrumb-context";

const lowlight = createLowlight(common);

interface Game {
  id: number;
  name: string;
  concept: string;
}

interface Section {
  id: string;
  document_id: string;
  title: string;
  content: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

interface Document {
  createElement: any; //TODO: Implement createElement
  id: string;
  game_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

interface Game {
  id: number;
  name: string;
  concept: string;
}

export default function DocumentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const { userId, loading: userLoading } = useUser();
  const [game, setGame] = useState<Game | null>(null);
  const [document, setDocument] = useState<Document | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const { setOverride, clearOverride } = useBreadcrumb();

  useEffect(() => {
    // When game data is loaded, update breadcrumb
    if (game?.name) {
      setOverride(`/games/${game.id}/document`, game.name);
    }

    // Cleanup on unmount
    return () => {
      if (game?.id) {
        clearOverride(`/games/${game.id}/document`);
      }
    };
  }, [game]);

  // Initialize TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Image,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Enter heading...";
          }
          return "Start writing your document...";
        },
      }),
      CharacterCount,
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[500px] max-w-none dark:prose-invert",
      },
    },
    onUpdate: ({ editor }) => {
      // Auto-save logic
      if (autoSaveEnabled && activeSection) {
        handleAutoSave(editor.getJSON());
      }
    },
    immediatelyRender: false,
  });

  // Fetch document data on mount
  useEffect(() => {
    if (!userLoading && userId) {
      fetchDocumentData();
    } else if (!userLoading && !userId) {
      setLoading(false);
      setError("Please sign in to edit this document");
    }
  }, [params.id, userId, userLoading]);

  // Load section content when active section changes
  useEffect(() => {
    if (editor && activeSection) {
      const section = sections.find((s) => s.id === activeSection);
      if (section && section.content) {
        try {
          const content = JSON.parse(section.content);
          editor.commands.setContent(content);
        } catch {
          editor.commands.setContent(section.content);
        }
      } else {
        editor.commands.setContent("");
      }
    }
  }, [activeSection, editor, sections]);

  const fetchDocumentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch game details
      const { data: gameData, error: gameError } = await supabase
        .from("games")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", userId)
        .single();

      if (gameError) {
        if (gameError.code === "PGRST116") {
          setError("Game not found or you don't have access to it");
        } else {
          throw gameError;
        }
        return;
      }

      setGame(gameData);

      // Fetch document
      const { data: documentData, error: documentError } = await supabase
        .from("documents")
        .select("*")
        .eq("game_id", params.id)
        .single();

      if (documentError) {
        if (documentError.code === "PGRST116") {
          router.push(`/games/${params.id}/document/new`);
        } else {
          throw documentError;
        }
        return;
      }

      setDocument(documentData);

      // Fetch document sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from("document_sections")
        .select("*")
        .eq("document_id", documentData.id)
        .order("order", { ascending: true });

      if (sectionsError) throw sectionsError;

      setSections(sectionsData || []);
      if (sectionsData && sectionsData.length > 0) {
        setActiveSection(sectionsData[0].id);
      }
    } catch (err: any) {
      console.error("Error fetching document data:", err);
      setError(err.message || "Failed to load document");
    } finally {
      setLoading(false);
    }
  };

  // Save content to database
  const saveToDatabase = async (sectionId: string, content: any) => {
    try {
      const { error } = await supabase
        .from("document_sections")
        .update({
          content: JSON.stringify(content),
          updated_at: new Date().toISOString(),
        })
        .eq("id", sectionId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error saving to database:", error);
      toast.error("Failed to save changes");
      return false;
    }
  };

  // Handle manual save
  const handleSave = async () => {
    if (!editor || !activeSection) return;

    setIsSaving(true);
    const content = editor.getJSON();

    // Save to database
    const success = await saveToDatabase(activeSection, content);

    if (success) {
      setLastSaved(new Date());
      toast.success("Document saved successfully");

      // Update local state
      setSections((prev) =>
        prev.map((section) =>
          section.id === activeSection
            ? {
                ...section,
                content: JSON.stringify(content),
                updated_at: new Date().toISOString(),
              }
            : section,
        ),
      );
    }

    setIsSaving(false);
  };

  // Debounce function
  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    wait: number,
  ) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>): void => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, wait);
    };
  };

  // Auto-save functionality
  const handleAutoSave = useCallback(
    debounce(async (content: any) => {
      if (!activeSection) return;

      // Save to database
      await saveToDatabase(activeSection, content);
      setLastSaved(new Date());
    }, 2000),
    [activeSection],
  );

  // Add new section
  const handleAddSection = async () => {
    if (!document) return;

    const newSection: Partial<Section> = {
      document_id: document.id,
      title: "New Section",
      content: "",
      order: sections.length,
    };

    const { data, error } = await supabase
      .from("document_sections")
      .insert(newSection)
      .select()
      .single();

    if (error) {
      toast.error("Failed to add section");
      return;
    }

    setSections([...sections, data]);
    setActiveSection(data.id);
    toast.success("Section added");
  };

  // Delete section
  const handleDeleteSection = async (sectionId: string) => {
    if (sections.length === 1) {
      toast.error("Cannot delete the last section");
      return;
    }

    const { error } = await supabase
      .from("document_sections")
      .delete()
      .eq("id", sectionId);

    if (error) {
      toast.error("Failed to delete section");
      return;
    }

    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    if (activeSection === sectionId) {
      setActiveSection(sections[0].id);
    }
    toast.success("Section deleted");
  };

  // Update section title
  const handleUpdateSectionTitle = async (
    sectionId: string,
    newTitle: string,
  ) => {
    const { error } = await supabase
      .from("document_sections")
      .update({ title: newTitle })
      .eq("id", sectionId);

    if (error) {
      toast.error("Failed to update section title");
      return;
    }

    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, title: newTitle } : section,
      ),
    );
    setEditingSection(null);
    toast.success("Section title updated");
  };

  // Export document
  const handleExport = () => {
    if (!editor || !document) return;

    const content = editor.getHTML();
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${document.title}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || userLoading) {
    return <DocumentEditorSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg mb-4">{error}</p>
        <div className="flex gap-2">
          <Button onClick={() => router.push(`/games/${params.id}`)}>
            Back to Game
          </Button>
          {error.includes("sign in") && (
            <Button onClick={() => router.push("/sign-in")}>Sign In</Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-[80vh] flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/games/${params.id}`)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {game?.name}
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl font-bold">{document?.title}</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="gap-2"
              >
                {isPreviewMode ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {isPreviewMode ? "Edit" : "Preview"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                id="autosave"
                checked={autoSaveEnabled}
                onCheckedChange={setAutoSaveEnabled}
              />
              <Label htmlFor="autosave" className="text-sm">
                Auto-save
              </Label>
            </div>
            {editor && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {editor.storage.characterCount.characters()} characters
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Section Navigation Sidebar */}
        {sidebarCollapsed ? (
          <div className="w-12 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(false)}
              className="h-8 w-8 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Document Sections</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(true)}
                  className="h-6 w-6 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {sections.map((section) => (
                <div
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "mb-1 rounded-lg transition-all group",
                    activeSection === section.id
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                >
                  <div className="flex items-center justify-between p-2">
                    {editingSection === section.id ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => {
                          handleUpdateSectionTitle(section.id, editTitle);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleUpdateSectionTitle(section.id, editTitle);
                          }
                        }}
                        className="h-7 text-sm"
                        autoFocus
                      />
                    ) : (
                      <div className="flex-1 text-left text-sm font-medium">
                        {section.title}
                      </div>
                    )}

                    <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingSection(section.id);
                          setEditTitle(section.title);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSection(section.id)}
                        className="h-6 w-6 p-0 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {editor && activeSection === section.id && (
                    <div className="px-2 pb-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {editor.storage.characterCount.characters()} characters
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={handleAddSection}
                size="sm"
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!isPreviewMode && (
            <EditorToolbar
              editor={editor}
              onSave={handleSave}
              isSaving={isSaving}
              lastSaved={lastSaved}
            />
          )}

          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="max-w-4xl mx-auto">
              {sections.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No sections in this document yet
                    </p>
                    <Button onClick={handleAddSection}>
                      Create First Section
                    </Button>
                  </CardContent>
                </Card>
              ) : isPreviewMode ? (
                <div
                  className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: editor?.getHTML() || "",
                  }}
                />
              ) : (
                <EditorContent editor={editor} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
