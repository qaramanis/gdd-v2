// components/dashboard/notes/notes-page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, Save, Trash2, Plus, Search, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/database/supabase";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tags: string[];
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);

        let { data: notes, error } = await supabase
          .from("notes")
          .select("*")
          .limit(0);

        if (error) {
          throw error;
        }

        setNotes(notes || []);
        console.log(notes);
      } catch (err) {
        console.error("Error fetching games:", err);
        setError("Failed to load games. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags)));

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const handleSave = (id: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, title: editTitle, content: editContent }
          : note
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const handleAddNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: "New Note",
      content: "Add your content here...",
      createdAt: new Date().toISOString(),
      tags: [],
    };
    setNotes([newNote, ...notes]);
    setEditingId(newNote.id);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      searchTerm === "" ||
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag === null || note.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="flex flex-col gap-6 p-4 pt-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Notes</h1>
        <Button
          onClick={handleAddNote}
          className="bg-black hover:bg-black/80 dark:bg-white dark:hover:bg-white/80 text-white dark:text-black"
        >
          <Plus className="mr-2 size-4" />
          New Note
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setSearchTerm("")}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() =>
                selectedTag === tag ? setSelectedTag(null) : setSelectedTag(tag)
              }
              className="h-8"
            >
              {tag}
            </Button>
          ))}
          {selectedTag && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTag(null)}
              className="h-8"
            >
              <X className="size-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="transition-shadow hover:shadow-md">
            <CardHeader className="p-4 pb-2">
              {editingId === note.id ? (
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="font-semibold text-lg"
                />
              ) : (
                <CardTitle className="flex justify-between items-start">
                  <span className="text-lg truncate">{note.title}</span>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(note)}
                    >
                      <Edit2 className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(note.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardTitle>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formatDate(note.createdAt)}
              </p>
            </CardHeader>

            <Separator className="mx-4 bg-gray-200 dark:bg-gray-700" />

            <CardContent className="p-4 pt-3">
              {editingId === note.id ? (
                <div className="space-y-4">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 min-h-24 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="flex justify-end">
                    <Button onClick={() => handleSave(note.id)}>
                      <Save className="size-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm line-clamp-3">{note.content}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="flex flex-col w-fit self-center items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
            No notes found
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Try adjusting your search filters
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
            or create a new note
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setSelectedTag(null);
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
