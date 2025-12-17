"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function Playground() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Engine Playground</h1>
        <Button>
          <Upload className="mr-2 size-4" />
          Upload Scene
        </Button>
      </div>

      <div className="flex gap-4 h-[calc(100vh-12rem)]">
        <div className="w-64 bg-white rounded-xl p-4 border"> 
          {/*scene selector*/}
        </div>

        <div className="w-full bg-white rounded-xl p-4 border">
          {/*scene viewer*/}
        </div>
      </div>
    </div>
  );
}
