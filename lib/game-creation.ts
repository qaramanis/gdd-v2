import { supabase } from "@/database/supabase";

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
  userId: string,
) {
  try {
    // First, create the game
    const { data: gameResult, error: gameError } = await supabase
      .from("games")
      .insert({
        name: gameData.name || "Untitled Game",
        concept: gameData.concept || "",
        start_date:
          gameData.startDate || new Date().toISOString().split("T")[0],
        timeline: gameData.timeline || "6 months",
        platforms: gameData.platforms || [],
        sections: gameData.documentSections || [],
        user_id: userId,
        image_url: "/game-placeholder.jpg",
      })
      .select()
      .single();

    if (gameError) {
      console.error("Error creating game:", gameError);
      return { success: false, error: gameError.message };
    }

    if (!gameResult) {
      return { success: false, error: "No game data returned" };
    }

    // Create the document
    const { data: documentResult, error: documentError } = await supabase
      .from("documents")
      .insert({
        game_id: gameResult.id,
        title: `${gameData.name} - Game Design Document`,
        user_id: userId,
        is_game_document: true,
      })
      .select()
      .single();

    if (documentError) {
      console.error("Error creating document:", documentError);
      // Don't fail completely if document creation fails
      return {
        success: true,
        gameId: gameResult.id,
        warning: "Document creation failed",
      };
    }

    // Create document sections if document was created successfully
    if (
      documentResult &&
      gameData.documentSections &&
      gameData.documentSections.length > 0
    ) {
      const sections = gameData.documentSections.map((sectionId, index) => ({
        document_id: documentResult.id,
        title:
          SECTION_DETAILS[sectionId as keyof typeof SECTION_DETAILS] ||
          sectionId,
        content: JSON.stringify({
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
        }),
        order: index,
      }));

      const { error: sectionsError } = await supabase
        .from("document_sections")
        .insert(sections);

      if (sectionsError) {
        console.error("Error creating sections:", sectionsError);
        // Don't fail completely if sections creation fails
      }
    }

    return { success: true, gameId: gameResult.id };
  } catch (error: any) {
    console.error("Unexpected error in createGameWithDocument:", error);
    return {
      success: false,
      error: error.message || "Unexpected error occurred",
    };
  }
}
