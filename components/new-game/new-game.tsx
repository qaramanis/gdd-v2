"use client";

import React, { useState } from "react";

import Stepper, { Step } from "@/components/stepper";
import Templates from "./steps/templates";
import Sections from "./steps/sections";
import Information from "./steps/information";
import Structure from "./steps/structure";
import Summary from "./steps/summary";
import VisualThemes from "./steps/visual-theme";

const NewDocumentPage = () => {
  const [activeTab, setActiveTab] = useState("templates");



  const handleNextTab = () => {
    if (activeTab === "templates") setActiveTab("sections");
    else if (activeTab === "sections") setActiveTab("info");
    else if (activeTab === "info") setActiveTab("structure");
    else if (activeTab === "structure") setActiveTab("theme");
    else if (activeTab === "theme") setActiveTab("review");
  };

  const handlePrevTab = () => {
    if (activeTab === "sections") setActiveTab("templates");
    else if (activeTab === "info") setActiveTab("sections");
    else if (activeTab === "structure") setActiveTab("info");
    else if (activeTab === "theme") setActiveTab("structure");
    else if (activeTab === "review") setActiveTab("theme");
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Create New Document</h1>
      </div>

      <div className="flex flex-col w-full">
        <Stepper
          initialStep={1}
          onStepChange={(step) => console.log(`Step changed to ${step}`)}
          onFinalStepCompleted={() =>
            console.log("Document creation completed")
          }
          className="w-full min-w-full"
          stepContainerClassName="justify-center w-full"
          contentClassName="w-full"
          footerClassName="w-full"
        >
          <Step>
            <Templates />
          </Step>

          <Step>
            <Sections />
          </Step>

          <Step>
            <Information />
          </Step>

          <Step>
            <Structure />
          </Step>

          <Step>
            <VisualThemes />
          </Step>

          <Step>
            <Summary />
          </Step>
        </Stepper>
      </div>
    </div>
  );
};

export default NewDocumentPage;
