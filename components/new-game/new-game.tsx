"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Stepper, { Step } from "@/components/stepper";
import Templates from "./steps/templates";
import Sections from "./steps/sections";
import Information from "./steps/information";
import Structure from "./steps/structure";
import Summary from "./steps/summary";
import VisualThemes from "./steps/visual-theme";
import DocumentCreated from "./steps/completed";

const NewDocumentPage = () => {
  const handleFinalStepCompleted = () => {
    console.log("Final step completed - proceeding to document creation");
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
          onFinalStepCompleted={handleFinalStepCompleted}
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

          <Step>
            <DocumentCreated />
          </Step>
        </Stepper>
      </div>
    </div>
  );
};

export default NewDocumentPage;
