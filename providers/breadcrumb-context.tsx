"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface BreadcrumbOverride {
  path: string;
  title: string;
}

interface BreadcrumbContextType {
  overrides: BreadcrumbOverride[];
  setOverride: (path: string, title: string) => void;
  clearOverride: (path: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined,
);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<BreadcrumbOverride[]>([]);

  const setOverride = (path: string, title: string) => {
    setOverrides((prev) => {
      const filtered = prev.filter((o) => o.path !== path);
      return [...filtered, { path, title }];
    });
  };

  const clearOverride = (path: string) => {
    setOverrides((prev) => prev.filter((o) => o.path !== path));
  };

  return (
    <BreadcrumbContext.Provider
      value={{ overrides, setOverride, clearOverride }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    // Return a no-op implementation if context is not available
    return {
      overrides: [],
      setOverride: () => {},
      clearOverride: () => {},
    };
  }
  return context;
};
