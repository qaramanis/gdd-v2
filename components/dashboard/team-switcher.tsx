"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface Team {
  name: string;
  logo: React.ComponentType<{ className?: string }>;
  plan: string;
}

interface TeamSwitcherProps {
  teams: Team[];
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-foreground/5 data-[state=open]:text-foreground cursor-pointer hover:bg-foreground/5 transition-all duration-200"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg shadow-violet-500/20">
                <activeTeam.logo className="size-4 text-foreground" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-foreground">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs text-gray-400">
                  {activeTeam.plan}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto text-gray-400" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-[240px] rounded-lg bg-background/95 backdrop-blur-xl border border-foreground/10"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider">
              Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2 hover:bg-foreground/10 focus:bg-foreground/10 cursor-pointer transition-colors"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border border-foreground/20 bg-gradient-to-br from-violet-500/20 to-pink-500/20">
                  <team.logo className="size-4 shrink-0 text-foreground" />
                </div>
                <span className="flex-1 text-foreground">{team.name}</span>
                <DropdownMenuShortcut className="text-gray-500">
                  ⌘{index + 1}
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-foreground/10" />
            <DropdownMenuItem className="gap-2 p-2 hover:bg-foreground/10 focus:bg-foreground/10 cursor-pointer transition-colors">
              <div className="flex size-6 items-center justify-center rounded-md border border-foreground/20 bg-foreground/5">
                <Plus className="size-4 text-gray-400" />
              </div>
              <div className="font-medium text-gray-400">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
