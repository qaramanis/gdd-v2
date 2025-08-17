import * as React from "react";
import { Plus } from "lucide-react";

import { DatePicker } from "@/components/date-picker";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth/auth-client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const userData = {
    user: {
      name: session?.user?.name || "User",
      email: session?.user?.email || "user@example.com",
      avatar: session?.user?.image || "/avatars/default.jpg",
    },
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border border-b">
        <NavUser user={userData.user} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        {/* <SidebarSeparator className="mx-0" /> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
