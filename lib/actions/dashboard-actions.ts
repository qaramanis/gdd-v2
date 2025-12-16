"use server";

import { getUserGames } from "@/lib/data/games";
import { getUserDocuments, getDocumentSections } from "@/lib/data/documents";
import { getUserNotes } from "@/lib/data/notes";
import { getTeamsByUser, getUserActivityLog } from "@/lib/data/collaboration";

export interface DashboardData {
  games: any[];
  documents: any[];
  teams: any[];
  notes: any[];
  activities: any[];
  documentSections: any[];
  stats: {
    totalGames: number;
    totalDocuments: number;
    totalTeams: number;
    totalNotes: number;
    documentSections: number;
    recentActivities: number;
  };
}

export async function fetchDashboardData(userId: string): Promise<DashboardData> {
  try {
    // Fetch games
    const gamesData = await getUserGames(userId);

    // Fetch documents
    const documentsData = await getUserDocuments(userId);

    // Fetch document sections
    let sectionsData: any[] = [];
    if (documentsData && documentsData.length > 0) {
      const allSections = await Promise.all(
        documentsData.map((doc) => getDocumentSections(doc.id))
      );
      sectionsData = allSections.flat();
    }

    // Fetch teams
    const teamsData = await getTeamsByUser(userId);

    // Fetch notes
    const notesData = await getUserNotes(userId, 5);

    // Fetch activity logs
    const activitiesData = await getUserActivityLog(userId, 10);

    // Transform data to match expected interface
    const transformedGames = gamesData.map((g) => ({
      id: g.id,
      name: g.name,
      concept: g.concept || "",
      image_url: g.imageUrl || undefined,
      created_at: g.createdAt?.toISOString() || "",
      updated_at: g.updatedAt?.toISOString() || "",
      platforms: g.platforms || [],
    }));

    const transformedDocuments = documentsData.map((d) => ({
      id: d.id,
      title: d.title,
      game_id: d.gameId,
      created_at: d.createdAt?.toISOString() || "",
      updated_at: d.updatedAt?.toISOString() || "",
      is_game_document: d.isGameDocument,
    }));

    const transformedSections = sectionsData.map((s) => ({
      id: s.id,
      document_id: s.documentId,
      title: s.title,
      order: s.orderIndex,
      created_at: s.createdAt?.toISOString() || "",
      updated_at: s.updatedAt?.toISOString() || "",
    }));

    const transformedTeams = teamsData.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description || undefined,
      created_at: t.createdAt?.toISOString() || "",
    }));

    const transformedNotes = notesData.map((n) => ({
      id: n.id,
      title: n.title || "Untitled",
      content: n.content || "",
      created_at: n.createdAt?.toISOString() || "",
      updated_at: n.updatedAt?.toISOString() || "",
    }));

    const transformedActivities = activitiesData.map((a) => ({
      id: a.id,
      user_id: a.userId,
      action: a.action,
      entity_type: a.gameId ? "game" : a.documentId ? "document" : "unknown",
      entity_id: a.gameId || a.documentId || "",
      created_at: a.createdAt?.toISOString() || "",
      metadata: a.details,
    }));

    return {
      games: transformedGames,
      documents: transformedDocuments,
      teams: transformedTeams,
      notes: transformedNotes,
      activities: transformedActivities,
      documentSections: transformedSections,
      stats: {
        totalGames: transformedGames.length,
        totalDocuments: transformedDocuments.length,
        totalTeams: transformedTeams.length,
        totalNotes: transformedNotes.length,
        documentSections: transformedSections.length,
        recentActivities: transformedActivities.length,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      games: [],
      documents: [],
      teams: [],
      notes: [],
      activities: [],
      documentSections: [],
      stats: {
        totalGames: 0,
        totalDocuments: 0,
        totalTeams: 0,
        totalNotes: 0,
        documentSections: 0,
        recentActivities: 0,
      },
    };
  }
}
