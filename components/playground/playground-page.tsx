"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SceneViewer } from "@/components/playground/scene-viewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";

export default function Playground() {
  const [activeEngine, setActiveEngine] = useState<"unity" | "unreal">("unity");
  const [selectedScene, setSelectedScene] = useState<any>(null);

  const handleSceneSelect = (scene: any) => {
    setSelectedScene(scene);
    setActiveEngine(scene.engine as any);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Engine Playground</h1>
        <Button>
          <Upload className="mr-2 size-4" />
          Upload Scene
        </Button>
      </div>

      <div className="flex gap-4 h-[calc(100vh-12rem)]">
        <div className="w-64 bg-white rounded-xl p-4 border"></div>

        <div className="flex-1">
          <SceneViewer sceneUrl={selectedScene?.scene_url || null} />
        </div>
      </div>
    </div>
  );
}
