"use client";

import {
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

interface NavUserProps {
  user: UserData;
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-white/5 data-[state=open]:text-white cursor-pointer hover:bg-white/5 transition-all duration-200"
            >
              <Avatar className="h-8 w-8 rounded-lg border border-white/10 shadow-lg shadow-violet-500/10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 text-white font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-white">
                  {user.name}
                </span>
                <span className="truncate text-xs text-gray-400">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-gray-400" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-[240px] rounded-lg bg-black/95 backdrop-blur-xl border border-white/10"
            side={isMobile ? "bottom" : "right"}
            sideOffset={8}
            align="end"
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg border border-white/10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 text-white font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-white">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-gray-400">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="hover:bg-white/10 focus:bg-white/10 cursor-pointer transition-colors">
                <Sparkles className="mr-2 h-4 w-4 text-violet-400" />
                <span className="text-white">Upgrade to Pro</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => router.push("/account")}
                className="hover:bg-white/10 focus:bg-white/10 cursor-pointer transition-colors"
              >
                <User className="mr-2 h-4 w-4 text-gray-400" />
                <span className="text-white">Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/billing")}
                className="hover:bg-white/10 focus:bg-white/10 cursor-pointer transition-colors"
              >
                <CreditCard className="mr-2 h-4 w-4 text-gray-400" />
                <span className="text-white">Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/notifications")}
                className="hover:bg-white/10 focus:bg-white/10 cursor-pointer transition-colors"
              >
                <Bell className="mr-2 h-4 w-4 text-gray-400" />
                <span className="text-white">Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4 text-red-400" />
              <span className="text-red-400">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
