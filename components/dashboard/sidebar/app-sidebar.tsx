"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
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
import { NewDocument } from "@/components/new-document";
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
          title: "History",
          url: "playground/history",
        },
        {
          title: "Starred",
          url: "playground/starred",
        },
        {
          title: "Settings",
          url: "playground/settings",
        },
      ],
    },
    {
      title: "Models",
      url: "",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "/dashboard/models/genesis",
        },
        {
          title: "Explorer",
          url: "/dashboard/models/explorer",
        },
        {
          title: "Quantum",
          url: "/dashboard/models/quantum",
        },
      ],
    },
    {
      title: "Documentation",
      url: "",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "documentation/introduction",
        },
        {
          title: "Get Started",
          url: "/documentation/getting-started",
        },
        {
          title: "Tutorials",
          url: "/documentation/tutorials",
        },
        {
          title: "Changelog",
          url: "/documentation/changelog",
        },
      ],
    },
    {
      title: "Settings",
      url: "",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
        {
          title: "Billing",
          url: "/settings/billing",
        },
        {
          title: "Limits",
          url: "/settings/limits",
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
