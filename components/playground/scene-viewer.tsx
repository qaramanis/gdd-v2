"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Code,
  ZoomIn,
  ZoomOut,
  Rotate3d,
  Download,
  Upload,
} from "lucide-react";

export function SceneViewer({
  sceneUrl,
  engineType = "unity",
  onUpload,
}: {
  sceneUrl: string | null;
  engineType: "unity" | "unreal";
  onUpload?: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"view" | "code">("view");

  useEffect(() => {
    if (iframeRef.current && sceneUrl) {
      setIsLoading(true);
      iframeRef.current.onload = () => {
        setIsLoading(false);
      };
    }
  }, [sceneUrl]);

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-800/30 rounded-lg p-8">
      <div className="text-center max-w-md">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No scene selected
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Select a scene from the sidebar or upload a new {engineType} scene to
          get started.
        </p>
        <Button onClick={onUpload} className="mt-2">
          <Upload className="mr-2 h-4 w-4" />
          Upload Scene
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <CardTitle className="text-xl">
          {engineType === "unity" ? "Unity" : "Unreal"} Scene Viewer
        </CardTitle>
        {sceneUrl && (
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
        )}
      </CardHeader>
      <CardContent className="p-0 flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Skeleton className="w-full h-full" />
          </div>
        )}

        {!sceneUrl ? (
          renderEmptyState()
        ) : viewMode === "view" ? (
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
            {/* Scene code view */}
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
