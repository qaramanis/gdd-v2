"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Plus, Search, Mail, Trash2, UserPlus, UserCog } from "lucide-react";
import { useState } from "react";

interface GameTeamProps {
  gameId: number;
  team: any[];
}

export default function GameTeam({ gameId, team }: GameTeamProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // If the real team data is empty, use some dummy data for the demo
  const teamMembers =
    team.length > 0
      ? team
      : [
          {
            user: {
              id: 1,
              name: "Jane Smith",
              email: "jane@example.com",
              avatar_url: null,
            },
          },
          {
            user: {
              id: 2,
              name: "John Doe",
              email: "john@example.com",
              avatar_url: null,
            },
          },
          {
            user: {
              id: 3,
              name: "Alex Johnson",
              email: "alex@example.com",
              avatar_url: null,
            },
          },
          {
            user: {
              id: 4,
              name: "Sarah Williams",
              email: "sarah@example.com",
              avatar_url: null,
            },
          },
        ];

  const filteredTeam = teamMembers.filter(
    (member) =>
      member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Team Members</h2>
          <p className="text-sm text-muted-foreground">
            Manage collaborators for this game project
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button className="gap-2">
            <UserPlus className="size-4" />
            Invite Member
          </Button>
          <Button variant="outline" className="gap-2">
            <UserCog className="size-4" />
            Manage Roles
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
        <Input
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeam.map((member, index) => (
          <TeamMemberCard key={member.user.id || index} member={member.user} />
        ))}

        {/* Add member card */}
        <Card className="border-dashed hover:shadow-md hover:border-primary/50 transition-all cursor-pointer flex flex-col items-center justify-center">
          <CardContent className="py-8 flex flex-col items-center gap-2">
            <div className="p-3 rounded-full bg-primary/10">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <p className="font-medium">Add Team Member</p>
            <p className="text-xs text-muted-foreground text-center max-w-48">
              Invite a collaborator to work on this game design document
            </p>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-muted-foreground italic text-center">
        This section is for demonstration purposes only. Functionality is
        limited.
      </p>
    </div>
  );
}

interface TeamMemberCardProps {
  member: any;
}

function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={member.avatar_url || ""} alt={member.name} />
            <AvatarFallback>
              {member.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h3 className="font-medium">{member.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Mail className="size-3" />
              <span>{member.email}</span>
            </div>
            <div className="mt-2">
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                Editor
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-400"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
