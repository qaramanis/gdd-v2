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
      },
      {
        id: "gameConcept",
        name: "Game Concept",
        description:
          "Core ideas and mechanics that form the foundation of the game",
      },
      {
        id: "storyline",
        name: "Storyline & Background",
        description:
          "Context and depth to the game world, setting the stage for the player's journey",
      },
      {
        id: "gameplay",
        name: "Gameplay Mechanics",
        description:
          "Interactive elements that players will engage with while playing",
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
      },
      {
        id: "assets",
        name: "Assets",
        description:
          "Visual, auditory, and other resources required to bring the game to life",
      },
      {
        id: "technical",
        name: "Technical Features",
        description:
          "Platforms, engine choice, networking requirements, and performance considerations",
      },
      {
        id: "ui",
        name: "User Interface (UI)",
        description:
          "How players interact with menus, HUDs, and other graphical elements",
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
      },
      {
        id: "marketing",
        name: "Marketing & Promotion",
        description: "Strategies for promoting the game to target audiences",
      },
      {
        id: "development",
        name: "Development Plan",
        description: "Timeline, milestones, tasks and resources required",
      },
      {
        id: "legal",
        name: "Legal & Compliance",
        description:
          "Legal requirements, regulations, and compliance considerations",
      },
    ],
  },
];

// Default selections
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
  const [selectedSections, setSelectedSections] = useState<SectionSelection>(defaultSections);

  // Load saved sections on component mount
  useEffect(() => {
    const savedSections = loadFromStorage<SectionSelection>(STORAGE_KEYS.SECTIONS, defaultSections);
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
    <div className="space-y-4 w-full max-w-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Document Sections</h2>
          <p className="text-muted-foreground">
            Select the sections you want to include in your document
          </p>
        </div>
        <div className="text-sm bg-primary/10 py-1 px-3 rounded-full">
          <span className="font-medium">{countSelectedSections()}</span>{" "}
          sections selected
        </div>
      </div>

      <div className="space-y-6 mt-6">
        {sectionGroups.map((group) => (
          <div key={group.name} className="space-y-3">
            <h3 className="font-medium text-base text-muted-foreground">
              {group.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.sections.map((section) => (
                <Card
                  key={section.id}
                  className={`cursor-pointer border transition-all ${
                    selectedSections[section.id]
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => toggleSection(section.id)}
                >
                  <CardContent className="p-4 flex items-start">
                    <div
                      className={`w-5 h-5 rounded-full border flex-shrink-0 mr-3 mt-0.5 flex items-center justify-center ${
                        selectedSections[section.id]
                          ? "bg-primary border-primary"
                          : "border-input"
                      }`}
                    >
                      {selectedSections[section.id] && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{section.name}</h4>
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
    </div>
  );
}

// Export for use in other components
export { sectionGroups };