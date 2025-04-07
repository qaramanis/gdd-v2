"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from "../local-storage";

interface ThemeData {
  visualTheme: string;
  typography: string;
}

const defaultTheme: ThemeData = {
  visualTheme: "classic",
  typography: "sans",
};

const visualThemes = [
  {
    id: "classic",
    name: "Classic Professional",
    primary: "#3a86ff",
    secondary: "#8ecae6",
  },
  {
    id: "dark",
    name: "Dark Modern",
    primary: "#2a2a2a",
    secondary: "#7209b7",
  },
  {
    id: "retro",
    name: "Retro Pixel",
    primary: "#e63946",
    secondary: "#f77f00",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    primary: "#f1faee",
    secondary: "#a8dadc",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    primary: "#606c38",
    secondary: "#283618",
  },
  { id: "scifi", name: "Sci-Fi", primary: "#073b4c", secondary: "#118ab2" },
];

export default function VisualTheme() {
  const [themeData, setThemeData] = useState<ThemeData>(defaultTheme);

  // Load saved theme on component mount
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
          Choose a visual style that reflects your game&apos;s aesthetic
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {visualThemes.map((theme) => (
          <Card
            key={theme.id}
            className={`cursor-pointer overflow-hidden hover:shadow-md transition-all ${
              themeData.visualTheme === theme.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => updateTheme({ visualTheme: theme.id })}
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
                  A {theme.name.toLowerCase()} style for your documentation
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
