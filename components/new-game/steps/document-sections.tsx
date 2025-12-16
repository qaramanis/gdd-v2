"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, FileText, Book, Sparkles, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGameCreation } from "../game-creation-context";

// Document section definitions
const DOCUMENT_SECTIONS = [
  {
    id: "overview",
    name: "Game Overview",
    description: "Core concept, target audience, and unique selling points",
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
    name: "Story & World",
    description: "Narrative, world-building, and lore",
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
    name: "Art Direction",
    description: "Visual style, concept art, and aesthetic choices",
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
    name: "Technical Specs",
    description: "Platform requirements, engine details, and performance",
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
    name: "Marketing",
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

// Templates for quick selection
const TEMPLATES = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Essential sections only",
    icon: FileText,
    sections: ["overview", "gameplay", "levels", "technical"],
  },
  {
    id: "standard",
    name: "Standard",
    description: "Comprehensive for most projects",
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
    description: "All available sections",
    icon: Sparkles,
    sections: DOCUMENT_SECTIONS.map((s) => s.id),
  },
  {
    id: "custom",
    name: "Custom",
    description: "Choose your own sections",
    icon: Settings,
    sections: [],
  },
];

export default function DocumentSections() {
  const { gameData, updateGameData } = useGameCreation();
  const [selectedTemplate, setSelectedTemplate] = React.useState(
    gameData.documentTemplate || "standard",
  );
  const [selectedSections, setSelectedSections] = React.useState<string[]>(
    gameData.documentSections || TEMPLATES[1].sections,
  );

  React.useEffect(() => {
    updateGameData({
      documentTemplate: selectedTemplate,
      documentSections: selectedSections,
    });
  }, [selectedSections, selectedTemplate]);

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
    setSelectedTemplate("custom");
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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Document Structure</h2>
        <p className="text-accent">
          Choose sections for your game design document
        </p>
      </div>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Templates</CardTitle>
          <CardDescription>
            Start with a template or create your own structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TEMPLATES.map((template) => {
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                    selectedTemplate === template.id
                      ? "border-primary bg-primary/10"
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
                  <p className="text-xs text-accent">
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
            Select which sections to include (you can add more later)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(sectionsByCategory).map(([category, sections]) => (
              <div key={category}>
                <h3 className="font-medium text-sm mb-3 text-accent">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all",
                        selectedSections.includes(section.id)
                          ? "border-primary bg-primary/10"
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
                                Recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-accent">
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
            <p className="text-sm text-accent">
              {selectedSections.length} sections selected
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedSections(DOCUMENT_SECTIONS.map((s) => s.id));
                  setSelectedTemplate("complete");
                }}
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedSections([]);
                  setSelectedTemplate("custom");
                }}
              >
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
