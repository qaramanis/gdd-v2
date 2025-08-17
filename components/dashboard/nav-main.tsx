"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  badge?: string;
  items?: {
    title: string;
    url: string;
  }[];
}

interface NavMainProps {
  items: NavItem[];
  currentPath: string;
  title: string;
}

export function NavMain({ items, currentPath, title }: NavMainProps) {
  const router = useRouter();

  const isActive = (url: string) => {
    return currentPath === url || currentPath.startsWith(url + "/");
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;
          const active = isActive(item.url);

          if (!hasSubItems) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => router.push(item.url)}
                  className={cn(
                    "cursor-pointer",
                    active && "bg-background text-foreground",
                  )}
                >
                  {item.icon && (
                    <div className="flex size-6 items-center justify-center rounded-sm border border-foreground/10 bg-gradient-to-br from-violet-500/50 to-pink-500/50">
                      <item.icon className="size-4 shrink-0 text-foreground" />
                    </div>
                  )}
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full bg-gradient-to-br from-violet-500 to-pink-500">
                      {item.badge}
                    </span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={active}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => item.url && router.push(item.url)}
                    className={cn(
                      "cursor-pointer",
                      active && "bg-background text-foreground",
                    )}
                  >
                    {item.icon && (
                      <div className="flex size-6 items-center justify-center rounded-sm border border-foreground/10 bg-gradient-to-br from-violet-500/50 to-pink-500/50">
                        <item.icon className="size-4 shrink-0 text-foreground" />
                      </div>
                    )}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          onClick={() => router.push(subItem.url)}
                          className={cn(
                            "cursor-pointer",
                            isActive(subItem.url) &&
                              "bg-background text-foreground",
                          )}
                        >
                          <div>
                            <span>{subItem.title}</span>
                          </div>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
