"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Link,
  Eye,
  Star,
  Upload,
  PlusSquare,
  ExternalLink,
  Square,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface GameScenesProps {
  gameId: number;
}

// Dummy data for demonstration
const DUMMY_SCENES = [
  {
    id: 1,
    name: "Main Level",
    description: "Primary game environment with player spawn",
    thumbnail: "/demo/unity/scene-1.jpg",
    isStarred: true,
    lastUpdate: "2025-03-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Character Controller",
    description: "Test scene for character movement and animations",
    thumbnail: "/demo/unity/scene-2.jpg",
    isStarred: false,
    lastUpdate: "2025-04-01T14:45:00Z",
  },
  {
    id: 3,
    name: "Combat Arena",
    description: "Environment for testing combat mechanics",
    thumbnail: "/demo/unreal/scene-1.jpg",
    isStarred: true,
    lastUpdate: "2025-04-10T09:15:00Z",
  },
];

export default function GameScenes({ gameId }: GameScenesProps) {
  const router = useRouter();
  const [scenes] = useState(DUMMY_SCENES);
  const [engineFilter, setEngineFilter] = useState<"all" | "unity" | "unreal">(
    "all",
  );

  const handleViewScene = (sceneId: number) => {
    // Redirect to the playground with the specific scene
    router.push(`/playground?scene=${sceneId}&game=${gameId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Game Scenes</h2>
          <p className="text-sm text-accent">View and manage you scenes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            onView={() => handleViewScene(scene.id)}
          />
        ))}

        {/* Add scene card */}
        <Card className="border-dashed hover:shadow-md hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center">
          <CardContent className="py-8 flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-primary/10">
              <PlusSquare className="h-6 w-6 text-primary" />
            </div>
            <p className="font-medium">Add New Scene</p>
            <p className="text-xs text-accent text-center max-w-48">
              Upload or link a new Unity or Unreal Engine scene
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary/10 dark:bg-primary/10 rounded-lg p-6 mt-2">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0">
            <Square className="h-12 w-12 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium mb-1">Scene Integration</h3>
            <p className="text-sm text-accent">
              Upload your game scenes directly from Unity or Unreal Engine using
              our plugin. Connect your document elements directly to scene
              objects for seamless workflow.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Button className="gap-2">
              <ExternalLink className="size-4" />
              Get Plugin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SceneCardProps {
  scene: any;
  onView: () => void;
}

function SceneCard({ scene, onView }: SceneCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-40 bg-muted">
        {/* Scene thumbnail */}
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Square className="h-12 w-12 text-accent" />
        </div>

        {/* Star indicator */}
        {scene.isStarred && (
          <div className="absolute top-2 right-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          </div>
        )}

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={onView}
            className="gap-2"
          >
            <Eye className="size-4" />
            View Scene
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-medium">{scene.name}</h3>
        <p className="text-sm text-accent mt-1 line-clamp-2">
          {scene.description}
        </p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-accent">
            Updated: {new Date(scene.lastUpdate).toLocaleDateString()}
          </span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Star
              className={`size-4 ${
                scene.isStarred ? "fill-yellow-400 text-yellow-400" : ""
              }`}
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
