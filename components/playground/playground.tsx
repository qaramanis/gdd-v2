"use client";

import React, { useState } from "react";
import { SceneViewer } from "./scene-viewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Check } from "lucide-react";

// Sample scenes for demonstration
const DEMO_SCENES = {
  unity: [
    {
      id: "scene1",
      name: "Character Controller",
      url: "/demo/unity/character-demo.html",
    },
    {
      id: "scene2",
      name: "Environment Demo",
      url: "/demo/unity/environment-demo.html",
    },
  ],
  unreal: [
    {
      id: "scene3",
      name: "Vehicle Physics",
      url: "/demo/unreal/vehicle-demo.html",
    },
    {
      id: "scene4",
      name: "Lighting Setup",
      url: "/demo/unreal/lighting-demo.html",
    },
  ],
};

export default function Playground() {
  const [activeEngine, setActiveEngine] = useState<"unity" | "unreal">("unity");
  const [selectedScene, setSelectedScene] = useState<
    (typeof DEMO_SCENES.unity)[0] | null
  >(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSceneSelect = (scene: (typeof DEMO_SCENES.unity)[0]) => {
    setSelectedScene(scene);
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Mock upload process
    setTimeout(() => {
      setIsUploading(false);
      // You could set a new scene here after successful upload
    }, 2000);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Engine Playground</h1>
        <Button onClick={handleUpload} disabled={isUploading}>
          {isUploading ? (
            <>
              <Check className="mr-2 size-4" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 size-4" />
              Upload Scene
            </>
          )}
        </Button>
      </div>

      <div className="flex gap-4 h-[calc(100vh-12rem)]">
        <div className="w-64 bg-background rounded-lg p-4 border">
          <Tabs
            value={activeEngine}
            onValueChange={(v) => setActiveEngine(v as "unity" | "unreal")}
          >
            <TabsList className="w-full mb-4 border-b ">
              <TabsTrigger value="unity" className="flex-1">
                Unity
              </TabsTrigger>
              {/* <TabsTrigger value="unreal" className="flex-1">
                Unreal
              </TabsTrigger>   */}
            </TabsList>

            <TabsContent value="unity" className="mt-0">
              <div className="space-y-2">
                <h3 className="font-medium mb-2">Available Scenes</h3>
                <Input placeholder="Search scenes..." className="mb-2" />
                {DEMO_SCENES.unity.map((scene) => (
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
                {DEMO_SCENES.unreal.map((scene) => (
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
            sceneUrl={selectedScene?.url || null}
            engineType={activeEngine}
            onUpload={handleUpload}
          />
        </div>
      </div>
    </div>
  );
}
