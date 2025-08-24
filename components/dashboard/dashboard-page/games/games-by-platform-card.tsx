import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gamepad2, Badge } from "lucide-react";
import { Game } from "../dashboard-page";

export default function GamesByPlatformCard({ games }: { games: Game[] }) {
  if (games.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Games by Platform</CardTitle>
          <CardDescription>Distribution of your games</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Gamepad2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No games yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const platformCounts = games.reduce(
    (acc, game) => {
      if (game.platforms) {
        game.platforms.forEach((platform) => {
          acc[platform] = (acc[platform] || 0) + 1;
        });
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const unsetPlatformCount = games.filter(
    (g) => !g.platforms || g.platforms.length === 0,
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Games by Platform</CardTitle>
        <CardDescription>Distribution of your games</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(platformCounts).map(([platform, count]) => (
            <div key={platform} className="flex items-center justify-between">
              <span className="text-sm">{platform}</span>
              <Badge>{count}</Badge>
            </div>
          ))}
          {unsetPlatformCount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                No platform set
              </span>
              <Badge>{unsetPlatformCount}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
