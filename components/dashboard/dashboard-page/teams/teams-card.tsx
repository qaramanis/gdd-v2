import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowRight, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import TeamItem from "./team-item";
import { Button } from "@/components/ui/button";
import { Team } from "../dashboard-page";

export default function TeamsCard({ teams }: { teams: Team[] }) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Teams</CardTitle>
        <CardDescription>Collaborate with your team members</CardDescription>
      </CardHeader>
      <CardContent>
        {teams.length > 0 ? (
          <div className="space-y-4">
            {teams.slice(0, 3).map((team) => (
              <TeamItem
                key={team.id}
                team={team}
                onClick={() => router.push(`/teams/${team.id}`)}
              />
            ))}
            {teams.length > 3 && (
              <Button
                variant="ghost"
                className="w-full justify-start text-xs"
                onClick={() => router.push("/teams")}
              >
                View all teams ({teams.length})
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <Users className="h-8 w-8 mx-auto text-accent mb-2" />
            <p className="text-sm text-accent">No teams yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
