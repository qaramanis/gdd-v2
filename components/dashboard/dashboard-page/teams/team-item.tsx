import { Users, Badge } from "lucide-react";
import { Team } from "../dashboard-page";

export default function TeamItem({
  team,
  onClick,
}: {
  team: Team;
  onClick: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className="p-1.5 bg-primary/10 rounded">
          <Users className="h-3 w-3" />
        </div>
        <div>
          <p className="text-sm font-medium">{team.name}</p>
          <p className="text-xs text-muted-foreground">
            {team.member_count} members
          </p>
        </div>
      </div>
      <Badge className="text-xs">Active</Badge>
    </div>
  );
}
