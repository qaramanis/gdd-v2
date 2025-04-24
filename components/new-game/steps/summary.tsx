// components/new-game/steps/summary.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";
import { loadFromStorage, STORAGE_KEYS } from "../local-storage";
import { sectionGroups } from "./sections";

interface Template {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface SectionSelection {
  [key: string]: boolean;
}

interface GameInfo {
  gameTitle: string;
  concept: string;
  platforms: {
    pc: boolean;
    mobile: boolean;
    console: boolean;
    vr: boolean;
  };
  startDate: string;
  timeline: string;
}

interface ThemeData {
  visualTheme: string;
  typography: string;
}

export default function Summary() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [selectedSections, setSelectedSections] = useState<SectionSelection>(
    {}
  );
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [theme, setTheme] = useState<ThemeData | null>(null);

  useEffect(() => {
    setSelectedTemplate(
      loadFromStorage<Template | null>(STORAGE_KEYS.TEMPLATE, null)
    );

    setSelectedSections(
      loadFromStorage<SectionSelection>(STORAGE_KEYS.SECTIONS, {
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
      })
    );

    setGameInfo(
      loadFromStorage<GameInfo>(STORAGE_KEYS.INFO, {
        gameTitle: "",
        concept: "",
        platforms: { pc: false, mobile: false, console: false, vr: false },
        startDate: "",
        timeline: "6 months",
      })
    );

    setTheme(
      loadFromStorage<ThemeData>(STORAGE_KEYS.THEME, {
        visualTheme: "classic",
        typography: "sans",
      })
    );
  }, []);

  const countSelectedSections = () => {
    if (!selectedSections) return 0;
    return Object.values(selectedSections).filter((value) => value).length;
  };

  const getThemeName = () => {
    if (!theme) return "Classic Professional";

    const themeNames: { [key: string]: string } = {
      classic: "Classic Professional",
      dark: "Dark Modern",
      retro: "Retro Pixel",
      minimalist: "Minimalist",
      fantasy: "Fantasy",
      scifi: "Sci-Fi",
    };

    return themeNames[theme.visualTheme] || "Classic Professional";
  };

  const getTypographyName = () => {
    if (!theme) return "Sans-serif";

    const typographyNames: { [key: string]: string } = {
      sans: "Sans-serif",
      mono: "Monospace",
      serif: "Serif",
    };

    return typographyNames[theme.typography] || "Sans-serif";
  };

  if (!selectedSections || !gameInfo || !theme) {
    return (
      <div className="flex justify-center items-center p-8">
        <p>Loading summary data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-full py-4">
      <div>
        <h2 className="text-xl font-semibold">Review Your Document</h2>
        <p className="text-muted-foreground">
          Review your selections before creating your document
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Document Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="text-4xl">
                    {selectedTemplate?.icon || "📝"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {gameInfo.gameTitle || "Untitled Project"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Creating a new {selectedTemplate?.name || "Custom"}{" "}
                      document
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    <span>Timeline</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {gameInfo.timeline} (starts{" "}
                    {gameInfo.startDate ? `on ${gameInfo.startDate}` : "today"})
                  </p>
                </div>
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-700" />

              <div>
                <h4 className="text-sm font-medium mb-2">
                  Included Sections ({countSelectedSections()})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedSections).map(([key, value]) => {
                    if (!value) return null;
                    const sectionName = sectionGroups
                      .flatMap((g) => g.sections)
                      .find((s) => s.id === key)?.name;
                    return (
                      <div
                        key={key}
                        className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs"
                      >
                        {sectionName}
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-700" />

              <div>
                <h4 className="text-sm font-medium mb-2">Visual Preferences</h4>
                <div className="flex gap-10">
                  <div className="w-40">
                    <span className="text-xs text-muted-foreground">
                      Theme:
                    </span>
                    <p className="text-sm">{getThemeName()}</p>
                  </div>
                  <div className="w-40">
                    <span className="text-xs text-muted-foreground">
                      Typography:
                    </span>
                    <p className="text-sm">{getTypographyName()}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
