"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function NewDocument() {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-auto justify-between m-2 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center transition-all cursor-pointer",
            "bg-black/80 hover:bg-black/70",
            "dark:bg-gray-300 dark:hover:bg-gray-400 text-white",
            "[&>svg]:text-white dark:[&>svg]:text-black"
          )}
        >
          {!isCollapsed && (
            <span className="flex text-white dark:text-black items-center group-data-[collapsible=icon]:hidden">
              <span>New Document</span>
            </span>
          )}
          <Plus size={16} className={isCollapsed ? "mx-auto" : ""} />
        </Button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
      >
        New Document
      </TooltipContent>
    </Tooltip>
  );
}
