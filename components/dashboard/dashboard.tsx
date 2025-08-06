"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  AudioWaveform,
  Bot,
  Calendar,
  GalleryVerticalEnd,
  Home,
  Inbox,
  NotebookPen,
  Play,
  Search,
  Settings2,
  Users2,
} from "lucide-react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import { TeamSwitcher } from "@/components/dashboard/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/lib/auth-client";

const data = {
  teams: [
    {
      name: "Personal Workspace",
      logo: GalleryVerticalEnd,
      plan: "Free",
    },
    {
      name: "Game Studio",
      logo: AudioWaveform,
      plan: "Pro",
    },
  ],
  overview: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Games",
      url: "#",
      icon: GalleryVerticalEnd,
      items: [
        {
          title: "All Games",
          url: "/games",
        },
        {
          title: "New Game",
          url: "/new",
        },
      ],
    },
    {
      title: "Playground",
      url: "#",
      icon: Play,
      items: [
        {
          title: "Scene Viewer",
          url: "/playground",
        },
      ],
    },
    {
      title: "Notes",
      url: "/notes",
      icon: NotebookPen,
    },
    {
      title: "Teams",
      url: "/teams",
      icon: Users2,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
  quickActions: [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
      badge: "3",
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user || {
    name: "Guest User",
    email: "guest@example.com",
    avatar: "/avatars/default.jpg",
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="bg-background">
            <TeamSwitcher teams={data.teams} />
          </SidebarHeader>

          <SidebarContent className="bg-background">
            <Separator className="bg-foreground sticky top-0" />
            <NavMain
              items={data.overview}
              currentPath={pathname}
              title="Overview"
            />
            <Separator className="bg-foreground" />
            <NavMain
              items={data.quickActions}
              currentPath={pathname}
              title="Quick Actions"
            />
          </SidebarContent>
          <Separator className="bg-foreground sticky top-0" />
          <SidebarFooter className="bg-background">
            <NavUser user={user} />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-none bg-background px-6">
            <SidebarTrigger className="-ml-2" />
            <Separator orientation="vertical" className="h-6" />

            {/* You can add breadcrumbs here later */}
            <div className="flex-1">{/* Breadcrumb placeholder */}</div>

            {/* Header actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bot className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-muted/10">
            <div className="container mx-auto p-6">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
