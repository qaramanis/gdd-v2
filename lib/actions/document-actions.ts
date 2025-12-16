"use server";

import {
  getDocumentsByGame,
  getDocumentSections,
  createDocumentSection,
  createDocumentSections,
  updateDocumentSection,
  deleteDocumentSection,
  createDocument,
} from "@/lib/data/documents";
import { getGameForUser, updateGame } from "@/lib/data/games";

export async function fetchGameWithDocument(gameId: string, userId: string) {
  try {
    const game = await getGameForUser(gameId, userId);
    if (!game) return { game: null, document: null, sections: [] };

    const documents = await getDocumentsByGame(gameId);
    const document = documents[0] || null;

    let sections: any[] = [];
    if (document) {
      const sectionData = await getDocumentSections(document.id);
      sections = sectionData.map((s) => ({
        id: s.id,
        documentId: s.documentId,
        title: s.title,
        content: s.content,
        orderIndex: s.orderIndex,
        createdAt: s.createdAt?.toISOString() || "",
        updatedAt: s.updatedAt?.toISOString() || "",
      }));
    }

    return {
      game: {
        id: game.id,
        name: game.name,
        concept: game.concept,
      },
      document: document ? {
        id: document.id,
        title: document.title,
        gameId: document.gameId,
      } : null,
      sections,
    };
  } catch (error) {
    console.error("Error fetching game with document:", error);
    return { game: null, document: null, sections: [] };
  }
}

export async function createSection(data: { documentId: string; title: string; content?: any; orderIndex?: number }) {
  try {
    const section = await createDocumentSection(data);
    return {
      success: true,
      section: {
        id: section.id,
        documentId: section.documentId,
        title: section.title,
        content: section.content,
        orderIndex: section.orderIndex,
        createdAt: section.createdAt?.toISOString() || "",
        updatedAt: section.updatedAt?.toISOString() || "",
      },
    };
  } catch (error) {
    console.error("Error creating section:", error);
    return { success: false, error: "Failed to create section" };
  }
}

export async function updateSection(sectionId: string, data: { content?: any; title?: string; orderIndex?: number }) {
  try {
    const section = await updateDocumentSection(sectionId, data);
    return { success: true, section };
  } catch (error) {
    console.error("Error updating section:", error);
    return { success: false, error: "Failed to update section" };
  }
}

export async function deleteSection(sectionId: string) {
  try {
    await deleteDocumentSection(sectionId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting section:", error);
    return { success: false, error: "Failed to delete section" };
  }
}

export async function createNewDocument(
  gameId: string,
  userId: string,
  data: {
    title: string;
    concept?: string;
    sections: { title: string; content: string; orderIndex: number }[];
  }
) {
  try {
    // Update game concept if provided
    if (data.concept !== undefined) {
      await updateGame(gameId, userId, { concept: data.concept });
    }

    // Create the document
    const document = await createDocument({
      gameId,
      title: data.title,
      userId,
    });

    // Create document sections
    if (data.sections.length > 0) {
      await createDocumentSections(
        data.sections.map((s) => ({
          documentId: document.id,
          title: s.title,
          content: s.content,
          orderIndex: s.orderIndex,
        }))
      );
    }

    return { success: true, documentId: document.id };
  } catch (error) {
    console.error("Error creating document:", error);
    return { success: false, error: "Failed to create document" };
  }
}
