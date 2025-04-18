"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Layers, Gamepad2, PenTool, Users, File } from "lucide-react";
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from "../local-storage";

interface StructureData {
  documentStructure: string;
  integrations: {
    engine: boolean;
    assets: boolean;
    collaboration: boolean;
  };
}

const defaultStructure: StructureData = {
  documentStructure: "comprehensive",
  integrations: {
    engine: false,
    assets: false,
    collaboration: false,
  },
};

const documentStructures = [
  {
    id: "comprehensive",
    name: "Single Comprehensive Document",
    description: "All sections in one cohesive document",
  },
  {
    id: "multipart",
    name: "Multi-part Documents",
    description: "Separate linked documents for different sections",
  },
  {
    id: "wiki",
    name: "Wiki-style with Cross-references",
    description: "Interconnected pages with rich cross-referencing",
  },
];

export default function Structure() {
  const [structureData, setStructureData] =
    useState<StructureData>(defaultStructure);

  useEffect(() => {
    const savedStructure = loadFromStorage<StructureData>(
      STORAGE_KEYS.STRUCTURE,
      defaultStructure
    );
    setStructureData(savedStructure);
  }, []);

  const updateStructure = (updates: Partial<StructureData>) => {
    const updatedStructure = { ...structureData, ...updates };
    setStructureData(updatedStructure);
    saveToStorage(STORAGE_KEYS.STRUCTURE, updatedStructure);
  };

  const toggleIntegration = (key: keyof StructureData["integrations"]) => {
    updateStructure({
      integrations: {
        ...structureData.integrations,
        [key]: !structureData.integrations[key],
      },
    });
  };

  return (
    <div className="space-y-4 w-full max-w-full py-4">
      <div>
        <h2 className="text-xl font-semibold">Document Structure</h2>
        <p className="text-muted-foreground">
          Choose how your documentation will be organized
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {documentStructures.map((structure) => (
          <Card
            key={structure.id}
            className={`cursor-pointer border hover:shadow-md transition-all ${
              structureData.documentStructure === structure.id
                ? "ring-2 ring-primary"
                : ""
            }`}
            onClick={() => updateStructure({ documentStructure: structure.id })}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                {structure.id === "comprehensive" && (
                  <FileText className="h-12 w-12 mb-4 text-primary" />
                )}
                {structure.id === "multipart" && (
                  <Layers className="h-12 w-12 mb-4 text-primary" />
                )}
                {structure.id === "wiki" && (
                  <File className="h-12 w-12 mb-4 text-primary" />
                )}
                <h3 className="font-semibold">{structure.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {structure.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className=" space-y-4">
        <h3 className="font-semibold">Integration Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className={`cursor-pointer ${
              structureData.integrations.engine ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => toggleIntegration("engine")}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <Gamepad2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">
                    Connect to Unity/Unreal
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Link documentation directly with your game project
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer ${
              structureData.integrations.assets ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => toggleIntegration("assets")}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <PenTool className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Asset Repository</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Connect to your project&apos;s asset management system
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer ${
              structureData.integrations.collaboration
                ? "ring-2 ring-primary"
                : ""
            }`}
            onClick={() => toggleIntegration("collaboration")}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">
                    Collaboration Settings
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Configure permissions and sharing options
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
