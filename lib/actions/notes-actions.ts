"use server";

import { getUserNotes, createNote, updateNote, deleteNote } from "@/lib/data/notes";

export async function fetchUserNotes(userId: string, limit?: number) {
  try {
    const notes = await getUserNotes(userId, limit);
    return notes.map((n) => ({
      id: n.id,
      title: n.title || "Untitled",
      content: n.content || "",
      tags: n.tags || [],
      game: n.game || null,
      createdAt: n.createdAt?.toISOString() || "",
      updatedAt: n.updatedAt?.toISOString() || "",
    }));
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

export async function createNewNote(userId: string, data: { title?: string; content?: string; tags?: string[]; game?: string }) {
  try {
    const note = await createNote({ ...data, userId });
    return { success: true, note };
  } catch (error) {
    console.error("Error creating note:", error);
    return { success: false, error: "Failed to create note" };
  }
}

export async function updateExistingNote(noteId: string, userId: string, data: { title?: string; content?: string; tags?: string[]; game?: string }) {
  try {
    const note = await updateNote(noteId, userId, data);
    return { success: true, note };
  } catch (error) {
    console.error("Error updating note:", error);
    return { success: false, error: "Failed to update note" };
  }
}

export async function deleteExistingNote(noteId: string, userId: string) {
  try {
    await deleteNote(noteId, userId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting note:", error);
    return { success: false, error: "Failed to delete note" };
  }
}
