"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Settings, Users, Clock, Info, PenTool } from "lucide-react";

export default function Summary() {
  return (
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
                    <h3 className="font-semibold text-lg">Untitled Project</h3>
                    <p className="text-sm text-muted-foreground">
                      Using {selectedTemplate?.name || "Custom"} template
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
                  {Object.entries(selectedSections).map(([key, value]) => {
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
                  })}
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
                    Your document will be created with the selected template and
                    sections.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm">
                    Collaborators will receive an invitation to join this
                    document.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <PenTool className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm">
                    You can edit and customize all aspects of your document
                    after creation.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
