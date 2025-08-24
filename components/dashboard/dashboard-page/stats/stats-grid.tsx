import { FileText, Gamepad2, StickyNote, Users } from "lucide-react";
import StatCard from "./stat-card";
import { formatDistanceToNow } from "date-fns";
import { DashboardData } from "../dashboard-page";

export default function StatsGrid({ data }: { data: DashboardData }) {
  const { games, teams, stats } = data;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Games"
        icon={Gamepad2}
        value={stats.totalGames}
        description={
          games.length > 0 && games[0].created_at
            ? `Latest: ${formatDistanceToNow(new Date(games[0].created_at), { addSuffix: true })}`
            : "No games yet"
        }
      />
      <StatCard
        title="Documents"
        icon={FileText}
        value={stats.totalDocuments}
        description={`${stats.documentSections} total sections`}
      />
      <StatCard
        title="Teams"
        icon={Users}
        value={stats.totalTeams}
        description={`${teams.reduce((acc, team) => acc + (team.member_count || 0), 0)} total members`}
      />
      <StatCard
        title="Notes"
        icon={StickyNote}
        value={stats.totalNotes}
        description="Personal notes & ideas"
      />
    </div>
  );
}
