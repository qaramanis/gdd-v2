"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useGameCreation } from "../game-creation-context";

const platforms = [
  { id: "pc", name: "PC", icon: "💻" },
  { id: "playstation", name: "PlayStation", icon: "🎮" },
  { id: "xbox", name: "Xbox", icon: "🎮" },
  { id: "nintendo", name: "Nintendo Switch", icon: "🎮" },
  { id: "mobile", name: "Mobile", icon: "📱" },
  { id: "vr", name: "VR/AR", icon: "🥽" },
];

const timelines = [
  "1-3 months",
  "3-6 months",
  "6-12 months",
  "1-2 years",
  "2+ years",
];

export default function GameInformation() {
  const { gameData, updateGameData } = useGameCreation();
  const [date, setDate] = React.useState<Date | undefined>(
    gameData.startDate ? new Date(gameData.startDate) : undefined,
  );

  const handlePlatformToggle = (platformId: string) => {
    const currentPlatforms = gameData.platforms || [];
    const updatedPlatforms = currentPlatforms.includes(platformId)
      ? currentPlatforms.filter((p) => p !== platformId)
      : [...currentPlatforms, platformId];
    updateGameData({ platforms: updatedPlatforms });
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      updateGameData({ startDate: format(selectedDate, "yyyy-MM-dd") });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Game Information</h2>
        <p className="text-muted-foreground">
          Enter essential details about your game project
        </p>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Basic Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Game Title *</label>
            <Input
              placeholder="Enter your game's title"
              value={gameData.name || ""}
              onChange={(e) => updateGameData({ name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              High-Level Concept (Elevator Pitch) *
            </label>
            <Textarea
              className="min-h-24"
              placeholder="A brief description of your game that captures its essence"
              value={gameData.concept || ""}
              onChange={(e) => updateGameData({ concept: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Development Timeline
              </label>
              <select
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                value={gameData.timeline || ""}
                onChange={(e) => updateGameData({ timeline: e.target.value })}
              >
                <option value="">Select timeline</option>
                {timelines.map((timeline) => (
                  <option key={timeline} value={timeline}>
                    {timeline}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Target Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={cn(
                  "flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors",
                  gameData.platforms?.includes(platform.id)
                    ? "bg-primary/10 border-primary"
                    : "hover:bg-muted",
                )}
                onClick={() => handlePlatformToggle(platform.id)}
              >
                <Checkbox
                  checked={gameData.platforms?.includes(platform.id)}
                  onCheckedChange={() => handlePlatformToggle(platform.id)}
                />
                <span className="text-lg">{platform.icon}</span>
                <label className="text-sm font-medium cursor-pointer">
                  {platform.name}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
