"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check,
  ChevronRight,
  Clock,
  File,
  FileText,
  Gamepad2,
  Info,
  Layers,
  PenTool,
  Settings,
  Users,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Stepper, { Step } from "@/components/stepper";
import Templates from "./steps/templates";
import Sections from "./steps/sections";
import Information from "./steps/information";
import Structure from "./steps/structure";
import Summary from "./steps/summary";

const NewDocumentPage = () => {
  const [activeTab, setActiveTab] = useState("templates");

  const visualThemes = [
    {
      id: "classic",
      name: "Classic Professional",
      primary: "#3a86ff",
      secondary: "#8ecae6",
    },
    {
      id: "dark",
      name: "Dark Modern",
      primary: "#2a2a2a",
      secondary: "#7209b7",
    },
    {
      id: "retro",
      name: "Retro Pixel",
      primary: "#e63946",
      secondary: "#f77f00",
    },
    {
      id: "minimalist",
      name: "Minimalist",
      primary: "#f1faee",
      secondary: "#a8dadc",
    },
    {
      id: "fantasy",
      name: "Fantasy",
      primary: "#606c38",
      secondary: "#283618",
    },
    { id: "scifi", name: "Sci-Fi", primary: "#073b4c", secondary: "#118ab2" },
  ];

  const handleNextTab = () => {
    if (activeTab === "templates") setActiveTab("sections");
    else if (activeTab === "sections") setActiveTab("info");
    else if (activeTab === "info") setActiveTab("structure");
    else if (activeTab === "structure") setActiveTab("theme");
    else if (activeTab === "theme") setActiveTab("review");
  };

  const handlePrevTab = () => {
    if (activeTab === "sections") setActiveTab("templates");
    else if (activeTab === "info") setActiveTab("sections");
    else if (activeTab === "structure") setActiveTab("info");
    else if (activeTab === "theme") setActiveTab("structure");
    else if (activeTab === "review") setActiveTab("theme");
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Create New Document</h1>
      </div>

      <div className="flex flex-col w-full">
        <Stepper
          initialStep={1}
          onStepChange={(step) => console.log(`Step changed to ${step}`)}
          onFinalStepCompleted={() =>
            console.log("Document creation completed")
          }
          className="w-full min-w-full"
          stepContainerClassName="justify-center w-full"
          contentClassName="w-full"
          footerClassName="w-full"
        >
          <Step>
            <Templates />
          </Step>

          <Step>
            <Sections />
          </Step>

          <Step>
            <Information />
          </Step>

          <Step>
            <Structure />
          </Step>

          <Step>
            <div className="space-y-4 w-full max-w-full">
              <div>
                <h2 className="text-xl font-semibold">Visual Theme</h2>
                <p className="text-muted-foreground">
                  Choose a visual style that reflects your game&apos;s aesthetic
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {visualThemes.map((theme) => (
                  <Card
                    key={theme.id}
                    className="cursor-pointer overflow-hidden hover:shadow-md transition-all"
                    style={{ borderColor: theme.primary }}
                  >
                    <div
                      className="h-2"
                      style={{ backgroundColor: theme.primary }}
                    ></div>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="flex gap-2 mb-4">
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: theme.primary }}
                          ></div>
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: theme.secondary }}
                          ></div>
                        </div>
                        <h3 className="font-semibold">{theme.name}</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          A {theme.name.toLowerCase()} style for your
                          documentation
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="font-semibold">Typography Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="cursor-pointer">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Clean Sans</h3>
                      <p
                        className="text-sm"
                        style={{ fontFamily: "var(--font-geist-sans)" }}
                      >
                        A modern, readable sans-serif font perfect for clean
                        documentation
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Technical Mono</h3>
                      <p
                        className="text-sm"
                        style={{ fontFamily: "var(--font-geist-mono)" }}
                      >
                        A monospaced font ideal for technical documentation
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">Elegant Serif</h3>
                      <p className="text-sm" style={{ fontFamily: "serif" }}>
                        A classic serif font for a more traditional document
                        feel
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </Step>

          <Step>
            <Summary />
          </Step>
        </Stepper>
      </div>
    </div>
  );
};

export default NewDocumentPage;
