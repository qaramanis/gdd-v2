"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import TiltedCard from "../tilted-card";

export function Home() {
  // Sample document data
  const documents = [
    {
      id: 1,
      title: "Product Roadmap",
      date: "Edited 2 days ago",
      color: "bg-blue-500",
      textColor: "text-blue-500",
    },
    {
      id: 2,
      title: "Marketing Strategy",
      date: "Edited yesterday",
      color: "bg-purple-500",
      textColor: "text-purple-500",
    },
    {
      id: 3,
      title: "Design System",
      date: "Edited 5 days ago",
      color: "bg-green-500",
      textColor: "text-green-500",
    },
    {
      id: 4,
      title: "Financial Report",
      date: "Edited 1 week ago",
      color: "bg-amber-500",
      textColor: "text-amber-500",
    },
    {
      id: 5,
      title: "Team Onboarding",
      date: "Edited 3 days ago",
      color: "bg-red-500",
      textColor: "text-red-500",
    },
  ];

  // Create overlay content for each document
  const renderOverlayContent = (doc: {
    id?: number;
    title: any;
    date: any;
    color: any;
    textColor: any;
  }) => (
    <div className="w-full h-full flex flex-col p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[15px] shadow-sm">
      <div className={`h-1.5 w-full ${doc.color} rounded-sm mb-3`}></div>
      <div>
        <h3 className={`${doc.textColor} font-medium text-lg mb-1`}>
          {doc.title}
        </h3>
        <p className="text-sm text-muted-foreground">{doc.date}</p>
      </div>
      <div className="mt-auto flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Open
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Documents</h1>
        <Button
          variant="default"
          className="rounded-full gap-2 bg-black text-white dark:bg-white dark:text-black"
        >
          <Plus className="size-4" />
          New Document
        </Button>
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mx-8 my-10">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col transform hover:rotate-2 hover:scale-105 transition-transform"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm w-[180px]">
              <div className={`h-1 ${doc.color} rounded-t-lg`}></div>
              <div className="p-4">
                <h3 className={`${doc.textColor} font-medium mb-1`}>
                  {doc.title}
                </h3>
                <p className="text-sm text-muted-foreground">{doc.date}</p>
                <div className="mt-4">
                  <button className="text-xs text-muted-foreground hover:text-foreground">
                    Open
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* New Document Card */}
        <div className="flex flex-col transform hover:-rotate-2 hover:scale-105 transition-transform">
          <div className="bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg w-[180px]">
            <div className="p-4 flex flex-col items-center justify-center h-full">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-3 mb-3">
                <Plus className="size-4 text-muted-foreground" />
              </div>
              <p className="font-medium text-center">Create new document</p>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                Start from scratch
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
