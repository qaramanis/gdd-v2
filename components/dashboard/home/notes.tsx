"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, Trash2, Plus } from "lucide-react";
import Link from "next/link";

interface Note {
  id: string;
  content: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([
    { id: "1", content: "Update character movement mechanics" },
    { id: "2", content: "Schedule meeting with art team" },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const handleSave = () => {
    if (editingId) {
      setNotes(
        notes.map((note) =>
          note.id === editingId ? { ...note, content: editContent } : note
        )
      );
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      const newNote = {
        id: Date.now().toString(),
        content: newNoteContent,
      };
      setNotes([...notes, newNote]);
      setNewNoteContent("");
      setIsAddingNote(false);
    }
  };

  return (
    <div className="bg-primary/5 p-6 rounded-lg dark:bg-gray-900/60 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <Link href="/notes" className="text-xl font-bold">
          Personal Notes
        </Link>
        {!isAddingNote && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingNote(true)}
            className="text-xs"
          >
            <Plus className="size-4 mr-1" />
            Add Note
          </Button>
        )}
      </div>

      {isAddingNote && (
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Enter new note..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="text-sm"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleAddNote}
            className="shrink-0"
          >
            <Save className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsAddingNote(false);
              setNewNoteContent("");
            }}
            className="shrink-0"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      )}

      <div className="space-y-2 overflow-y-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-3 bg-white dark:bg-gray-800 rounded-md flex justify-between items-center group"
          >
            {editingId === note.id ? (
              <Input
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="flex-1 mr-2 text-sm"
              />
            ) : (
              <p className="text-sm flex-1">{note.content}</p>
            )}
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {editingId === note.id ? (
                <Button size="sm" variant="ghost" onClick={handleSave}>
                  <Save className="size-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(note)}
                >
                  <Edit2 className="size-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(note.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}

        {notes.length === 0 && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            No notes yet. Add a note to get started.
          </div>
        )}
      </div>
    </div>
  );
}
