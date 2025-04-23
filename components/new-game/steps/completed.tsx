// components/new-game/steps/completed.tsx
"use client";

import { motion } from "framer-motion";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadFromStorage, STORAGE_KEYS, clearFormData } from "../local-storage";
import { supabase } from "@/database/supabase";
import CheckmarkFactory from "@/components/checkmark";
import { sectionGroups } from "./sections";

interface SectionSelection {
  [key: string]: boolean;
}

interface GameInfo {
  gameTitle: string;
  concept: string;
  platforms: {
    pc: boolean;
    mobile: boolean;
    console: boolean;
    vr: boolean;
  };
  startDate: string;
  timeline: string;
}

interface ThemeData {
  visualTheme: string;
  typography: string;
}

const Checkmark = CheckmarkFactory();

export default function DocumentCreated() {
  const [savedStatus, setSavedStatus] = useState<"saving" | "saved" | "error">(
    "saving"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gameId, setGameId] = useState<number | null>(null);

  useEffect(() => {
    async function saveGameToDatabase() {
      try {
        const sections = loadFromStorage<SectionSelection>(
          STORAGE_KEYS.SECTIONS,
          {}
        );
        const info = loadFromStorage<GameInfo>(STORAGE_KEYS.INFO, {
          gameTitle: "",
          concept: "",
          platforms: { pc: false, mobile: false, console: false, vr: false },
          startDate: "",
          timeline: "",
        });
        const theme = loadFromStorage<ThemeData>(STORAGE_KEYS.THEME, {
          visualTheme: "Classic Professional",
          typography: "sans",
        });

        let platformsArray: string[] = [];
        if (info.platforms) {
          platformsArray = Object.entries(info.platforms)
            .filter(([_, isSelected]) => isSelected)
            .map(([name, _]) => name);
        }

        let sectionsArray: string[] = [];
        if (sections) {
          sectionsArray = Object.entries(sections)
            .filter(([_, isSelected]) => isSelected)
            .map(([name, _]) => name);
        }

        const { data: gameData, error: gameError } = await supabase
          .from("games")
          .insert([
            {
              name: info.gameTitle || "Untitled Game",
              concept: info.concept || "",
              start_date:
                info.startDate || new Date().toISOString().split("T")[0],
              timeline: info.timeline || "6 months",
              image_url: "/game-placeholder.jpg",
              platforms: platformsArray,
              sections: sectionsArray,
            },
          ])
          .select();

        if (gameData && gameData.length > 0) {
          console.log("Game saved successfully:", gameData[0]);
          setGameId(gameData[0].id);

          // Create document structure based on selected sections
          try {
            const gameId = gameData[0].id;

            // First create the document
            const { data: documentData, error: documentError } = await supabase
              .from("documents")
              .insert({
                game_id: gameId,
                title: `${gameData[0].name} - Design Document`,
              })
              .select();

            if (documentError) throw documentError;

            // Now create document sections based on the selected sections
            if (documentData && documentData.length > 0) {
              const documentId = documentData[0].id;

              // Get the sections from the stored template
              const savedSections = loadFromStorage<SectionSelection>(
                STORAGE_KEYS.SECTIONS,
                {}
              );

              const sectionsToCreate = Object.entries(savedSections)
                .filter(([_, isSelected]) => isSelected)
                .map(([sectionId, _], index) => {
                  // Get the section name from the section ID
                  const section = sectionGroups
                    .flatMap((group) => group.sections)
                    .find((section) => section.id === sectionId);

                  return {
                    document_id: documentId,
                    title: section?.name || sectionId,
                    order: index,
                    content: "",
                  };
                });

              if (sectionsToCreate.length > 0) {
                const { error: sectionsError } = await supabase
                  .from("document_sections")
                  .insert(sectionsToCreate);

                if (sectionsError) {
                  console.error(
                    "Error creating document sections:",
                    sectionsError
                  );
                }
              }
            }
          } catch (error) {
            console.error("Error creating document:", error);
            // Don't fail the game creation if document creation fails
            // Just log the error
          }

          setSavedStatus("saved");
          clearFormData();
          return;
        }

        if (gameError) {
          if (
            gameError.message.includes(
              "duplicate key value violates unique constraint"
            )
          ) {
            const { data: checkData, error: checkError } = await supabase
              .from("games")
              .select("id")
              .eq("name", info.gameTitle || "Untitled Game")
              .order("created_at", { ascending: false })
              .limit(1);

            if (checkData && checkData.length > 0) {
              console.log(
                "Game was actually created despite error:",
                checkData[0]
              );
              setGameId(checkData[0].id);
              setSavedStatus("saved");
              clearFormData();
              return;
            }
          }

          setSavedStatus("error");
          setErrorMessage(`Game creation failed: ${gameError.message}`);
          return;
        }

        setSavedStatus("error");
        setErrorMessage("Game creation failed with no specific error");
      } catch (error: any) {
        console.error("Error saving game to database:", error);
        setSavedStatus("error");
        setErrorMessage(error.message || "Failed to save game data");
      }
    }

    saveGameToDatabase();
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
        <motion.div
          className={`absolute inset-0 blur-xl rounded-full ${
            savedStatus === "error"
              ? "bg-red-500/10"
              : "bg-[#1E92FF]/10 dark:bg-[#1E92FF]/10"
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: "easeOut",
          }}
        />
      </div>
      <CardHeader className="w-full">
        <CardTitle className="font-medium text-center text-2xl">
          {savedStatus === "saved"
            ? "Your game has been created"
            : savedStatus === "error"
            ? "Error creating game"
            : "Creating your game..."}
        </CardTitle>
        <CardDescription className="text-base text-black/60 text-center dark:text-white/60 tracking-tight">
          {savedStatus === "saved" ? (
            "View and edit your game details and its documentation from the game page"
          ) : savedStatus === "error" ? (
            <>
              {errorMessage || "There was an error creating your game"}
              <p className="mt-2">Please try again later</p>
            </>
          ) : (
            "Saving your game data..."
          )}
        </CardDescription>
      </CardHeader>

      {(savedStatus === "saved" || savedStatus === "error") && (
        <Button asChild className="rounded-full">
          <Link
            href={
              savedStatus === "saved" && gameId ? `/games/${gameId}` : "/home"
            }
          >
            {savedStatus === "saved" ? "View Game Page" : "Back to Home"}
          </Link>
        </Button>
      )}
    </div>
  );
}
