// components/new-game/steps/visual-theme.tsx
"use client";

import { useEffect, useState, useRef } from "react";
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
  // Add a ref to track if data has been loaded
  const dataLoadedRef = useRef(false);
  // Function to trigger parent component height recalculation
  const triggerHeightRecalculation = () => {
    // Create and dispatch a custom event that the Stepper can listen for
    const event = new CustomEvent("stepContentHeightChange");
    window.dispatchEvent(event);
  };

  useEffect(() => {
    async function fetchThemes() {
      setLoading(true);
      const { data, error } = await supabase
        .from("visual_themes")
        .select("name, primary_color, secondary_color");

      if (error) {
        console.error("Error fetching themes:", error);
      } else if (data) {
        const themes = data.map((theme) => ({
          name: theme.name,
          primary: theme.primary_color,
          secondary: theme.secondary_color,
        }));
        setVisualThemes(themes);

        // Mark that data has been loaded
        dataLoadedRef.current = true;

        // Trigger height recalculation after data is loaded and component has rendered
        setTimeout(triggerHeightRecalculation, 0);
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

  // Add effect to recalculate height when themes are loaded
  useEffect(() => {
    if (visualThemes.length > 0 && dataLoadedRef.current) {
      triggerHeightRecalculation();
    }
  }, [visualThemes]);

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
          {visualThemes.length > 0 &&
            ` (${visualThemes.length} themes available)`}
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

      {/* Loading indicator when themes are being fetched */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

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
