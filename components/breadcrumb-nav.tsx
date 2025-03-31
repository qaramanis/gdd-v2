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
import { capitalize } from "@/lib/utils";
import React from "react";

interface BreadcrumbItem {
  href: string;
  text: string;
  isLastItem: boolean;
}

export function BreadcrumbNav() {
  const pathname = usePathname();
  const isHomePage = pathname === "/home";
  const hideFromBreadcrumbs = ["/dashboard"];
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (pathname === "/" || isHomePage) return [];
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    segments.forEach((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      if (hideFromBreadcrumbs.includes(href)) return;
      const text = capitalize(segment.replace(/-/g, " "));
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

  if (isHomePage) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.length > 0 && (
          <>
            <BreadcrumbSeparator></BreadcrumbSeparator>

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
