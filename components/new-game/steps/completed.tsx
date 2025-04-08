// components/new-game/steps/completed.tsx
"use client";

import { motion } from "framer-motion";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadFromStorage, STORAGE_KEYS, clearFormData } from "../local-storage";
import { supabase } from "@/database/supabase";

// Define types for the data stored in localStorage
interface Template {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface SectionSelection {
  [key: string]: boolean;
}

interface GameInfo {
  gameTitle: string;
  concept: string;
  teamMembers: string[];
  platforms: {
    pc: boolean;
    mobile: boolean;
    console: boolean;
    vr: boolean;
  };
  startDate: string;
  timeline: string;
}

interface StructureData {
  documentStructure: string;
  integrations: {
    engine: boolean;
    assets: boolean;
    collaboration: boolean;
  };
}

interface ThemeData {
  visualTheme: string;
  typography: string;
}

interface CheckmarkProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay: i * 0.2,
        type: "spring",
        duration: 1.5,
        bounce: 0.2,
        ease: "easeInOut",
      },
      opacity: { delay: i * 0.2, duration: 0.2 },
    },
  }),
};

function Checkmark({
  size = 100,
  strokeWidth = 2,
  color = "currentColor",
  className = "",
}: CheckmarkProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      initial="hidden"
      animate="visible"
      className={className}
    >
      <title>Animated Checkmark</title>
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        stroke={color}
        variants={draw}
        custom={0}
        style={{
          strokeWidth,
          strokeLinecap: "round",
          fill: "transparent",
        }}
      />
      <motion.path
        d="M30 50L45 65L70 35"
        stroke={color}
        variants={draw}
        custom={1}
        style={{
          strokeWidth,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "transparent",
        }}
      />
    </motion.svg>
  );
}

export default function DocumentCreated() {
  const [savedStatus, setSavedStatus] = useState<"saving" | "saved" | "error">(
    "saving"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function saveGameToDatabase() {
      try {
        const template = loadFromStorage<Template | null>(
          STORAGE_KEYS.TEMPLATE,
          null
        );
        const sections = loadFromStorage<SectionSelection>(
          STORAGE_KEYS.SECTIONS,
          {}
        );
        const info = loadFromStorage<GameInfo>(STORAGE_KEYS.INFO, {
          gameTitle: "",
          concept: "",
          teamMembers: [],
          platforms: { pc: false, mobile: false, console: false, vr: false },
          startDate: "",
          timeline: "",
        });
        const structure = loadFromStorage<StructureData>(
          STORAGE_KEYS.STRUCTURE,
          {
            documentStructure: "comprehensive",
            integrations: {
              engine: false,
              assets: false,
              collaboration: false,
            },
          }
        );
        const theme = loadFromStorage<ThemeData>(STORAGE_KEYS.THEME, {
          visualTheme: "Classic Professional",
          typography: "sans",
        });

        // Get template data
        const { data: templateDataArray, error: templateError } = await supabase
          .from("templates")
          .select("id")
          .eq("name", template?.name || "Blank Document")
          .limit(1);

        if (templateError) {
          setSavedStatus("error");
          setErrorMessage(`Template lookup failed: ${templateError.message}`);
          return;
        }

        if (!templateDataArray || templateDataArray.length === 0) {
          setSavedStatus("error");
          setErrorMessage("Template not found");
          return;
        }

        const templateData = templateDataArray[0];

        // Get structure data
        const { data: structureDataArray, error: structureError } =
          await supabase
            .from("document_structures")
            .select("id")
            .eq("name", structure.documentStructure || "comprehensive")
            .limit(1);

        if (structureError) {
          setSavedStatus("error");
          setErrorMessage(
            `Document structure lookup failed: ${structureError.message}`
          );
          return;
        }

        if (!structureDataArray || structureDataArray.length === 0) {
          setSavedStatus("error");
          setErrorMessage("Document structure not found");
          return;
        }

        const structureData = structureDataArray[0];

        const { data: themeDataArray, error: themeError } = await supabase
          .from("visual_themes")
          .select("id")
          .eq("name", theme.visualTheme)
          .limit(1);

        if (themeError) {
          setSavedStatus("error");
          setErrorMessage(`Visual theme lookup failed: ${themeError.message}`);
          return;
        }

        if (!themeDataArray || themeDataArray.length === 0) {
          setSavedStatus("error");
          setErrorMessage(`Theme not found: ${theme.visualTheme}`);
          return;
        }

        const themeData = themeDataArray[0];

        // Get typography data
        const { data: typographyDataArray, error: typographyError } =
          await supabase
            .from("typography_options")
            .select("id")
            .eq("name", theme.typography || "sans")
            .limit(1);

        if (typographyError) {
          setSavedStatus("error");
          setErrorMessage(
            `Typography lookup failed: ${typographyError.message}`
          );
          return;
        }

        if (!typographyDataArray || typographyDataArray.length === 0) {
          setSavedStatus("error");
          setErrorMessage("Typography option not found");
          return;
        }

        const typographyData = typographyDataArray[0];

        // Create game
        const { data: gameDataArray, error: gameError } = await supabase
          .from("games")
          .insert([
            {
              title: info.gameTitle || "Untitled Game",
              concept: info.concept || "",
              template_id: templateData.id,
              document_structure_id: structureData.id,
              visual_theme_id: themeData.id,
              typography_id: typographyData.id,
              start_date:
                info.startDate || new Date().toISOString().split("T")[0],
              timeline: info.timeline || "6 months",
              image_url: "/game-placeholder.jpg", // Default placeholder image
            },
          ])
          .select();

        if (gameError) {
          setSavedStatus("error");
          setErrorMessage(`Game creation failed: ${gameError.message}`);
          return;
        }

        if (!gameDataArray || gameDataArray.length === 0) {
          setSavedStatus("error");
          setErrorMessage("Game created but no data returned");
          return;
        }

        const gameData = gameDataArray[0];

        // Process team members (now users)
        if (info.teamMembers && info.teamMembers.length > 0) {
          for (const member of info.teamMembers) {
            // Check if user exists
            const { data: existingUserArray, error: userLookupError } =
              await supabase
                .from("users")
                .select("id")
                .eq("name", member)
                .limit(1);

            if (userLookupError) {
              console.warn(`User lookup warning: ${userLookupError.message}`);
              // Continue with creation instead of failing
            }

            let userId;
            if (!existingUserArray || existingUserArray.length === 0) {
              // Create new user
              const { data: newUserArray, error: createUserError } =
                await supabase
                  .from("users")
                  .insert([{ name: member }])
                  .select();

              if (createUserError) {
                console.error(
                  `User creation error: ${createUserError.message}`
                );
                continue; // Skip this user but continue with others
              }

              if (!newUserArray || newUserArray.length === 0) {
                console.error("User created but no data returned");
                continue; // Skip this user but continue with others
              }

              userId = newUserArray[0].id;
            } else {
              userId = existingUserArray[0].id;
            }

            // Link user to game
            const { error: linkUserError } = await supabase
              .from("game_users")
              .insert([
                {
                  game_id: gameData.id,
                  user_id: userId,
                },
              ]);

            if (linkUserError) {
              console.error(`User linking error: ${linkUserError.message}`);
              // Continue with other users instead of failing completely
            }
          }
        }

        // Process platforms
        if (info.platforms) {
          const platformNames = Object.entries(info.platforms)
            .filter(([_, isSelected]) => isSelected)
            .map(([name, _]) => name);

          for (const platform of platformNames) {
            const { data: platformDataArray, error: platformError } =
              await supabase
                .from("platform_types")
                .select("id")
                .eq("name", platform)
                .limit(1);

            if (platformError) {
              console.error(`Platform lookup error: ${platformError.message}`);
              continue;
            }

            if (!platformDataArray || platformDataArray.length === 0) {
              console.error(`Platform "${platform}" not found`);
              continue;
            }

            const platformData = platformDataArray[0];

            const { error: linkPlatformError } = await supabase
              .from("game_platforms")
              .insert([
                {
                  game_id: gameData.id,
                  platform_id: platformData.id,
                },
              ]);

            if (linkPlatformError) {
              console.error(
                `Platform linking error: ${linkPlatformError.message}`
              );
            }
          }
        }

        if (sections) {
          const selectedSections = Object.entries(sections)
            .filter(([_, isSelected]) => isSelected)
            .map(([name, _]) => name);

          for (const [index, sectionName] of selectedSections.entries()) {
            const { data: sectionDataArray, error: sectionError } =
              await supabase
                .from("sections")
                .select("id")
                .eq("name", sectionName)
                .limit(1);

            if (sectionError) {
              console.error(`Section lookup error: ${sectionError.message}`);
              continue;
            }

            if (!sectionDataArray || sectionDataArray.length === 0) {
              console.error(`Section "${sectionName}" not found`);
              continue;
            }

            const sectionData = sectionDataArray[0];

            const { error: linkSectionError } = await supabase
              .from("game_sections")
              .insert([
                {
                  game_id: gameData.id,
                  section_id: sectionData.id,
                  is_included: true,
                  section_order: index,
                },
              ]);

            if (linkSectionError) {
              console.error(
                `Section linking error: ${linkSectionError.message}`
              );
            }
          }
        }

        if (structure.integrations) {
          const enabledIntegrations = Object.entries(structure.integrations)
            .filter(([_, isEnabled]) => isEnabled)
            .map(([name, _]) => name);

          for (const integration of enabledIntegrations) {
            const { data: integrationDataArray, error: integrationError } =
              await supabase
                .from("integrations")
                .select("id")
                .eq("name", integration)
                .limit(1);

            if (integrationError) {
              console.error(
                `Integration lookup error: ${integrationError.message}`
              );
              continue;
            }

            if (!integrationDataArray || integrationDataArray.length === 0) {
              console.error(`Integration "${integration}" not found`);
              continue;
            }

            const integrationData = integrationDataArray[0];

            const { error: linkIntegrationError } = await supabase
              .from("game_integrations")
              .insert([
                {
                  game_id: gameData.id,
                  integration_id: integrationData.id,
                  is_enabled: true,
                },
              ]);

            if (linkIntegrationError) {
              console.error(
                `Integration linking error: ${linkIntegrationError.message}`
              );
              // Continue with other integrations instead of failing completely
            }
          }
        }

        console.log("Game saved successfully:", gameData);
        setSavedStatus("saved");
        clearFormData();
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
          <Link href="/home">
            {savedStatus === "saved" ? "View Game Page" : "Back to Home"}
          </Link>
        </Button>
      )}
    </div>
  );
}
