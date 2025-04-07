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
            <div className="space-y-4 w-full max-w-full">
              <div>
                <h2 className="text-xl font-semibold">Review Your Document</h2>
                <p className="text-muted-foreground">
                  Review your selections before creating your document
                </p>
              </div>

              <div className="mt-6 space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Document Summary</CardTitle>
                      <Button variant="ghost" className="text-xs" size="sm">
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="text-4xl">
                            {selectedTemplate?.icon || "📝"}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              Untitled Project
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Using {selectedTemplate?.name || "Custom"}{" "}
                              template
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Settings className="h-4 w-4" />
                            <span>Structure</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Single Comprehensive Document
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Users className="h-4 w-4" />
                            <span>Collaborators</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            2 team members
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Clock className="h-4 w-4" />
                            <span>Timeline</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            6 months (starts today)
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Included Sections ({countSelectedSections()})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(selectedSections).map(
                            ([key, value]) => {
                              if (!value) return null;
                              const sectionName = sectionGroups
                                .flatMap((g) => g.sections)
                                .find((s) => s.id === key)?.name;
                              return (
                                <div
                                  key={key}
                                  className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs"
                                >
                                  {sectionName}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Info className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm">
                            Your document will be created with the selected
                            template and sections.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm">
                            Collaborators will receive an invitation to join
                            this document.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <PenTool className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm">
                            You can edit and customize all aspects of your
                            document after creation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Step>
        </Stepper>
      </div>
    </div>
  );
};

export default NewDocumentPage;
