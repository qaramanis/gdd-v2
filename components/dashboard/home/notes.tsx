"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, GamepadIcon } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/database/supabase";
import { formatDate } from "@/lib/date-utils";

interface Note {
  id: string;
  created_at: string;
  title: string;
  content: string;
  tags: string[] | null;
  game: string | null;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNotes() {
      try {
        setLoading(true);

        let { data: notes, error } = await supabase
          .from("notes")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) {
          throw error;
        }

        setNotes(notes || []);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError("Failed to load notes. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, []);

  return (
    <div className="bg-primary/5 p-6 rounded-lg md:w-128 md:h-128 flex flex-col dark:bg-gray-900/60 md:flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Personal Notes</h2>
        <Link href="/notes">
          <Button variant="ghost" size="sm" className="text-xs rounded-full">
            View All
            <ArrowRightIcon className="size-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className=" overflow-y-auto">
        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading notes...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : notes.length === 0 ? (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            No notes yet. Add notes from the notes page.
          </div>
        ) : (
          notes.map((note) => (
            <Link href={`/notes#${note.id}`} key={note.id}>
              <div className="p-3 bg-white mb-2 dark:bg-gray-800 rounded-md flex flex-col hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{note.title}</h3>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{formatDate(note.created_at)}</span>
                      {note.game && (
                        <span className="flex items-center">
                          <GamepadIcon className="size-3 mr-1" />
                          {note.game}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs mt-2 line-clamp-2">{note.content}</p>

                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
