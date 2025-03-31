"use client";

import * as React from "react";
import { Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function HomeButton() {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;
  const router = useRouter();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className="m-2 w-auto transition-all cursor-pointer justify-start group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center"
          onClick={() => router.push("/dashboard/home")}
        >
          <Home size={16} className={isCollapsed ? "" : "mr-2"} />
          {!isCollapsed && <span>Home</span>}
        </Button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
      >
        Home
      </TooltipContent>
    </Tooltip>
  );
}
