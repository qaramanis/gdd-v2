"use client";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date-utils";
import { Gamepad2, Calendar, Clock, Users, Edit, Share } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GameHeaderProps {
  game: any;
}

export default function GameHeader({ game }: GameHeaderProps) {
  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 rounded-xl px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{game.name}</h1>
        <div className="flex gap-2">
          <Button size="sm" className="gap-2">
            <Edit className="size-4" />
            <div className="md:flex hidden">Edit</div>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative bg-primary/10 dark:bg-primary/20 rounded-lg w-36 h-36 flex items-center justify-center overflow-hidden">
          {game.image_url ? (
            <img
              src={game.image_url}
              alt={game.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Gamepad2 className="size-16 text-primary/60" />
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="md:max-w-[25%] max-w-full">
            <p className="text-sm text-muted-foreground">Concept</p>
            <p className="text-base">{game.concept || "No concept provided"}</p>
          </div>

          <div className="grid grid-rows-1 sm:grid-rows-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="text-sm font-medium">
                  {game.start_date ? formatDate(game.start_date) : "Not set"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Timeline</p>
                <p className="text-sm font-medium">{game.timeline}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Target Release Date
                </p>
                <p className="text-sm font-medium">
                  {game.release_date
                    ? formatDate(game.release_date)
                    : "Not set yet"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {game.game_platforms &&
              game.game_platforms.map((platform: any, index: number) => (
                <Badge key={index} variant="outline" className="capitalize">
                  {platform.platform.name}
                </Badge>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
