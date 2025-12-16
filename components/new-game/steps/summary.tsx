"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGameCreation } from "../game-creation-context";

export default function Summary() {
  const { gameData } = useGameCreation();

  const getSectionName = (sectionId: string) => {
    const sections = {
      overview: "Game Overview",
      gameplay: "Gameplay Mechanics",
      story: "Story & World",
      characters: "Characters",
      levels: "Level Design",
      art: "Art Direction",
      audio: "Audio Design",
      ui: "User Interface",
      technical: "Technical Specs",
      monetization: "Monetization",
      marketing: "Marketing",
      schedule: "Development Schedule",
    };
    return sections[sectionId as keyof typeof sections] || sectionId;
  };

  const getPlatformName = (platformId: string) => {
    const platforms = {
      pc: "PC",
      playstation: "PlayStation",
      xbox: "Xbox",
      nintendo: "Nintendo Switch",
      mobile: "Mobile",
      vr: "VR/AR",
    };
    return platforms[platformId as keyof typeof platforms] || platformId;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Review Your Game</h2>
        <p className="text-accent">
          Confirm all details before creating your game
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Game Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-accent mb-1">
              Title
            </p>
            <p className="text-lg font-semibold">
              {gameData.name || "Untitled Game"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-accent mb-1">
              Concept
            </p>
            <p className="text-sm">
              {gameData.concept || "No concept provided"}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-accent mb-1">
                Start Date
              </p>
              <p className="text-sm">{gameData.startDate || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-accent mb-1">
                Timeline
              </p>
              <p className="text-sm">{gameData.timeline || "Not specified"}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium text-accent mb-2">
              Target Platforms
            </p>
            <div className="flex flex-wrap gap-2">
              {gameData.platforms && gameData.platforms.length > 0 ? (
                gameData.platforms.map((platform) => (
                  <Badge key={platform} variant="secondary">
                    {getPlatformName(platform)}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-accent">
                  No platforms selected
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document Structure</CardTitle>
          <CardDescription>
            {gameData.documentSections?.length || 0} sections will be created
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {gameData.documentSections?.map((sectionId) => (
              <div
                key={sectionId}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted"
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm">{getSectionName(sectionId)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
