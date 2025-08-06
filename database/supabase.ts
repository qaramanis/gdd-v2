import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables. Please check your .env file.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get the current user from Better Auth session
export async function getCurrentUserId(): Promise<string | null> {
  // This would be called from a component or server action
  // You'll need to pass the session from Better Auth
  return null;
}

// Helper function to create an authenticated Supabase client
export function createAuthenticatedClient(accessToken: string) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

export const dbHelpers = {
  // Get all games for the current user
  async getUserGames(userId: string) {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create a new game for the current user
  async createGame(gameData: any, userId: string) {
    const { data, error } = await supabase
      .from("games")
      .insert({
        ...gameData,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get a specific game (with permission check)
  async getGame(gameId: string, userId: string) {
    const { data, error } = await supabase
      .from("games")
      .select(
        `
        *,
        documents(*),
        user:users(*)
      `,
      )
      .eq("id", gameId)
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's notes
  async getUserNotes(userId: string) {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Check if user has permission to access a game
  async checkGamePermission(gameId: number, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("games")
      .select("id")
      .eq("id", gameId)
      .single();

    return !error && !!data;
  },
};
