"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Users,
  Gamepad2,
  Clock,
  Calendar,
  ArrowRight,
  Plus,
  Activity,
  FolderOpen,
  UserPlus,
  Target,
  Zap,
  StickyNote,
} from "lucide-react";
import { supabase } from "@/database/supabase";
import { useUser } from "@/providers/user-context";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import DashboardSkeleton from "./dashboard-skeleton";
import ActivityOverviewCard from "./activity/activity-overview-card";
import DashboardHeader from "./dashboard-header";
import GamesByPlatformCard from "./games/games-by-platform-card";
import ProjectSummaryCard from "./projects/project-summary-card";
import StatsGrid from "./stats/stats-grid";
import TeamsCard from "./teams/teams-card";
import RecentProjectsCard from "./projects/recent-projects-card";
import QuickActionsCard from "./quick-actions/quick-actions-card";

export interface Game {
  id: number;
  name: string;
  concept: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  platforms?: string[];
  release_date?: string;
  team_id?: number;
}

export interface Document {
  id: string;
  title: string;
  game_id: number;
  created_at: string;
  updated_at: string;
  is_game_document?: boolean;
}

export interface DocumentSection {
  id: string;
  document_id: string;
  title: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  member_count?: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  created_at: string;
  metadata?: any;
}

export interface Stats {
  totalGames: number;
  totalDocuments: number;
  totalTeams: number;
  totalNotes: number;
  documentSections: number;
  recentActivities: number;
}

export interface DashboardData {
  games: Game[];
  documents: Document[];
  teams: Team[];
  notes: Note[];
  activities: ActivityLog[];
  documentSections: DocumentSection[];
  stats: Stats;
}

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const userId = user?.id;

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
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
  });

  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch games
      const { data: gamesData, error: gamesError } = await supabase
        .from("games")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (gamesError) throw gamesError;

      // Fetch documents
      const { data: documentsData, error: documentsError } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (documentsError) throw documentsError;

      // Fetch document sections
      let sectionsData: DocumentSection[] = [];
      if (documentsData && documentsData.length > 0) {
        const documentIds = documentsData.map((d) => d.id);
        const { data, error: sectionsError } = await supabase
          .from("document_sections")
          .select("*")
          .in("document_id", documentIds)
          .order("updated_at", { ascending: false });

        if (!sectionsError && data) {
          sectionsData = data;
        }
      }

      // Fetch teams and member count
      const { data: teamsData, error: teamsError } = await supabase
        .from("team_members")
        .select(
          `
          team_id,
          teams (
            id,
            name,
            description,
            created_at
          )
        `,
        )
        .eq("user_id", userId);

      if (teamsError) throw teamsError;

      const teamsWithCount = await Promise.all(
        (teamsData || []).map(async (item: any) => {
          const { count } = await supabase
            .from("team_members")
            .select("*", { count: "exact", head: true })
            .eq("team_id", item.team_id);

          return {
            ...item.teams,
            member_count: count || 0,
          };
        }),
      );

      // Fetch notes
      const { data: notesData } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(5);

      // Fetch activity logs
      const { data: activitiesData } = await supabase
        .from("activity_log")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      // Set all data at once
      setDashboardData({
        games: gamesData || [],
        documents: documentsData || [],
        teams: teamsWithCount,
        notes: notesData || [],
        activities: activitiesData || [],
        documentSections: sectionsData,
        stats: {
          totalGames: gamesData?.length || 0,
          totalDocuments: documentsData?.length || 0,
          totalTeams: teamsWithCount.length,
          totalNotes: notesData?.length || 0,
          documentSections: sectionsData.length,
          recentActivities: activitiesData?.length || 0,
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || userLoading) {
    return <DashboardSkeleton />;
  }

  const hasData =
    dashboardData.games.length > 0 || dashboardData.documents.length > 0;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardHeader />
      <StatsGrid data={dashboardData} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentProjectsCard data={dashboardData} />
        <ActivityOverviewCard data={dashboardData} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <GamesByPlatformCard games={dashboardData.games} />
        <TeamsCard teams={dashboardData.teams} />
        <QuickActionsCard />
      </div>

      {hasData && <ProjectSummaryCard data={dashboardData} />}
    </div>
  );
}
