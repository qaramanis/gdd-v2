import { formatDistanceToNow } from "date-fns";
import { StickyNote } from "lucide-react";
import { useRouter } from "next/navigation";
import EmptyState from "../empty-state";
import { Note } from "../dashboard-page";

export default function NotesTabContent({ notes }: { notes: Note[] }) {
  const router = useRouter();

  if (notes.length === 0) {
    return <EmptyState message="No notes yet. Start taking notes!" />;
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <ProjectListItem
          key={note.id}
          icon={StickyNote}
          title={note.title || "Untitled Note"}
          subtitle={formatDistanceToNow(new Date(note.updated_at), {
            addSuffix: true,
          })}
          onClick={() => router.push(`/notes/${note.id}`)}
        />
      ))}
    </div>
  );
}
