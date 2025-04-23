"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface Section {
  id: string;
  title: string;
  content?: string;
  order?: number;
}

interface SectionNavigatorProps {
  sections: Section[];
  activeSection?: string;
  onSelectSection: (sectionId: string) => void;
  onAddSection?: (parentId?: string) => void;
  onEditSectionTitle?: (section: Section) => void;
  onDeleteSection?: (sectionId: string) => void;
  isEditable?: boolean;
}

export default function SectionNavigator({
  sections,
  activeSection,
  onSelectSection,
  onAddSection,
  onEditSectionTitle,
  onDeleteSection,
  isEditable = false,
}: SectionNavigatorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleSectionClick = (e: React.MouseEvent, sectionId: string) => {
    e.stopPropagation();
    onSelectSection(sectionId);
  };

  const renderSection = (section: Section, depth = 0) => {
    const isExpanded = expandedSections.has(section.id);
    const isActive = section.id === activeSection;

    return (
      <div key={section.id} className="w-full">
        <div
          className={cn(
            "flex items-center py-1.5 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
            isActive && "bg-gray-100 dark:bg-gray-800 font-medium"
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={(e) => handleSectionClick(e, section.id)}
        >
          <span className="truncate flex-1">{section.title}</span>

          {isEditable && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEditSectionTitle && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditSectionTitle(section);
                  }}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              )}
              {onDeleteSection && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0.5 text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      confirm(
                        `Are you sure you want to delete "${section.title}"?`
                      )
                    ) {
                      onDeleteSection(section.id);
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-64 border-r h-full overflow-auto">
      <div className="p-3">
        <h3 className="font-medium mb-2">Document Sections</h3>

        {sections.map((section) => renderSection(section))}

        {isEditable && onAddSection && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={() => onAddSection()}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Add section
          </Button>
        )}
      </div>
    </div>
  );
}
