"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Check,
  ChevronRight,
  Book,
  Sparkles,
  Settings,
  Loader2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/database/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUser } from "@/providers/user-context";

interface CreateDocumentFormProps {
  game: {
    id: number;
    name: string;
    concept: string;
  };
}

// Predefined document sections
const DOCUMENT_SECTIONS = [
  {
    id: "overview",
    name: "Overview",
    description: "Game concept, target audience, and unique selling points",
    category: "Core",
    required: true,
  },
  {
    id: "gameplay",
    name: "Gameplay Mechanics",
    description: "Core mechanics, controls, and player interactions",
    category: "Core",
    required: true,
  },
  {
    id: "story",
    name: "Story & Setting",
    description: "Narrative, world-building, and character backgrounds",
    category: "Narrative",
    required: false,
  },
  {
    id: "characters",
    name: "Characters",
    description: "Player characters, NPCs, and their roles",
    category: "Narrative",
    required: false,
  },
  {
    id: "levels",
    name: "Level Design",
    description: "Level structure, progression, and environments",
    category: "Design",
    required: true,
  },
  {
    id: "art",
    name: "Art Style",
    description: "Visual direction, concept art, and aesthetic choices",
    category: "Visuals",
    required: false,
  },
  {
    id: "audio",
    name: "Audio Design",
    description: "Music, sound effects, and audio direction",
    category: "Audio",
    required: false,
  },
  {
    id: "ui",
    name: "User Interface",
    description: "Menus, HUD, and interface design",
    category: "Design",
    required: false,
  },
  {
    id: "technical",
    name: "Technical Specifications",
    description:
      "Platform requirements, engine details, and performance targets",
    category: "Technical",
    required: true,
  },
  {
    id: "monetization",
    name: "Monetization",
    description: "Business model, pricing, and revenue strategies",
    category: "Business",
    required: false,
  },
  {
    id: "marketing",
    name: "Marketing Strategy",
    description: "Target audience, promotion plans, and market analysis",
    category: "Business",
    required: false,
  },
  {
    id: "schedule",
    name: "Development Schedule",
    description: "Milestones, deadlines, and production timeline",
    category: "Planning",
    required: true,
  },
];

// Document templates
const TEMPLATES = [
  {
    id: "custom",
    name: "Custom",
    description: "Start from scratch and choose your own sections",
    icon: Settings,
    sections: [],
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Essential sections only for quick prototypes",
    icon: FileText,
    sections: ["overview", "gameplay", "levels", "technical"],
  },
  {
    id: "standard",
    name: "Standard",
    description: "Comprehensive document for most game projects",
    icon: Book,
    sections: [
      "overview",
      "gameplay",
      "story",
      "characters",
      "levels",
      "art",
      "ui",
      "technical",
      "schedule",
    ],
  },
  {
    id: "complete",
    name: "Complete",
    description: "All sections for detailed documentation",
    icon: Sparkles,
    sections: DOCUMENT_SECTIONS.map((s) => s.id),
  },
];

export default function CreateDocumentForm({ game }: CreateDocumentFormProps) {
  const router = useRouter();
  const { userId } = useUser();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("standard");
  const [documentTitle, setDocumentTitle] = useState(
    `${game.name} - Game Design Document`,
  );
  const [documentDescription, setDocumentDescription] = useState(
    game.concept || "",
  );
  const [selectedSections, setSelectedSections] = useState<string[]>(
    TEMPLATES.find((t) => t.id === "standard")?.sections || [],
  );
  const [autoSave, setAutoSave] = useState(true);
  const [versionControl, setVersionControl] = useState(false);
  const [collaborativeEditing, setCollaborativeEditing] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = TEMPLATES.find((t) => t.id === templateId);
    if (template && templateId !== "custom") {
      setSelectedSections(template.sections);
    }
  };

  const toggleSection = (sectionId: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const handleSubmit = async () => {
    if (!documentTitle.trim()) {
      toast.error("Please enter a document title");
      return;
    }

    if (selectedSections.length === 0) {
      toast.error("Please select at least one section");
      return;
    }

    if (!userId) {
      toast.error("You must be logged in to create a document");
      return;
    }

    setLoading(true);

    try {
      // Update game concept if description changed
      if (documentDescription !== game.concept) {
        const { error: gameUpdateError } = await supabase
          .from("games")
          .update({ concept: documentDescription })
          .eq("id", game.id);

        if (gameUpdateError) throw gameUpdateError;
      }

      // Create the document with user_id
      const { data: documentData, error: documentError } = await supabase
        .from("documents")
        .insert({
          game_id: game.id,
          title: documentTitle,
          user_id: userId, // Add the user_id here
        })
        .select()
        .single();

      if (documentError) throw documentError;

      // Create document sections
      const sectionsToCreate = selectedSections.map((sectionId, index) => {
        const section = DOCUMENT_SECTIONS.find((s) => s.id === sectionId);
        return {
          document_id: documentData.id,
          title: section?.name || sectionId,
          content: "",
          order: index,
        };
      });

      const { error: sectionsError } = await supabase
        .from("document_sections")
        .insert(sectionsToCreate);

      if (sectionsError) throw sectionsError;

      toast.success("Document created successfully!");
      router.push(`/games/${game.id}/document`);
    } catch (error: any) {
      console.error("Error creating document:", error);
      toast.error(error.message || "Failed to create document");
    } finally {
      setLoading(false);
    }
  };

  // Group sections by category
  const sectionsByCategory = DOCUMENT_SECTIONS.reduce(
    (acc, section) => {
      if (!acc[section.category]) {
        acc[section.category] = [];
      }
      acc[section.category].push(section);
      return acc;
    },
    {} as Record<string, typeof DOCUMENT_SECTIONS>,
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Document Info */}
      <Card>
        <CardHeader>
          <CardTitle>Document Information</CardTitle>
          <CardDescription>
            Basic information about your game design document
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Enter document title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
              placeholder="Brief description of this document version or purpose"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose a Template</CardTitle>
          <CardDescription>
            Start with a pre-configured template or create your own
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEMPLATES.map((template) => {
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                    selectedTemplate === template.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                  )}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-5 w-5 text-primary" />
                    {selectedTemplate === template.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <h3 className="font-medium text-sm mb-1">{template.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {template.description}
                  </p>
                  {template.sections.length > 0 && (
                    <p className="text-xs text-primary mt-2">
                      {template.sections.length} sections
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Document Sections</CardTitle>
          <CardDescription>
            Choose which sections to include in your document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              You can add or remove sections later. Required sections are
              recommended for a complete document.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            {Object.entries(sectionsByCategory).map(([category, sections]) => (
              <div key={category}>
                <h3 className="font-medium text-sm mb-3 text-muted-foreground">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all",
                        selectedSections.includes(section.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50",
                      )}
                      onClick={() => toggleSection(section.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {section.name}
                            </span>
                            {section.required && (
                              <Badge variant="secondary" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {section.description}
                          </p>
                        </div>
                        <div
                          className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center ml-3 mt-0.5",
                            selectedSections.includes(section.id)
                              ? "border-primary bg-primary"
                              : "border-border",
                          )}
                        >
                          {selectedSections.includes(section.id) && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedSections.length} sections selected
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedSections(DOCUMENT_SECTIONS.map((s) => s.id))
                }
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedSections([])}
              >
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Document Settings</CardTitle>
          <CardDescription>
            Configure document behavior and features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autosave">Auto-Save</Label>
              <p className="text-xs text-muted-foreground">
                Automatically save changes as you type
              </p>
            </div>
            <Switch
              id="autosave"
              checked={autoSave}
              onCheckedChange={setAutoSave}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="version">Version Control</Label>
              <p className="text-xs text-muted-foreground">
                Track changes and maintain version history
              </p>
            </div>
            <Switch
              id="version"
              checked={versionControl}
              onCheckedChange={setVersionControl}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="collab">Collaborative Editing</Label>
              <p className="text-xs text-muted-foreground">
                Allow team members to edit simultaneously
              </p>
            </div>
            <Switch
              id="collab"
              checked={collaborativeEditing}
              onCheckedChange={setCollaborativeEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.push(`/games/${game.id}`)}
          disabled={loading}
        >
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              // Save as draft logic
              toast.info("Draft saving not implemented yet");
            }}
            disabled={loading}
          >
            Save as Draft
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Document
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
