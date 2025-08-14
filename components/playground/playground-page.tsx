"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SceneViewer } from "@/components/playground/scene-viewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from "@/database/supabase";

export default function Playground() {
  const searchParams = useSearchParams();
  const sceneId = searchParams.get("scene");
  const gameId = searchParams.get("game");

  const [activeEngine, setActiveEngine] = useState<"unity" | "unreal">("unity");
  const [selectedScene, setSelectedScene] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scenes, setScenes] = useState<any[]>([]);

  useEffect(() => {
    if (sceneId) {
      loadScene(sceneId);
    } else if (gameId) {
      loadGameScenes(gameId);
    }
  }, [sceneId, gameId]);

  const loadScene = async (id: string) => {
    setIsLoading(true);
    const { data } = await supabase
      .from("game_scenes")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setSelectedScene(data);
      setActiveEngine(data.engine as any);
    }
    setIsLoading(false);
  };

  const loadGameScenes = async (gameId: string) => {
    const { data } = await supabase
      .from("game_scenes")
      .select("*")
      .eq("game_id", gameId)
      .eq("is_playable", true)
      .order("created_at", { ascending: false });

    if (data) {
      setScenes(data);
    }
  };

  const handleSceneSelect = (scene: any) => {
    setSelectedScene(scene);
    setActiveEngine(scene.engine as any);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
        <div className="w-64 bg-background rounded-lg p-4 border">
          <Tabs
            value={activeEngine}
            onValueChange={(v) => setActiveEngine(v as "unity" | "unreal")}
          >
            <TabsList className="w-full mb-4">
              <TabsTrigger value="unity" className="flex-1">
                Unity
              </TabsTrigger>
              <TabsTrigger value="unreal" className="flex-1">
                Unreal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unity" className="mt-0">
              <div className="space-y-2">
                <h3 className="font-medium mb-2">Available Scenes</h3>
                <Input placeholder="Search scenes..." className="mb-2" />
                {scenes
                  .filter((s) => s.engine === "unity")
                  .map((scene) => (
                    <div
                      key={scene.id}
                      className={`p-2 rounded-md cursor-pointer transition-colors ${
                        selectedScene?.id === scene.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => handleSceneSelect(scene)}
                    >
                      {scene.name}
                    </div>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="unreal" className="mt-0">
              <div className="space-y-2">
                <h3 className="font-medium mb-2">Available Scenes</h3>
                <Input placeholder="Search scenes..." className="mb-2" />
                {scenes
                  .filter((s) => s.engine === "unreal")
                  .map((scene) => (
                    <div
                      key={scene.id}
                      className={`p-2 rounded-md cursor-pointer transition-colors ${
                        selectedScene?.id === scene.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => handleSceneSelect(scene)}
                    >
                      {scene.name}
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1">
          <SceneViewer
            sceneUrl={selectedScene?.scene_url || null}
            engineType={activeEngine}
            onUpload={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
