import { createGame } from "@/lib/data/games";
import { createDocument, createDocumentSections } from "@/lib/data/documents";

interface GameData {
  name: string;
  concept: string;
  startDate?: string;
  timeline?: string;
  platforms?: string[];
  documentSections?: string[];
}

const SECTION_DETAILS = {
  overview: "Game Overview",
  gameplay: "Gameplay Mechanics",
  story: "Story & World",
  characters: "Characters",
  levels: "Level Design",
  art: "Art Direction",
  audio: "Audio Design",
  ui: "User Interface",
  technical: "Technical Specs",
  monetization: "Monetization",
  marketing: "Marketing",
  schedule: "Development Schedule",
};

export async function createGameWithDocument(
  gameData: GameData,
  userId: string
) {
  try {
    // First, create the game
    const game = await createGame(
      {
        name: gameData.name || "Untitled Game",
        concept: gameData.concept || "",
        startDate:
          gameData.startDate || new Date().toISOString().split("T")[0],
        timeline: gameData.timeline || "6 months",
        platforms: gameData.platforms || [],
        sections: gameData.documentSections || [],
        imageUrl: "/game-placeholder.jpg",
      },
      userId
    );

    if (!game) {
      return { success: false, error: "No game data returned" };
    }

    // Create the document
    const document = await createDocument({
      gameId: game.id,
      title: `${gameData.name} - Game Design Document`,
      userId,
      isGameDocument: true,
    });

    if (!document) {
      // Don't fail completely if document creation fails
      return {
        success: true,
        gameId: game.id,
        warning: "Document creation failed",
      };
    }

    // Create document sections if document was created successfully
    if (
      document &&
      gameData.documentSections &&
      gameData.documentSections.length > 0
    ) {
      const sections = gameData.documentSections.map((sectionId, index) => ({
        documentId: document.id,
        title:
          SECTION_DETAILS[sectionId as keyof typeof SECTION_DETAILS] ||
          sectionId,
        content: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 1 },
              content: [
                {
                  type: "text",
                  text:
                    SECTION_DETAILS[
                      sectionId as keyof typeof SECTION_DETAILS
                    ] || sectionId,
                },
              ],
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Start documenting this section...",
                },
              ],
            },
          ],
        },
        orderIndex: index,
      }));

      try {
        await createDocumentSections(sections);
      } catch (sectionsError) {
        console.error("Error creating sections:", sectionsError);
        // Don't fail completely if sections creation fails
      }
    }

    return { success: true, gameId: game.id };
  } catch (error: any) {
    console.error("Unexpected error in createGameWithDocument:", error);
    return {
      success: false,
      error: error.message || "Unexpected error occurred",
    };
  }
}
