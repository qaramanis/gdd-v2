import { useRouter } from "next/navigation";
import EmptyState from "./empty-state";
import { formatDistanceToNow } from "date-fns";
import { FileText } from "lucide-react";
import { Document } from "./dashboard-page";
import ProjectListItem from "./projects/project-list-item";

export default function DocumentsTabContent({
  documents,
}: {
  documents: Document[];
}) {
  const router = useRouter();

  if (documents.length === 0) {
    return (
      <EmptyState message="No documents yet. Start documenting your games!" />
    );
  }

  return (
    <div className="space-y-4">
      {documents.slice(0, 5).map((doc) => (
        <ProjectListItem
          key={doc.id}
          icon={FileText}
          title={doc.title}
          subtitle={`Updated ${formatDistanceToNow(new Date(doc.updated_at), { addSuffix: true })}`}
          onClick={() => router.push(`/games/${doc.game_id}/document`)}
        />
      ))}
    </div>
  );
}
