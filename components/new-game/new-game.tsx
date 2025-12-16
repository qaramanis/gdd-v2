"use client";

import React from "react";
import Stepper, { Step } from "@/components/stepper";
import GameInformation from "./steps/game-information";
import DocumentSections from "./steps/document-sections";
import Summary from "./steps/summary";
import GameCreated from "./steps/game-created";

const NewGamePage = () => {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Create New Game</h1>
      </div>

      {/*<div className="flex flex-col w-full">
        <Stepper
          initialStep={1}
          className="w-full min-w-full"
          stepContainerClassName="justify-center w-full"
          contentClassName="w-full"
          footerClassName="w-full"
        >
          <Step>
            <GameInformation />
          </Step>

          <Step>
            <DocumentSections />
          </Step>

          <Step>
            <Summary />
          </Step>

          <Step>
            <GameCreated />
          </Step>
        </Stepper>
      </div>*/}
    </div>
  );
};

export default NewGamePage;
