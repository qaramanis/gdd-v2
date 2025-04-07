"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

type Template = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

const templates: Template[] = [
  {
    id: "rpg",
    name: "Role-Playing Game",
    icon: "🧙‍♂️",
    description:
      "Template optimized for RPGs with character progression systems and narrative focus",
  },
  {
    id: "fps",
    name: "First-Person Shooter",
    icon: "🎯",
    description: "Layout for FPS games with weapon systems and level structure",
  },
  {
    id: "puzzle",
    name: "Puzzle Game",
    icon: "🧩",
    description:
      "Framework for puzzle mechanics, difficulty progression, and UI",
  },
  {
    id: "strategy",
    name: "Strategy Game",
    icon: "♟️",
    description:
      "Template for turn-based or real-time strategy games with resource management",
  },
  {
    id: "platformer",
    name: "Platformer",
    icon: "🏃",
    description:
      "Structure for platformers with character movement and level design",
  },
  {
    id: "sandbox",
    name: "Open World/Sandbox",
    icon: "🌎",
    description:
      "Documentation framework for open-world exploration and systems",
  },
  {
    id: "blank",
    name: "Blank Document",
    icon: "📝",
    description:
      "Start with a clean slate and build your document from scratch",
  },
];

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
  };
  return (
    <div className="space-y-4 w-full min-w-full">
      <h2 className="text-xl font-semibold">Choose a Template</h2>
      <p className="text-muted-foreground">
        Select a starting point based on your game type
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 w-full">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate?.id === template.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleTemplateSelect(template)}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl mb-4">{template.icon}</div>
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {template.description}
                </p>
                {selectedTemplate?.id === template.id && (
                  <div className="mt-4 bg-primary text-primary-foreground rounded-full py-1 px-3 text-xs font-medium">
                    Selected
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
