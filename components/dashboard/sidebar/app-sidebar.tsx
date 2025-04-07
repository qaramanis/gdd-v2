"use client";

import * as React from "react";
import {
  AudioWaveform,
  Users,
  Settings,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { DocumentSwitcher } from "@/components/document-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NewDocument } from "@/components/new-document-button";
import { HomeButton } from "@/components/home-button";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  docs: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "Scene Viewer",
          url: "playground",
        },
        {
          title: "Starred Scenes",
          url: "playground/starred",
        },
        {
          title: "Palyground Settings",
          url: "playground/settings",
        },
      ],
    },
    {
      title: "Teams",
      url: "",
      icon: Users,
      items: [
        {
          title: "All Teams",
          url: "/teams",
        },
        {
          title: "Teams Settings",
          url: "/teams/settings",
        },
      ],
    },
    {
      title: "Settings",
      url: "",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/settings",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="mt-2">
      <SidebarHeader>
        <DocumentSwitcher docs={data.docs} />
      </SidebarHeader>
      <NewDocument />
      <HomeButton />
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
