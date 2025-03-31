import React from "react";
import { Edit2, GamepadIcon, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Note } from "@/types/notes";
import { formatDate } from "@/lib/date-utils";

interface NotesCardProps {
  note: Note;
  isEditing: boolean;
  editTitle: string;
  editContent: string;
  setEditTitle: (title: string) => void;
  setEditContent: (content: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  setSelectedGame: (game: string | null) => void;
  setSelectedTag: (tag: string | null) => void;
}

export function NotesCard({
  note,
  isEditing,
  editTitle,
  editContent,
  setEditTitle,
  setEditContent,
  onEdit,
  onSave,
  onDelete,
  setSelectedGame,
  setSelectedTag,
}: NotesCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="font-semibold text-lg"
          />
        ) : (
          <CardTitle className="flex justify-between items-start">
            <div>
              <span className="text-lg truncate block">{note.title}</span>
              {note.game && (
                <div className="flex items-center mt-1">
                  <span
                    className="text-xs px-2 py-0.5 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center cursor-pointer hover:bg-primary/20 dark:hover:bg-primary/30"
                    onClick={() => setSelectedGame(note.game)}
                  >
                    <GamepadIcon className="size-3 mr-1" />
                    {note.game}
                  </span>
                </div>
              )}
            </div>
            <div className="flex space-x-1 ml-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={onEdit}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="size-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="size-4 text-red-400" />
              </Button>
            </div>
          </CardTitle>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {formatDate(note.createdAt)}
        </p>
        <Separator className=" bg-gray-200 dark:bg-gray-700" />
      </CardHeader>

      <CardContent className="p-4 pt-3">
        {isEditing ? (
          <EditNoteContent
            content={editContent}
            setContent={setEditContent}
            onSave={onSave}
          />
        ) : (
          <NoteContent
            content={note.content}
            tags={note.tags}
            onTagClick={setSelectedTag}
          />
        )}
      </CardContent>
    </Card>
  );
}

interface EditNoteContentProps {
  content: string;
  setContent: (content: string) => void;
  onSave: () => void;
}

function EditNoteContent({
  content,
  setContent,
  onSave,
}: EditNoteContentProps) {
  return (
    <div className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 min-h-24 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
      />
      <div className="flex justify-end">
        <Button onClick={onSave} className="cursor-pointer rounded-full">
          <Save className="size-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
}

interface NoteContentProps {
  content: string;
  tags: string[];
  onTagClick: (tag: string) => void;
}

function NoteContent({ content, tags, onTagClick }: NoteContentProps) {
  return (
    <div>
      <p className="text-sm line-clamp-4">{content}</p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => onTagClick(tag)}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
