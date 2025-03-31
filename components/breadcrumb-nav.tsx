"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { capitalize } from "@/lib/utils";
import React from "react";

interface BreadcrumbItem {
  href: string;
  text: string;
  isLastItem: boolean;
}

export function BreadcrumbNav() {
  const pathname = usePathname();

  // Special case for home page
  const isHomePage = pathname === "/dashboard/home";

  // Skip paths we don't want to show in breadcrumbs
  const hideFromBreadcrumbs = ["/dashboard"];

  // Generate breadcrumb items from the pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (pathname === "/" || isHomePage) return [];

    // Split the pathname into segments and remove empty strings
    const segments = pathname.split("/").filter(Boolean);

    // Create breadcrumb items for each segment
    const breadcrumbs: BreadcrumbItem[] = [];

    segments.forEach((segment, index) => {
      // Build the href for this breadcrumb
      const href = `/${segments.slice(0, index + 1).join("/")}`;

      // Skip paths that should be hidden
      if (hideFromBreadcrumbs.includes(href)) return;

      // Format the segment text (capitalize, replace hyphens with spaces)
      const text = capitalize(segment.replace(/-/g, " "));

      // Determine if this is the last segment (current page)
      const isLastItem = index === segments.length - 1;

      breadcrumbs.push({
        href,
        text,
        isLastItem,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Home is a special case - just show "Home" without any additional breadcrumbs
  if (isHomePage) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>
              <Home className="w-4 h-4 mr-1 inline" />
              Home
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Always show home as first breadcrumb */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard/home">
            <Home className="w-4 h-4 mr-1 inline" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        {/* Only show separator and additional breadcrumbs if we have them */}
        {breadcrumbs.length > 0 && (
          <>
            <BreadcrumbSeparator></BreadcrumbSeparator>

            {/* Render the rest of the breadcrumbs */}
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                <BreadcrumbItem>
                  {crumb.isLastItem ? (
                    <BreadcrumbPage>{crumb.text}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.text}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>

                {/* Add separators between items but not after the last one */}
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator>/</BreadcrumbSeparator>
                )}
              </React.Fragment>
            ))}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
