"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Information() {
  return (
    <div className="space-y-4 w-full max-w-full">
      <div>
        <h2 className="text-xl font-semibold">Basic Project Information</h2>
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
            <label className="text-sm font-medium">Target Platforms</label>
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
              <label className="text-sm font-medium">Estimated Timeline</label>
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
  );
}
