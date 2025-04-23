"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from "../local-storage";

interface ThemeData {
  visualTheme: string;
  typography: string;
}

const predefinedThemes = [
  {
    name: "Classic Professional",
    primary: "#4A6FFF",
    secondary: "#8C9EFF",
    description: "A professional style with a clean blue palette",
  },
  {
    name: "Dark Modern",
    primary: "#7C3AED",
    secondary: "#C4B5FD",
    description: "A modern style with a dark purple theme",
  },
  {
    name: "Retro Pixel",
    primary: "#10B981",
    secondary: "#6EE7B7",
    description: "A retro style with pixel-art inspired green tones",
  },
];

const defaultTheme: ThemeData = {
  visualTheme: "Classic Professional",
  typography: "sans",
};

export default function VisualTheme() {
  const [themeData, setThemeData] = useState<ThemeData>(defaultTheme);

  useEffect(() => {
    const savedTheme = loadFromStorage<ThemeData>(
      STORAGE_KEYS.THEME,
      defaultTheme
    );
    setThemeData(savedTheme);
  }, []);

  const updateTheme = (updates: Partial<ThemeData>) => {
    const updatedTheme = { ...themeData, ...updates };
    setThemeData(updatedTheme);
    saveToStorage(STORAGE_KEYS.THEME, updatedTheme);
  };

  return (
    <div className="space-y-4 w-full max-w-full py-4">
      <div>
        <h2 className="text-xl font-semibold">Visual Theme</h2>
        <p className="text-muted-foreground">
          Choose a visual style that reflects your game's aesthetic (
          {predefinedThemes.length} themes available)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {predefinedThemes.map((theme) => (
          <Card
            key={theme.name}
            className={`cursor-pointer overflow-hidden hover:shadow-md transition-all ${
              themeData.visualTheme === theme.name ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => updateTheme({ visualTheme: theme.name })}
          >
            <div
              className="h-2"
              style={{ backgroundColor: theme.primary }}
            ></div>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex gap-2 mb-4">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                  ></div>
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: theme.secondary }}
                  ></div>
                </div>
                <h3 className="font-semibold">{theme.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {theme.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Typography Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className={`cursor-pointer ${
              themeData.typography === "sans" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => updateTheme({ typography: "sans" })}
          >
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Clean Sans</h3>
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                A modern, readable sans-serif font perfect for clean
                documentation
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer ${
              themeData.typography === "mono" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => updateTheme({ typography: "mono" })}
          >
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Technical Mono</h3>
              <p
                className="text-sm"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                A monospaced font ideal for technical documentation
              </p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer ${
              themeData.typography === "serif" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => updateTheme({ typography: "serif" })}
          >
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Elegant Serif</h3>
              <p className="text-sm" style={{ fontFamily: "serif" }}>
                A classic serif font for a more traditional document feel
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
