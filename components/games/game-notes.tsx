"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface GameDocumentProps {
  game: any;
}

export default function GameDocument({ game }: GameDocumentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Game Design Document</h2>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="" />
            Notes for {game.name}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
