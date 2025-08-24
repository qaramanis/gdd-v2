"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGameCreation } from "../game-creation-context";
import { useUser } from "@/providers/user-context";
import { createGameWithDocument } from "@/lib/game-creation";

// Animated checkmark component
const Checkmark = ({ color }: { color: string }) => (
  <motion.svg
    className="size-24"
    fill="none"
    viewBox="0 0 24 24"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    <motion.circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
    <motion.path
      d="M7 12l3 3 7-7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
    />
  </motion.svg>
);

export default function GameCreated() {
  const { gameData, clearGameData } = useGameCreation();
  const { userId } = useUser();
  const [savedStatus, setSavedStatus] = useState<"saving" | "saved" | "error">(
    "saving",
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [gameId, setGameId] = useState<string>("");

  useEffect(() => {
    async function saveGame() {
      if (!userId) {
        setSavedStatus("error");
        setErrorMessage("You must be logged in to create a game");
        return;
      }

      try {
        const result = await createGameWithDocument(gameData, userId);

        if (result.success && result.gameId) {
          setGameId(result.gameId);
          setSavedStatus("saved");
          clearGameData();
        } else {
          setSavedStatus("error");
          setErrorMessage(result.error || "Failed to create game");
        }
      } catch (error: any) {
        console.error("Error creating game:", error);
        setSavedStatus("error");
        setErrorMessage(error.message || "Failed to create game");
      }
    }

    saveGame();
  }, []);

  return (
    <div className="pt-6 flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {savedStatus === "saved" ? (
          <Checkmark color="#1E92FF" />
        ) : savedStatus === "error" ? (
          <motion.div
            className="bg-red-100 dark:bg-red-900/30 flex items-center justify-center rounded-full size-24"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <span className="text-red-500 text-4xl">!</span>
          </motion.div>
        ) : (
          <motion.div
            className="size-24 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="size-12 border-4 border-t-primary border-r-primary/30 border-b-primary/10 border-l-primary/60 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </div>

      <CardHeader className="w-full">
        <CardTitle className="font-medium text-center text-2xl">
          {savedStatus === "saved"
            ? "Your game has been created!"
            : savedStatus === "error"
              ? "Error creating game"
              : "Creating your game..."}
        </CardTitle>
        <CardDescription className="text-base text-center">
          {savedStatus === "saved" ? (
            "Your game and design document have been set up successfully"
          ) : savedStatus === "error" ? (
            <>
              {errorMessage || "There was an error creating your game"}
              <p className="mt-2">Please try again later</p>
            </>
          ) : (
            "Setting up your game and document structure..."
          )}
        </CardDescription>
      </CardHeader>

      {(savedStatus === "saved" || savedStatus === "error") && (
        <Button asChild className="rounded-full">
          <Link
            href={
              savedStatus === "saved" && gameId ? `/games/${gameId}` : "/games"
            }
          >
            {savedStatus === "saved" ? "View Game" : "Back to Games"}
          </Link>
        </Button>
      )}
    </div>
  );
}
