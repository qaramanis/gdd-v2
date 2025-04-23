"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from "../local-storage";

interface GameInfo {
  gameTitle: string;
  concept: string;
  teamMembers: string[];
  platforms: {
    pc: boolean;
    mobile: boolean;
    console: boolean;
    vr: boolean;
  };
  startDate: string;
  timeline: string;
}

const defaultInfo: GameInfo = {
  gameTitle: "",
  concept: "",
  teamMembers: ["Jane Smith", "John Doe"],
  platforms: {
    pc: false,
    mobile: false,
    console: false,
    vr: false,
  },
  startDate: "",
  timeline: "6 months",
};

export default function Information() {
  const [info, setInfo] = useState<GameInfo>(defaultInfo);

  useEffect(() => {
    const savedInfo = loadFromStorage<GameInfo>(STORAGE_KEYS.INFO, defaultInfo);
    setInfo(savedInfo);
  }, []);

  const updateInfo = (updates: Partial<GameInfo>) => {
    const updatedInfo = { ...info, ...updates };
    setInfo(updatedInfo);
    saveToStorage(STORAGE_KEYS.INFO, updatedInfo);
  };

  const togglePlatform = (platform: keyof GameInfo["platforms"]) => {
    updateInfo({
      platforms: {
        ...info.platforms,
        [platform]: !info.platforms[platform],
      },
    });
  };

  return (
    <div className="space-y-4 w-full max-w-full">
      <div>
        <h2 className="text-xl font-semibold">Basic Project Information</h2>
        <p className="text-muted-foreground">
          Enter essential details about your game project
        </p>
      </div>

      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Game Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Game Title</label>
                <Input
                  placeholder="Enter your game's title"
                  value={info.gameTitle}
                  onChange={(e) => updateInfo({ gameTitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  High-Level Concept (Elevator Pitch)
                </label>
                <textarea
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-24 focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="A brief description of your game that captures its essence"
                  value={info.concept}
                  onChange={(e) => updateInfo({ concept: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Platforms</label>
                <div className="grid grid-cols-2 gap-2 p-3 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="pc"
                      className="rounded border-gray-300"
                      checked={info.platforms.pc}
                      onChange={() => togglePlatform("pc")}
                    />
                    <label htmlFor="pc">PC</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="mobile"
                      className="rounded border-gray-300"
                      checked={info.platforms.mobile}
                      onChange={() => togglePlatform("mobile")}
                    />
                    <label htmlFor="mobile">Mobile</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="console"
                      className="rounded border-gray-300"
                      checked={info.platforms.console}
                      onChange={() => togglePlatform("console")}
                    />
                    <label htmlFor="console">Console</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="vr"
                      className="rounded border-gray-300"
                      checked={info.platforms.vr}
                      onChange={() => togglePlatform("vr")}
                    />
                    <label htmlFor="vr">VR/AR</label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={info.startDate}
                    onChange={(e) => updateInfo({ startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Estimated Timeline
                  </label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    value={info.timeline}
                    onChange={(e) => updateInfo({ timeline: e.target.value })}
                  >
                    <option>3 months</option>
                    <option>6 months</option>
                    <option>1 year</option>
                    <option>18 months</option>
                    <option>2+ years</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
