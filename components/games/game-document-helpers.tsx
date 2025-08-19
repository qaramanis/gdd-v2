import { supabase } from "@/database/supabase";
import React from "react";

// Type definitions
interface Game {
  id: string;
  name: string;
  user_id: string;
  team_id?: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
  concept?: string;
  start_date?: string;
  timeline?: string;
  sections?: string[];
  template?: string;
  platforms?: string[];
  release_date?: string;
}

interface GameDocument {
  id: string;
  game_id: string;
  title: string;
  user_id: string;
  team_id?: string;
  is_game_document: boolean;
  created_at: string;
  updated_at: string;
}

interface DocumentSection {
  id: string;
  document_id: string;
  title?: string;
  content?: string;
  order_index?: number;
  created_at: string;
  updated_at: string;
}

interface GameWithDocument {
  game: Game;
  document: GameDocument;
  sections: DocumentSection[];
}

/**
 * Fetch a game with its guaranteed document and sections
 * The database trigger ensures every game has a document
 */
export async function getGameWithDocument(
  gameId: string,
): Promise<GameWithDocument> {
  try {
    // Fetch game and its document in a single query using JOIN
    const { data, error } = await supabase
      .from("games")
      .select(
        `
        *,
        documents!documents_game_id_fkey (
          id,
          title,
          user_id,
          team_id,
          is_game_document,
          created_at,
          updated_at
        )
      `,
      )
      .eq("id", gameId)
      .eq("documents.is_game_document", true)
      .single();

    if (error) {
      throw new Error(`Failed to fetch game: ${error.message}`);
    }

    if (!data) {
      throw new Error("Game not found");
    }

    const game = data;
    const document = data.documents?.[0];

    if (!document) {
      throw new Error(
        "Game document not found - this should not happen with the database trigger",
      );
    }

    // Fetch document sections
    const { data: sections, error: sectionsError } = await supabase
      .from("document_sections")
      .select("*")
      .eq("document_id", document.id)
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: true });

    if (sectionsError) {
      console.warn("Failed to fetch document sections:", sectionsError.message);
    }

    return {
      game: {
        id: game.id,
        name: game.name,
        user_id: game.user_id,
        team_id: game.team_id,
        created_at: game.created_at,
        updated_at: game.updated_at,
        image_url: game.image_url,
        concept: game.concept,
        start_date: game.start_date,
        timeline: game.timeline,
        sections: game.sections,
        template: game.template,
        platforms: game.platforms,
        release_date: game.release_date,
      },
      document,
      sections: sections || [],
    };
  } catch (error) {
    console.error("Error fetching game with document:", error);
    throw error;
  }
}

/**
 * Get all games for a user with their documents
 */
export async function getUserGamesWithDocuments(
  userId: string,
  teamId?: string,
) {
  try {
    let query = supabase
      .from("games")
      .select(
        `
        *,
        documents!documents_game_id_fkey (
          id,
          title,
          is_game_document,
          created_at,
          updated_at
        )
      `,
      )
      .eq("user_id", userId)
      .eq("documents.is_game_document", true);

    if (teamId) {
      query = query.eq("team_id", teamId);
    }

    const { data, error } = await query.order("updated_at", {
      ascending: false,
    });

    if (error) {
      throw new Error(`Failed to fetch games: ${error.message}`);
    }

    return (
      data?.map((game) => ({
        game: {
          id: game.id,
          name: game.name,
          user_id: game.user_id,
          team_id: game.team_id,
          created_at: game.created_at,
          updated_at: game.updated_at,
          image_url: game.image_url,
          concept: game.concept,
          start_date: game.start_date,
          timeline: game.timeline,
          sections: game.sections,
          template: game.template,
          platforms: game.platforms,
          release_date: game.release_date,
        },
        document: game.documents?.[0] || null,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching user games:", error);
    throw error;
  }
}

/**
 * Update game document title (useful for renaming)
 */
export async function updateGameDocumentTitle(
  gameId: string,
  newTitle: string,
) {
  try {
    const { data, error } = await supabase
      .from("documents")
      .update({ title: newTitle })
      .eq("game_id", gameId)
      .eq("is_game_document", true)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update document title: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error updating document title:", error);
    throw error;
  }
}

/**
 * Check if a game has a document (for debugging)
 */
export async function verifyGameDocument(gameId: string) {
  try {
    const { data, error } = await supabase
      .from("documents")
      .select("id, title, is_game_document")
      .eq("game_id", gameId)
      .eq("is_game_document", true)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to verify game document: ${error.message}`);
    }

    return {
      hasDocument: !!data,
      document: data || null,
    };
  } catch (error) {
    console.error("Error verifying game document:", error);
    throw error;
  }
}

// React hook for easy component integration
export function useGameWithDocument(gameId: string | null) {
  const [data, setData] = React.useState<GameWithDocument | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!gameId) {
      setData(null);
      setError(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getGameWithDocument(gameId);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameId]);

  return {
    data,
    loading,
    error,
    refetch: () => gameId && getGameWithDocument(gameId),
  };
}
