"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from "../local-storage";

interface SectionSelection {
  [key: string]: boolean;
}

const sectionGroups = [
  {
    name: "Core Design",
    sections: [
      {
        id: "overview",
        name: "Overview",
        description:
          "High-level understanding of the game's concept and target audience",
        suggested: true,
      },
      {
        id: "gameConcept",
        name: "Game Concept",
        description:
          "Core ideas and mechanics that form the foundation of the game",
        suggested: true,
      },
      {
        id: "storyline",
        name: "Storyline & Background",
        description:
          "Context and depth to the game world, setting the stage for the player's journey",
        suggested: false,
      },
      {
        id: "gameplay",
        name: "Gameplay Mechanics",
        description:
          "Interactive elements that players will engage with while playing",
        suggested: true,
      },
    ],
  },
  {
    name: "Content & Production",
    sections: [
      {
        id: "levelDesign",
        name: "Level Design",
        description:
          "Stages or levels with objectives, layouts, and progression curves",
        suggested: true,
      },
      {
        id: "assets",
        name: "Assets",
        description:
          "Visual, auditory, and other resources required to bring the game to life",
        suggested: false,
      },
      {
        id: "technical",
        name: "Technical Features",
        description:
          "Platforms, engine choice, networking requirements, and performance considerations",
        suggested: true,
      },
      {
        id: "ui",
        name: "User Interface (UI)",
        description:
          "How players interact with menus, HUDs, and other graphical elements",
        suggested: false,
      },
    ],
  },
  {
    name: "Business & Planning",
    sections: [
      {
        id: "monetization",
        name: "Monetization Strategy",
        description:
          "How the game will generate revenue through purchases, subscriptions, or ads",
        suggested: false,
      },
      {
        id: "marketing",
        name: "Marketing & Promotion",
        description: "Strategies for promoting the game to target audiences",
        suggested: false,
      },
      {
        id: "development",
        name: "Development Plan",
        description: "Timeline, milestones, tasks and resources required",
        suggested: true,
      },
      {
        id: "legal",
        name: "Legal & Compliance",
        description:
          "Legal requirements, regulations, and compliance considerations",
        suggested: false,
      },
    ],
  },
];

const defaultSections: SectionSelection = {
  overview: true,
  gameConcept: true,
  storyline: true,
  gameplay: true,
  levelDesign: true,
  assets: true,
  technical: true,
  ui: true,
  monetization: false,
  marketing: false,
  development: true,
  legal: false,
};

export default function Sections() {
  const [selectedSections, setSelectedSections] =
    useState<SectionSelection>(defaultSections);

  useEffect(() => {
    const savedSections = loadFromStorage<SectionSelection>(
      STORAGE_KEYS.SECTIONS,
      defaultSections
    );
    setSelectedSections(savedSections);
  }, []);

  const toggleSection = (sectionId: string) => {
    const updatedSections = {
      ...selectedSections,
      [sectionId]: !selectedSections[sectionId],
    };
    setSelectedSections(updatedSections);
    saveToStorage(STORAGE_KEYS.SECTIONS, updatedSections);
  };

  const countSelectedSections = () => {
    return Object.values(selectedSections).filter((value) => value).length;
  };

  return (
    <div className="space-y-4 w-full max-w-full py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Document Sections</h2>
          <p className="text-muted-foreground">
            Select the sections you want to include in your document
          </p>
        </div>
        <div className="text-sm bg-primary text-primary-foreground font-medium py-1.5 px-4 rounded-full shadow-sm">
          <span>{countSelectedSections()}</span> sections selected
        </div>
      </div>

      <div className="space-y-8 mt-6">
        {sectionGroups.map((group) => (
          <div key={group.name} className="space-y-3">
            <h3 className="font-medium text-base border-b pb-1">
              {group.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl mr-auto">
              {group.sections.map((section) => (
                <Card
                  key={section.id}
                  className={`cursor-pointer hover:shadow-md transition-all relative ${
                    selectedSections[section.id]
                      ? "border-primary-500 shadow-md"
                      : "hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  onClick={() => toggleSection(section.id)}
                >
                  {section.suggested && (
                    <div className="absolute top-2 right-2 text-xs text-black/50 dark:text-white/50 font-medium px-2 py-0.5 bg-primary/10 rounded-full ">
                      Suggested
                    </div>
                  )}
                  <CardContent className="p-4 flex items-start">
                    <div
                      className={`w-6 h-6 rounded-md border-2 flex-shrink-0 mr-3 flex items-center justify-center transition-colors ${
                        selectedSections[section.id]
                          ? "bg-primary border-primary"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {selectedSections[section.id] && (
                        <Check className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                    <div
                      className={
                        selectedSections[section.id]
                          ? "opacity-100"
                          : "opacity-80"
                      }
                    >
                      <h4
                        className={`font-medium text-sm ${
                          selectedSections[section.id] ? "text-primary" : ""
                        }`}
                      >
                        {section.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {section.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4 mt-8">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Check className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Pro tip: Choose carefully</p>
            <p className="text-sm text-muted-foreground">
              Select only the sections you need for your project. You can always
              add more sections later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { sectionGroups };
