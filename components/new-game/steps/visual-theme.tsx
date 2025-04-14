// components/new-game/steps/visual-theme.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from "../local-storage";
import { supabase } from "@/database/supabase";

interface ThemeData {
  visualTheme: string;
  typography: string;
}

interface VisualTheme {
  name: string;
  primary: string;
  secondary: string;
}

const defaultTheme: ThemeData = {
  visualTheme: "Classic Professional",
  typography: "sans",
};

export default function VisualTheme() {
  const [themeData, setThemeData] = useState<ThemeData>(defaultTheme);
  const [visualThemes, setVisualThemes] = useState<VisualTheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchThemes() {
      setLoading(true);
      const { data, error } = await supabase
        .from("visual_themes")
        .select("name, primary_color, secondary_color");

      console.log("Fetched Visual: ", data, error);
      if (error) {
        console.error("Error fetching themes:", error);
      } else if (data) {
        const themes = data.map((theme) => ({
          name: theme.name,
          primary: theme.primary_color,
          secondary: theme.secondary_color,
        }));
        setVisualThemes(themes);
      }
      setLoading(false);
    }

    fetchThemes();
  }, []);

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
        <div>
          <h2 className="text-xl font-semibold">Visual Theme</h2>
          <p className="text-muted-foreground">
            Choose a visual style that reflects your game's aesthetic (Showing{" "}
            {visualThemes.length} themes)
          </p>
        </div>
        <h2 className="text-xl font-semibold">Visual Theme</h2>
        <p className="text-muted-foreground">
          Choose a visual style that reflects your game&apos;s aesthetic
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {visualThemes.map((theme) => (
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
                  A {theme.name.toLowerCase()} style for your documentation
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <p>Debug view of all themes:</p>
        <div className="flex flex-wrap gap-2">
          {visualThemes.map((theme, index) => (
            <div key={index} className="border p-2 text-sm">
              {index + 1}: {theme.name}
            </div>
          ))}
        </div>
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
