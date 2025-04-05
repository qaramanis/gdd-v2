import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const NewDocumentPage = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedSections, setSelectedSections] = useState({
    overview: true,
    gameConcept: true,
    storyline: true,
    gameplay: true,
    levelDesign: true,
    assets: true,
    technical: true,
    ui: true,
    monetization: false,
    marketing: false,
    development: true,
    legal: false,
  });

  type Template = {
    id: string;
    name: string;
    icon: string;
    description: string;
  };

  const templates: Template[] = [
    {
      id: "rpg",
      name: "Role-Playing Game",
      icon: "🧙‍♂️",
      description:
        "Template optimized for RPGs with character progression systems and narrative focus",
    },
    {
      id: "fps",
      name: "First-Person Shooter",
      icon: "🎯",
      description:
        "Layout for FPS games with weapon systems and level structure",
    },
    {
      id: "puzzle",
      name: "Puzzle Game",
      icon: "🧩",
      description:
        "Framework for puzzle mechanics, difficulty progression, and UI",
    },
    {
      id: "strategy",
      name: "Strategy Game",
      icon: "♟️",
      description:
        "Template for turn-based or real-time strategy games with resource management",
    },
    {
      id: "platformer",
      name: "Platformer",
      icon: "🏃",
      description:
        "Structure for platformers with character movement and level design",
    },
    {
      id: "sandbox",
      name: "Open World/Sandbox",
      icon: "🌎",
      description:
        "Documentation framework for open-world exploration and systems",
    },
    {
      id: "blank",
      name: "Blank Document",
      icon: "📝",
      description:
        "Start with a clean slate and build your document from scratch",
    },
  ];

  const sectionGroups = [
    {
      name: "Core Design",
      sections: [
        {
          id: "overview",
          name: "Overview",
          description:
            "High-level understanding of the game's concept and target audience",
        },
        {
          id: "gameConcept",
          name: "Game Concept",
          description:
            "Core ideas and mechanics that form the foundation of the game",
        },
        {
          id: "storyline",
          name: "Storyline & Background",
          description:
            "Context and depth to the game world, setting the stage for the player's journey",
        },
        {
          id: "gameplay",
          name: "Gameplay Mechanics",
          description:
            "Interactive elements that players will engage with while playing",
        },
      ],
    },
    {
      name: "Content & Production",
      sections: [
        {
          id: "levelDesign",
          name: "Level Design",
          description:
            "Stages or levels with objectives, layouts, and progression curves",
        },
        {
          id: "assets",
          name: "Assets",
          description:
            "Visual, auditory, and other resources required to bring the game to life",
        },
        {
          id: "technical",
          name: "Technical Features",
          description:
            "Platforms, engine choice, networking requirements, and performance considerations",
        },
        {
          id: "ui",
          name: "User Interface (UI)",
          description:
            "How players interact with menus, HUDs, and other graphical elements",
        },
      ],
    },
    {
      name: "Business & Planning",
      sections: [
        {
          id: "monetization",
          name: "Monetization Strategy",
          description:
            "How the game will generate revenue through purchases, subscriptions, or ads",
        },
        {
          id: "marketing",
          name: "Marketing & Promotion",
          description: "Strategies for promoting the game to target audiences",
        },
        {
          id: "development",
          name: "Development Plan",
          description: "Timeline, milestones, tasks and resources required",
        },
        {
          id: "legal",
          name: "Legal & Compliance",
          description:
            "Legal requirements, regulations, and compliance considerations",
        },
      ],
    },
  ];

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

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
  };

  const toggleSection = (sectionId: any) => {
    setSelectedSections({
      ...selectedSections,
      [sectionId]: !selectedSections[sectionId],
    });
  };

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

  const countSelectedSections = () => {
    return Object.values(selectedSections).filter((value) => value).length;
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Create New Document</h1>
      </div>

      <div className="flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="info">Basic Info</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="theme">Visual Theme</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Choose a Template</h2>
              <p className="text-muted-foreground">
                Select a starting point based on your game type
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate?.id === template.id
                        ? "ring-2 ring-primary"
                        : ""
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="text-4xl mb-4">{template.icon}</div>
                        <h3 className="font-semibold text-lg">
                          {template.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          {template.description}
                        </p>
                        {selectedTemplate?.id === template.id && (
                          <div className="mt-4 bg-primary text-primary-foreground rounded-full py-1 px-3 text-xs font-medium">
                            Selected
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <Button onClick={handleNextTab} disabled={!selectedTemplate}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sections" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Document Sections</h2>
                  <p className="text-muted-foreground">
                    Select the sections you want to include in your document
                  </p>
                </div>
                <div className="text-sm bg-primary/10 py-1 px-3 rounded-full">
                  <span className="font-medium">{countSelectedSections()}</span>{" "}
                  sections selected
                </div>
              </div>

              <div className="space-y-6 mt-6">
                {sectionGroups.map((group) => (
                  <div key={group.name} className="space-y-3">
                    <h3 className="font-medium text-base text-muted-foreground">
                      {group.name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {group.sections.map((section) => (
                        <Card
                          key={section.id}
                          className={`cursor-pointer border transition-all ${
                            selectedSections[section.id]
                              ? "border-primary bg-primary/5"
                              : ""
                          }`}
                          onClick={() => toggleSection(section.id)}
                        >
                          <CardContent className="p-4 flex items-start">
                            <div
                              className={`w-5 h-5 rounded-full border flex-shrink-0 mr-3 mt-0.5 flex items-center justify-center ${
                                selectedSections[section.id]
                                  ? "bg-primary border-primary"
                                  : "border-input"
                              }`}
                            >
                              {selectedSections[section.id] && (
                                <Check className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">
                                {section.name}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {section.description}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePrevTab}>
                Back
              </Button>
              <Button onClick={handleNextTab}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">
                  Basic Project Information
                </h2>
                <p className="text-muted-foreground">
                  Enter essential details about your game project
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Game Title</label>
                    <Input placeholder="Enter your game's title" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      High-Level Concept (Elevator Pitch)
                    </label>
                    <textarea
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-24 focus:outline-none focus:ring-1 focus:ring-ring"
                      placeholder="A brief description of your game that captures its essence"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Team Members/Collaborators
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                      <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
                        Jane Smith{" "}
                        <Button variant="ghost" className="h-5 w-5 p-0 ml-1">
                          ×
                        </Button>
                      </div>
                      <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center">
                        John Doe{" "}
                        <Button variant="ghost" className="h-5 w-5 p-0 ml-1">
                          ×
                        </Button>
                      </div>
                      <Input
                        className="flex-1 min-w-24 h-8"
                        placeholder="Add team member..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Target Platforms
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="pc"
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="pc">PC</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="mobile"
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="mobile">Mobile</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="console"
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="console">Console</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="vr"
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="vr">VR/AR</label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Date</label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Estimated Timeline
                      </label>
                      <select className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring">
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
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePrevTab}>
                Back
              </Button>
              <Button onClick={handleNextTab}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="structure" className="mt-6">
            <div className="space-y-6">
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
                    className="cursor-pointer border hover:shadow-md transition-all"
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

              <div className="mt-8 space-y-4">
                <h3 className="font-semibold">Integration Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
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

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-primary/10">
                          <PenTool className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">
                            Asset Repository
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Connect to your project's asset management system
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
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

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePrevTab}>
                Back
              </Button>
              <Button onClick={handleNextTab}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="theme" className="mt-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Visual Theme</h2>
                <p className="text-muted-foreground">
                  Choose a visual style that reflects your game's aesthetic
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

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePrevTab}>
                Back
              </Button>
              <Button onClick={handleNextTab}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="review" className="mt-6">
            <div className="space-y-6">
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

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePrevTab}>
                Back
              </Button>
              <Button className="bg-black dark:bg-white dark:text-black text-white">
                Create Document
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NewDocumentPage;
