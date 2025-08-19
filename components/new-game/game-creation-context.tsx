"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface GameData {
  name: string;
  concept: string;
  startDate?: string;
  timeline?: string;
  platforms?: string[];
  documentTemplate?: string;
  documentSections?: string[];
}

interface GameCreationContextType {
  gameData: GameData;
  updateGameData: (data: Partial<GameData>) => void;
  clearGameData: () => void;
}

const GameCreationContext = createContext<GameCreationContextType | undefined>(
  undefined,
);

export function GameCreationProvider({ children }: { children: ReactNode }) {
  const [gameData, setGameData] = useState<GameData>({
    name: "",
    concept: "",
    platforms: [],
    documentTemplate: "standard",
    documentSections: [
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
  });

  const updateGameData = (data: Partial<GameData>) => {
    setGameData((prev) => ({ ...prev, ...data }));
  };

  const clearGameData = () => {
    setGameData({
      name: "",
      concept: "",
      platforms: [],
      documentTemplate: "standard",
      documentSections: [],
    });
  };

  return (
    <GameCreationContext.Provider
      value={{ gameData, updateGameData, clearGameData }}
    >
      {children}
    </GameCreationContext.Provider>
  );
}

export function useGameCreation() {
  const context = useContext(GameCreationContext);
  if (!context) {
    throw new Error("useGameCreation must be used within GameCreationProvider");
  }
  return context;
}
