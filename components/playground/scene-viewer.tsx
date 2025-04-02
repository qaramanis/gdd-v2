"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Eye, Code, ZoomIn, ZoomOut, Rotate3d, Download } from "lucide-react";

export function SceneViewer({
  sceneUrl,
  engineType = "unity",
}: {
  sceneUrl: string;
  engineType: "unity" | "unreal";
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"view" | "code">("view");

  useEffect(() => {
    if (iframeRef.current) {
      setIsLoading(true);
      // Handle iframe loading event
      iframeRef.current.onload = () => {
        setIsLoading(false);
      };
    }
  }, [sceneUrl]);

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-xl">
          {engineType === "unity" ? "Unity" : "Unreal"} Scene Viewer
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "view" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("view")}
          >
            <Eye className="size-4 mr-2" />
            View
          </Button>
          <Button
            variant={viewMode === "code" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("code")}
          >
            <Code className="size-4 mr-2" />
            Code
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Skeleton className="w-full h-full" />
          </div>
        )}

        {viewMode === "view" ? (
          <div className="relative w-full h-full">
            <iframe
              ref={iframeRef}
              src={sceneUrl}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button size="sm" variant="secondary">
                <ZoomIn className="size-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <ZoomOut className="size-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <Rotate3d className="size-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <Download className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-black text-green-400 font-mono text-sm p-4 h-full overflow-auto">
            {/* Here you could show scene code, JSON structure, or other technical details */}
            <pre>{`// ${engineType.toUpperCase()} SCENE DATA
{
  "scene": "${sceneUrl.split("/").pop()}",
  "engine": "${engineType}",
  "version": "1.0.0",
  "objects": [
    { "id": "main-camera", "type": "Camera", "position": {"x": 0, "y": 1.5, "z": -10} },
    { "id": "directional-light", "type": "Light", "intensity": 1.2 },
    { "id": "player", "type": "Mesh", "model": "character.fbx" }
  ]
}
`}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
